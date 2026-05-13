// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IConditionOracle {
    function isConditionMet(bytes calldata data) external view returns (bool);

    function getConditionDescription(bytes calldata data) external view returns (string memory);
}
