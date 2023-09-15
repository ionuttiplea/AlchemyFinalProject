// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { LibStructStorage } from "../libraries/LibStructStorage.sol";
import { LibAccessControlStorage as Storage } from "../libraries/LibAccessControlStorage.sol";
import { IOwnerOperationsFaucet } from "../interfaces/IOwnerOperationsFaucet.sol";
import { RoleBased } from "../RoleBased.sol";

contract OwnerOperationsFaucet is RoleBased, IOwnerOperationsFaucet{

    function initializeOwnership() external {
        Storage.AccessControlStorage storage s = Storage.getStorage();
        require( ! s._initialized, "You can't do that");
        s._roles[LibStructStorage.OWNER_ROLE].members[msg.sender] = msg.sender;
        s._initialized = true;
    }

    function transferOwnership( address newOwner ) external onlyOwner {
        require( newOwner != address(0) && newOwner != msg.sender, LibStructStorage.INVALID_OWNER_ADDRESS );

        Storage.AccessControlStorage storage s = Storage.getStorage();
        s._roles[LibStructStorage.OWNER_ROLE].members[msg.sender] = address(0x0);
        s._roles[LibStructStorage.OWNER_ROLE].members[newOwner] = newOwner;

        emit OwnershipTransferred(msg.sender, newOwner);
    }

    function addMedic( address medic ) external onlyOwner {
        require(medic != address(0) , LibStructStorage.INVALID_MEDIC_ADDRESS );

        Storage.AccessControlStorage storage s = Storage.getStorage();

        require ( s._roles[LibStructStorage.MEDIC_ROLE].members[medic] == address(0x0),  LibStructStorage.MEDIC_ALREADY_EXISTS);

        s._roles[LibStructStorage.MEDIC_ROLE].members[medic] = medic;

        emit MedicAccountAdded(medic);
    }

    function removeMedic( address medic ) external onlyOwner {
        require( medic != address(0) , LibStructStorage.INVALID_MEDIC_ADDRESS );

        Storage.AccessControlStorage storage s = Storage.getStorage();

        require ( s._roles[LibStructStorage.MEDIC_ROLE].members[medic] != address(0x0),  LibStructStorage.MEDIC_DOES_NOT_EXIST);

        s._roles[LibStructStorage.MEDIC_ROLE].members[medic] = address(0x0);

        emit MedicAccountRemoved(medic);
    }
}