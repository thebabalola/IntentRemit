// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ConditionalPayment} from "./ConditionalPayment.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PaymentFactory {
    using SafeERC20 for IERC20;

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

    function createPayment(
        address recipient,
        address token,
        uint256 totalAmount,
        uint256 immediateAmount,
        string calldata goal,
        ConditionType conditionType,
        bytes calldata conditionData
    ) external payable returns (address paymentAddress) {
        require(recipient != address(0), "Invalid recipient");
        require(totalAmount > 0, "Amount must be > 0");
        require(immediateAmount <= totalAmount, "Invalid split");

        // Handle token transfer if ERC20
        if (token != address(0)) {
            require(msg.value == 0, "Native value with ERC20");
            IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);
        } else {
            require(msg.value == totalAmount, "Value mismatch");
        }

        totalPayments++;
        uint256 paymentId = totalPayments;

        ConditionalPayment payment = new ConditionalPayment{
            value: token == address(0) ? totalAmount : 0
        }(
            msg.sender,
            recipient,
            token,
            totalAmount,
            immediateAmount,
            goal,
            uint8(conditionType),
            conditionData
        );

        // If ERC20, transfer the tokens from factory to the new payment contract
        if (token != address(0)) {
            IERC20(token).safeTransfer(address(payment), totalAmount);
        }

        paymentAddress = address(payment);
        payments[paymentId] = paymentAddress;
        userPayments[msg.sender].push(paymentId);

        emit PaymentCreated(
            paymentId,
            paymentAddress,
            msg.sender,
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
        return this.createPayment{value: msg.value}(
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
        return this.createPayment{value: msg.value}(
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
