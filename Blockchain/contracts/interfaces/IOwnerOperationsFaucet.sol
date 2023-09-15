// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

interface IOwnerOperationsFaucet {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner );
    event MedicAccountAdded(address indexed medic );
    event MedicAccountRemoved(address indexed medic );

    function initializeOwnership() external;
    function transferOwnership( address newOwner ) external;
    function addMedic( address medic ) external;
    function removeMedic( address medic ) external;
}
