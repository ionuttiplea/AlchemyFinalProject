// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

/**
 * @title   Diamond Storage for Medical Diamond's access control functions
 */
library LibAccessControlStorage {
	bytes32 public constant ACCESS_CONTROL_STORAGE_SLOT = keccak256("ACCESS.CONTROL.STORAGE");

	/**
	 * @dev Inspired by OpenZeppelin's AccessControl Roles, but updated to this use case (without RoleAdmin)
	 */
	struct RoleData {
		// members[address] is true if address has role
		mapping(address => address) members;
	}

	/**
	 * @dev https://dev.to/mudgen/how-diamond-storage-works-90e
	 */
	struct AccessControlStorage {
		// OWNER_ROLE and MEDIC_ROLE
		mapping(bytes32 => RoleData) _roles;
		mapping(address => bool) _pacients;
		bool _initialized;
	}

	/**
	 * @dev     https://dev.to/mudgen/how-diamond-storage-works-90e
	 * @return  s  Returns a pointer to a specific (arbitrary) location in memory, holding our AccessControlStorage struct
	 */
	function getStorage() internal pure returns (AccessControlStorage storage s) {
		bytes32 position = ACCESS_CONTROL_STORAGE_SLOT;
		assembly {
			s.slot := position
		}
	}
}
