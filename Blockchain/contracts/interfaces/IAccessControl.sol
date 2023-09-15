// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

interface IAccessControl {
    	/**
	 * @notice  Emitted when `account` is granted `role`.
	 * @dev     Emitted when `account` is granted `role`.
	 * @dev     `sender` is the account that originated the contract call, an admin role
	 *          bearer except when using {AccessControl-_setupRole}.
	 */
	event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    function hasRole(bytes32 role, address account) external view returns (bool);

    function isUser(address caller) external view returns (bool);
}