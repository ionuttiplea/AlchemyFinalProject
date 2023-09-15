// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IERC165 } from "@openzeppelin/contracts/interfaces/IERC165.sol";

import { IDiamondLoupe } from "../interfaces/IDiamondLoupe.sol";

import { LibDiamond } from "../libraries/LibDiamond.sol";

contract DiamondInit {
	// You can add parameters to this function in order to pass in
	// data to set your own state variables

	/**
	 * @dev     Currently called from any of our Diamonds' constructors
	 * @dev     Initializes storage with the correct interfaces supported
	 */
	function init() external {
		// adding ERC165 data
		LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
		ds.supportedInterfaces[type(IERC165).interfaceId] = true;
		ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
	}
}
