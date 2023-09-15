// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

library LibStructStorage {
	string public constant SHOULD_BE_END_USER = "19";
	string public constant SHOULD_BE_MEDIC = "20";
	string public constant SHOULD_BE_OWNER = "21";
	string public constant INVALID_OWNER_ADDRESS = "22";
	string public constant INVALID_MEDIC_ADDRESS = "23";
	string public constant MEDIC_ALREADY_EXISTS = "24";
	string public constant MEDIC_DOES_NOT_EXIST = "25";
	string public constant PACIENT_ALREADY_EXISTS = "26";

	// Used by AccessControlFacet's OpenZeppelin Roles implementation
	bytes32 public constant OWNER_ROLE = keccak256("OWNER");
	bytes32 public constant MEDIC_ROLE = keccak256("MEDIC");
}
