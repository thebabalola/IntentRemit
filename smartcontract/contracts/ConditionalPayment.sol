// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IConditionOracle} from "./IConditionOracle.sol";
import {IYieldProtocol} from "./IYieldProtocol.sol";

contract ConditionalPayment is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable sender;
    address public immutable recipient;
    address public immutable token; // address(0) for native CELO
    uint256 public immutable totalAmount;
    uint256 public immutable immediateAmount;
    uint256 public immutable lockedAmount;
    uint256 public immutable createdAt;
    string public goal;

    enum ConditionType {
        TIMESTAMP,
        MANUAL,
        RECURRING,
        ORACLE
    }

    ConditionType public immutable conditionType;

    bool public immediateExecuted;
    bool public lockedExecuted;
    bool public refunded;

    // Condition data
    uint256 public executeAt;      // For TIMESTAMP
    uint256 public startTime;      // For RECURRING
    uint256 public interval;       // For RECURRING
    uint256 public occurrences;    // For RECURRING
    uint256 public executedCount;  // For RECURRING

    // Oracle data
    address public oracleAddress;  // For ORACLE
    bytes public oracleData;       // For ORACLE

    // Manual approval tracking
    mapping(address => bool) public approvedBy;
    address[] public approvers;
    uint256 public requiredApprovals;

    // Growth Vault / Yield Integration (Placeholder for Phase 2)
    address public yieldPool;
    bool public isYieldBearing;

    // Configurable refund timeout — set by factory at deploy time (default 30 days)
    uint256 public refundTimeout;

    event PaymentExecuted(address indexed paymentAddress, address recipient, uint256 amount, bool isImmediate);
    event PaymentRefunded(address indexed paymentAddress, address sender, uint256 amount);
    event ManualApproval(address indexed approver, address indexed paymentAddress);

    constructor(
        address _sender,
        address _recipient,
        address _token,
        uint256 _totalAmount,
        uint256 _immediateAmount,
        string memory _goal,
        uint8 _conditionType,
        bytes memory _conditionData,
        uint256 _refundTimeout
    ) payable {
        require(_sender != address(0), "Invalid sender");
        require(_recipient != address(0), "Invalid recipient");
        require(_totalAmount > 0, "Amount must be > 0");
        require(_immediateAmount <= _totalAmount, "Invalid split");
        
        if (_token == address(0)) {
            require(msg.value == _totalAmount, "Value mismatch");
        } else {
            require(msg.value == 0, "Native value with ERC20");
        }

        sender = _sender;
        recipient = _recipient;
        token = _token;
        totalAmount = _totalAmount;
        immediateAmount = _immediateAmount;
        lockedAmount = _totalAmount - _immediateAmount;
        goal = _goal;
        createdAt = block.timestamp;
        conditionType = ConditionType(_conditionType);
        refundTimeout = _refundTimeout > 0 ? _refundTimeout : 30 days;

        _decodeConditionData(_conditionData);
    }

    function _decodeConditionData(bytes memory _conditionData) internal {
        if (conditionType == ConditionType.TIMESTAMP) {
            executeAt = abi.decode(_conditionData, (uint256));
            require(executeAt > block.timestamp, "Timestamp must be future");
        } else if (conditionType == ConditionType.MANUAL) {
            (address[] memory _approvers, uint256 _required) = abi.decode(
                _conditionData,
                (address[], uint256)
            );
            require(_approvers.length > 0, "Need approvers");
            require(_required > 0 && _required <= _approvers.length, "Invalid threshold");
            approvers = _approvers;
            requiredApprovals = _required;
        } else if (conditionType == ConditionType.RECURRING) {
            (uint256 _start, uint256 _interval, uint256 _occurrences) = abi.decode(
                _conditionData,
                (uint256, uint256, uint256)
            );
            require(_start >= block.timestamp, "Start in past");
            require(_interval >= 1 days, "Invalid interval");
            startTime = _start;
            interval = _interval;
            occurrences = _occurrences;
        } else if (conditionType == ConditionType.ORACLE) {
            (address _oracle, bytes memory _data) = abi.decode(_conditionData, (address, bytes));
            require(_oracle != address(0), "Invalid oracle address");
            oracleAddress = _oracle;
            oracleData = _data;
        }
    }

    function executeImmediate() external nonReentrant {
        require(!immediateExecuted, "Immediate already executed");
        require(!refunded, "Already refunded");
        require(immediateAmount > 0, "No immediate amount");

        immediateExecuted = true;
        _transfer(recipient, immediateAmount);
        emit PaymentExecuted(address(this), recipient, immediateAmount, true);
    }

    function executeLocked() external nonReentrant {
        require(!lockedExecuted, "Locked already executed");
        require(!refunded, "Already refunded");
        require(_checkCondition(), "Condition not met");

        if (conditionType == ConditionType.RECURRING) {
            uint256 perOccurrenceAmount = lockedAmount / (occurrences == 0 ? 1 : occurrences);
            require(perOccurrenceAmount > 0, "Recurring amount too small");
            
            executedCount++;
            startTime += interval;
            
            if (occurrences > 0 && executedCount >= occurrences) {
                lockedExecuted = true;
            }
            _transfer(recipient, perOccurrenceAmount);
            emit PaymentExecuted(address(this), recipient, perOccurrenceAmount, false);
        } else {
            lockedExecuted = true;
            _transfer(recipient, lockedAmount);
            emit PaymentExecuted(address(this), recipient, lockedAmount, false);
        }
    }

    function refund() external nonReentrant {
        require(!refunded, "Already refunded");
        require(msg.sender == sender || _isExpired(), "Refund not available");
        
        uint256 balance = _currentBalance();
        require(balance > 0, "No balance to refund");

        refunded = true;
        _transfer(sender, balance);
        emit PaymentRefunded(address(this), sender, balance);
    }

    function approveManual() external {
        require(conditionType == ConditionType.MANUAL, "Not manual payment");
        require(!lockedExecuted, "Already executed");
        require(!refunded, "Already refunded");
        require(_isApprover(msg.sender), "Not an approver");
        require(!approvedBy[msg.sender], "Already approved");
        
        approvedBy[msg.sender] = true;
        emit ManualApproval(msg.sender, address(this));
    }

    function _checkCondition() internal view returns (bool) {
        if (conditionType == ConditionType.TIMESTAMP) {
            return block.timestamp >= executeAt;
        } else if (conditionType == ConditionType.MANUAL) {
            return _getApprovalCount() >= requiredApprovals;
        } else if (conditionType == ConditionType.RECURRING) {
            return block.timestamp >= startTime && (occurrences == 0 || executedCount < occurrences);
        } else if (conditionType == ConditionType.ORACLE) {
            return IConditionOracle(oracleAddress).isConditionMet(oracleData);
        }
        return false;
    }

    function _isExpired() internal view returns (bool) {
        return block.timestamp > createdAt + refundTimeout;
    }

    function _transfer(address _to, uint256 _amount) internal {
        if (isYieldBearing && _to == recipient) {
            _withdrawFromYield(_amount);
        }

        if (token == address(0)) {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "Native transfer failed");
        } else {
            IERC20(token).safeTransfer(_to, _amount);
        }
    }

    function enableYield(address _yieldPool) external {
        require(msg.sender == sender, "Only sender");
        require(!isYieldBearing, "Already enabled");
        require(_yieldPool != address(0), "Invalid yield pool");
        require(token != address(0), "Yield only supported for ERC20"); // Moola/Aave typically take ERC20s like cUSD
        
        yieldPool = _yieldPool;
        isYieldBearing = true;
        
        uint256 balance = _currentBalance();
        if (balance > 0) {
            _depositToYield(balance);
        }
    }

    function _depositToYield(uint256 _amount) internal {
        if (!isYieldBearing || yieldPool == address(0)) return;
        IERC20(token).safeIncreaseAllowance(yieldPool, _amount);
        IYieldProtocol(yieldPool).deposit(token, _amount, address(this), 0);
    }

    function _withdrawFromYield(uint256 _amount) internal {
        if (!isYieldBearing || yieldPool == address(0)) return;
        IYieldProtocol(yieldPool).withdraw(token, _amount, address(this));
    }

    function _currentBalance() internal view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        } else {
            // Note: If funds are in the yield pool, the contract's actual token balance might be 0.
            // For simplicity, we assume we want the tracked token balance, but in a real setup,
            // we would check aToken balance. Since we only deposit `lockedAmount` usually,
            // returning the token balance is fine if it's not yield bearing.
            // If it is yield bearing, the actual withdrawable amount might be higher.
            return IERC20(token).balanceOf(address(this));
        }
    }

    function _getApprovalCount() internal view returns (uint256) {
        uint256 count;
        for (uint256 i; i < approvers.length; i++) {
            if (approvedBy[approvers[i]]) count++;
        }
        return count;
    }

    function _isApprover(address _addr) internal view returns (bool) {
        for (uint256 i; i < approvers.length; i++) {
            if (approvers[i] == _addr) return true;
        }
        return false;
    }

    // View functions
    function checkCondition() external view returns (bool) {
        return _checkCondition();
    }

    function getStatus() external view returns (
        bool _immediateExecuted,
        bool _lockedExecuted,
        bool _refunded,
        uint256 _balance
    ) {
        uint256 currentBalance = _currentBalance();
        return (immediateExecuted, lockedExecuted, refunded, currentBalance);
    }

    receive() external payable {
        require(token == address(0), "Only native");
    }
}
