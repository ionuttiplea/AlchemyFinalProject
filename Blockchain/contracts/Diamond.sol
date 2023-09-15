// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { LibDiamond } from "./libraries/LibDiamond.sol";
import { IOwnerOperationsFaucet } from "./interfaces/IOwnerOperationsFaucet.sol";
import { IMedicOperationsFaucet } from "./interfaces/IMedicOperationsFaucet.sol";
import { IPacientOperationsFaucet } from "./interfaces/IPacientOperationsFaucet.sol";
import { IAccessControl as IAccessControlFaucet } from "./interfaces/IAccessControl.sol";
import { IDiamondCut } from "./interfaces/IDiamondCut.sol";
import { IDiamondLoupe } from "./interfaces/IDiamondLoupe.sol";
import { IERC165 } from "@openzeppelin/contracts/interfaces/IERC165.sol";
import { DiamondInit } from "./faucets/DiamondInit.sol";

contract Diamond {
	constructor(
		address diamondLoupeFacet,
		address diamondInitFaucet,
		address accessControlFaucet,
		address ownerOperationFaucet,
		address medicOperationsFaucet,
		address pacientOperationsFaucet
	) {
		IDiamondCut.FacetCut[] memory cuts = new IDiamondCut.FacetCut[](6);

		// Diamond Loupe Facet
		bytes4[] memory diamondLoupeFacetSelectors = new bytes4[](5);
		diamondLoupeFacetSelectors[0] = IDiamondLoupe.facets.selector;
		diamondLoupeFacetSelectors[1] = IDiamondLoupe.facetFunctionSelectors.selector;
		diamondLoupeFacetSelectors[2] = IDiamondLoupe.facetAddresses.selector;
		diamondLoupeFacetSelectors[3] = IDiamondLoupe.facetAddress.selector;
		diamondLoupeFacetSelectors[4] = IERC165.supportsInterface.selector;

		cuts[0] = IDiamondCut.FacetCut({
			facetAddress: diamondLoupeFacet,
			action: IDiamondCut.FacetCutAction.Add,
			functionSelectors: diamondLoupeFacetSelectors
		});

		bytes4[] memory diamondInitFacetSelectors = new bytes4[](1);
		diamondInitFacetSelectors[0] = DiamondInit.init.selector;

		cuts[1] = IDiamondCut.FacetCut({
			facetAddress: diamondInitFaucet,
			action: IDiamondCut.FacetCutAction.Add,
			functionSelectors: diamondInitFacetSelectors
		});

		bytes4[] memory accessControlFaucetSelectors = new bytes4[](2);
		accessControlFaucetSelectors[0] = IAccessControlFaucet.hasRole.selector;
		accessControlFaucetSelectors[1] = IAccessControlFaucet.isUser.selector;

		cuts[2] = IDiamondCut.FacetCut({
			facetAddress: accessControlFaucet,
			action: IDiamondCut.FacetCutAction.Add,
			functionSelectors: accessControlFaucetSelectors
		});

		bytes4[] memory medicOperationFaucetSelectors = new bytes4[](3);
		medicOperationFaucetSelectors[0] = IMedicOperationsFaucet.medicAddReport.selector;
		medicOperationFaucetSelectors[1] = IMedicOperationsFaucet.medicGetReportHash.selector;
		medicOperationFaucetSelectors[2] = IMedicOperationsFaucet.medicGetReportsForPacient.selector;

		cuts[3] = IDiamondCut.FacetCut({
			facetAddress: medicOperationsFaucet,
			action: IDiamondCut.FacetCutAction.Add,
			functionSelectors: medicOperationFaucetSelectors
		});

		bytes4[] memory ownerOperationFaucetSelectors = new bytes4[](4);
		ownerOperationFaucetSelectors[0] = IOwnerOperationsFaucet.initializeOwnership.selector;
		ownerOperationFaucetSelectors[1] = IOwnerOperationsFaucet.addMedic.selector;
		ownerOperationFaucetSelectors[2] = IOwnerOperationsFaucet.removeMedic.selector;
		ownerOperationFaucetSelectors[3] = IOwnerOperationsFaucet.transferOwnership.selector;

		cuts[4] = IDiamondCut.FacetCut({
			facetAddress: ownerOperationFaucet,
			action: IDiamondCut.FacetCutAction.Add,
			functionSelectors: ownerOperationFaucetSelectors
		});

		bytes4[] memory pacientOperactionFaucetSelectors = new bytes4[](3);
		pacientOperactionFaucetSelectors[0] = IPacientOperationsFaucet.register.selector;
		pacientOperactionFaucetSelectors[1] = IPacientOperationsFaucet.getMedics.selector;
		pacientOperactionFaucetSelectors[2] = IPacientOperationsFaucet.getReportsFromMedic.selector;

		cuts[5] = IDiamondCut.FacetCut({
			facetAddress: pacientOperationsFaucet,
			action: IDiamondCut.FacetCutAction.Add,
			functionSelectors: pacientOperactionFaucetSelectors
		});
		LibDiamond.diamondCut(cuts, address(0), "");
	}

	// solhint-disable-next-line no-empty-blocks
	receive() external payable {}

	fallback() external payable {
		LibDiamond.DiamondStorage storage ds;
		bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
		// get diamond storage
		assembly {
			ds.slot := position
		}
		// get facet from function selector
		address facet = ds.selectorToFacetAndPosition[msg.sig].facetAddress;
		require(facet != address(0), string(abi.encodePacked("Diamond: Function does not exist: ", msg.sig)));

		// Execute external function from facet using delegatecall and return any value.
		assembly {
			// copy function selector and any arguments
			calldatacopy(0, 0, calldatasize())
			// execute function call using the facet
			let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
			// get any return value
			returndatacopy(0, 0, returndatasize())
			// return any return value or error back to the caller
			switch result
			case 0 {
				revert(0, returndatasize())
			}
			default {
				return(0, returndatasize())
			}
		}
	}
}
