// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IAccessControl } from "../interfaces/IAccessControl.sol";
import { LibStructStorage } from "../libraries/LibStructStorage.sol";
import { LibAccessControlStorage } from "../libraries/LibAccessControlStorage.sol";

contract AccessControlFaucet is IAccessControl {
	using LibAccessControlStorage for LibAccessControlStorage.AccessControlStorage;
	bool private initialized = false;

    modifier isOwner() {
        require( hasRole(LibStructStorage.OWNER_ROLE, msg.sender), LibStructStorage.SHOULD_BE_OWNER );
        _;
    }

 	function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
		return LibAccessControlStorage.getStorage()._roles[role].members[account] != address(0x0);
	}

    /**
	 * @dev     Checks if a given address is a user(pacient) only (not medic, not operator)
	 * @param   caller  caller address
	 * @return  bool  if sender is a user address only
	 */
	function isUser(address caller) external view returns (bool) {
		LibAccessControlStorage.AccessControlStorage storage s = LibAccessControlStorage.getStorage();
		return s._pacients[caller];
	}
}