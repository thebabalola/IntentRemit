// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ConditionalPayment} from "./ConditionalPayment.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PaymentFactory {
    using SafeERC20 for IERC20;

    address[] public adminList;
    mapping(address => uint256) public adminIndexPlusOne;

    // Admin Proposals
    struct AdminProposal {
        address candidate;
        bool isAdd;
        uint256 approvals;
        bool executed;
    }
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    uint256 public nextProposalId;
    mapping(uint256 => AdminProposal) public proposals;

    uint256 public defaultRefundTimeout = 30 days; // Governable by admin

    uint256 public totalPayments;
    mapping(uint256 => address) public payments;
    mapping(address => uint256[]) public userPayments;

    enum ConditionType {
        TIMESTAMP,
        MANUAL,
        RECURRING,
        ORACLE
    }

    event PaymentCreated(
        uint256 indexed paymentId,
        address indexed paymentAddress,
        address indexed sender,
        address recipient,
        address token,
        uint256 totalAmount,
        uint256 immediateAmount,
        string goal,
        ConditionType conditionType
    );

    constructor() {
        adminList.push(msg.sender);
        adminIndexPlusOne[msg.sender] = adminList.length;
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Not admin");
        _;
    }

    function isAdmin(address account) public view returns (bool) {
        return adminIndexPlusOne[account] > 0;
    }

    function proposeAdminChange(address candidate, bool isAdd) external onlyAdmin returns (uint256) {
        require(candidate != address(0), "Zero address");
        require(isAdd != isAdmin(candidate), "Already in target state");
        
        uint256 proposalId = nextProposalId++;
        AdminProposal storage p = proposals[proposalId];
        p.candidate = candidate;
        p.isAdd = isAdd;
        p.approvals = 1;
        hasApproved[proposalId][msg.sender] = true;

        _executeIfReady(proposalId);
        return proposalId;
    }

    function approveAdminChange(uint256 proposalId) external onlyAdmin {
        AdminProposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(!hasApproved[proposalId][msg.sender], "Already approved");
        require(p.isAdd != isAdmin(p.candidate), "State changed");

        hasApproved[proposalId][msg.sender] = true;
        p.approvals++;

        _executeIfReady(proposalId);
    }

    function _executeIfReady(uint256 proposalId) internal {
        AdminProposal storage p = proposals[proposalId];
        uint256 requiredApprovals = adminList.length == 1 ? 1 : (adminList.length * 70 + 99) / 100;
        
        if (p.approvals >= requiredApprovals) {
            p.executed = true;
            if (p.isAdd) {
                adminList.push(p.candidate);
                adminIndexPlusOne[p.candidate] = adminList.length;
            } else {
                require(adminList.length > 1, "Cannot remove last admin");
                uint256 indexToRemove = adminIndexPlusOne[p.candidate] - 1;
                address lastAdmin = adminList[adminList.length - 1];
                
                adminList[indexToRemove] = lastAdmin;
                adminIndexPlusOne[lastAdmin] = indexToRemove + 1;
                
                adminList.pop();
                adminIndexPlusOne[p.candidate] = 0;
            }
        }
    }

    /// @notice Governance: update the default refund timeout for new payment contracts
    function setDefaultRefundTimeout(uint256 _timeout) external onlyAdmin {
        require(_timeout >= 1 days, "Min 1 day timeout");
        defaultRefundTimeout = _timeout;
    }

    function createPayment(
        address recipient,
        address token,
        uint256 totalAmount,
        uint256 immediateAmount,
        string calldata goal,
        ConditionType conditionType,
        bytes calldata conditionData
    ) external payable returns (address paymentAddress) {
        return _createPayment(
            msg.sender,
            msg.value,
            recipient,
            token,
            totalAmount,
            immediateAmount,
            goal,
            conditionType,
            conditionData
        );
    }

    function _createPayment(
        address sender,
        uint256 msgValue,
        address recipient,
        address token,
        uint256 totalAmount,
        uint256 immediateAmount,
        string calldata goal,
        ConditionType conditionType,
        bytes memory conditionData
    ) internal returns (address paymentAddress) {
        require(recipient != address(0), "Invalid recipient");
        require(totalAmount > 0, "Amount must be > 0");
        require(immediateAmount <= totalAmount, "Invalid split");

        // Handle token transfer if ERC20
        if (token != address(0)) {
            require(msgValue == 0, "Native value with ERC20");
            IERC20(token).safeTransferFrom(sender, address(this), totalAmount);
        } else {
            require(msgValue == totalAmount, "Value mismatch");
        }

        totalPayments++;
        uint256 paymentId = totalPayments;

        ConditionalPayment payment = new ConditionalPayment{
            value: token == address(0) ? totalAmount : 0
        }(
            sender,
            recipient,
            token,
            totalAmount,
            immediateAmount,
            goal,
            uint8(conditionType),
            conditionData,
            defaultRefundTimeout
        );

        // If ERC20, transfer the tokens from factory to the new payment contract
        if (token != address(0)) {
            IERC20(token).safeTransfer(address(payment), totalAmount);
        }

        paymentAddress = address(payment);
        payments[paymentId] = paymentAddress;
        userPayments[sender].push(paymentId);

        emit PaymentCreated(
            paymentId,
            paymentAddress,
            sender,
            recipient,
            token,
            totalAmount,
            immediateAmount,
            goal,
            conditionType
        );

        return paymentAddress;
    }

    // Helper functions for common payment types
    
    function createTimeBasedPayment(
        address recipient,
        address token,
        uint256 totalAmount,
        uint256 immediateAmount,
        string calldata goal,
        uint256 executeAt
    ) external payable returns (address) {
        return _createPayment(
            msg.sender,
            msg.value,
            recipient,
            token,
            totalAmount,
            immediateAmount,
            goal,
            ConditionType.TIMESTAMP,
            abi.encode(executeAt)
        );
    }

    function createManualPayment(
        address recipient,
        address token,
        uint256 totalAmount,
        uint256 immediateAmount,
        string calldata goal,
        address[] calldata approvers,
        uint256 requiredApprovals
    ) external payable returns (address) {
        return _createPayment(
            msg.sender,
            msg.value,
            recipient,
            token,
            totalAmount,
            immediateAmount,
            goal,
            ConditionType.MANUAL,
            abi.encode(approvers, requiredApprovals)
        );
    }

    // View functions
    function getPayment(uint256 paymentId) external view returns (address) {
        return payments[paymentId];
    }

    function getUserPaymentIds(address user) external view returns (uint256[] memory) {
        return userPayments[user];
    }

    function getUserPaymentCount(address user) external view returns (uint256) {
        return userPayments[user].length;
    }
}
