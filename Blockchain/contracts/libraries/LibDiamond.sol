// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
error InitializationFunctionReverted(address _initializationContractAddress, bytes _calldata);

library LibDiamond {
    bytes32 public constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.diamond.storage");

	struct FacetAddressAndPosition {
		address facetAddress;
		uint96 functionSelectorPosition; // position in facetFunctionSelectors.functionSelectors array
	}

	struct FacetFunctionSelectors {
		bytes4[] functionSelectors;
		uint256 facetAddressPosition; // position of facetAddress in facetAddresses array
	}

    struct DiamondStorage {
	// maps function selector to the facet address and
	// the position of the selector in the facetFunctionSelectors.selectors array
	mapping(bytes4 => FacetAddressAndPosition) selectorToFacetAndPosition;
	// maps facet addresses to function selectors
	mapping(address => FacetFunctionSelectors) facetFunctionSelectors;
	// facet addresses
	address[] facetAddresses;
	// Used to query if a contract implements an interface.
	// Used to implement ERC-165.
	mapping(bytes4 => bool) supportedInterfaces;
	}

	event DiamondCut(IDiamondCut.FacetCut[] _diamondCut, address _init, bytes _calldata);

	// Internal function version of diamondCut
	function diamondCut(IDiamondCut.FacetCut[] memory diamondCuts, address init, bytes memory calldata_) internal {
		for (uint256 facetIndex; facetIndex < diamondCuts.length; ) {
			IDiamondCut.FacetCutAction action = diamondCuts[facetIndex].action;
			if (action == IDiamondCut.FacetCutAction.Add) {
				addFunctions(diamondCuts[facetIndex].facetAddress, diamondCuts[facetIndex].functionSelectors);
			} else {
				// solhint-disable-next-line reason-string
				revert("LibDiamondCut: Incorrect FacetCutAction");
			}

			unchecked {
				++facetIndex;
			}
		}
		emit DiamondCut(diamondCuts, init, calldata_);
		initializeDiamondCut(init, calldata_);
	}

	function addFunctions(address facetAddress, bytes4[] memory functionSelectors) internal {
		// solhint-disable-next-line reason-string
		require(functionSelectors.length > 0, "LibDiamondCut: No selectors in facet to cut");
		DiamondStorage storage ds = diamondStorage();

		// solhint-disable-next-line reason-string
		require(facetAddress != address(0), "LibDiamondCut: Add facet can't be address(0)");
		uint96 selectorPosition = uint96(ds.facetFunctionSelectors[facetAddress].functionSelectors.length);
		// add new facet address if it does not exist
		if (selectorPosition == 0) {
			addFacet(ds, facetAddress);
		}
		for (uint256 selectorIndex; selectorIndex < functionSelectors.length; ) {
			bytes4 selector = functionSelectors[selectorIndex];
			address oldFacetAddress = ds.selectorToFacetAndPosition[selector].facetAddress;

			// solhint-disable-next-line reason-string
			require(oldFacetAddress == address(0), "LibDiamondCut: Can't add function that already exists");
			addFunction(ds, selector, selectorPosition, facetAddress);
			selectorPosition++;

			unchecked {
				++selectorIndex;
			}
		}
	}

	function addFacet(DiamondStorage storage ds, address facetAddress) internal {
		enforceHasContractCode(facetAddress, "LibDiamondCut: New facet has no code");
		ds.facetFunctionSelectors[facetAddress].facetAddressPosition = ds.facetAddresses.length;
		ds.facetAddresses.push(facetAddress);
	}

	function addFunction(
		DiamondStorage storage ds,
		bytes4 selector,
		uint96 selectorPosition,
		address facetAddress
	) internal {
		ds.selectorToFacetAndPosition[selector].functionSelectorPosition = selectorPosition;
		ds.facetFunctionSelectors[facetAddress].functionSelectors.push(selector);
		ds.selectorToFacetAndPosition[selector].facetAddress = facetAddress;
	}

	function initializeDiamondCut(address init, bytes memory calldata_) internal {
		if (init == address(0)) {
			return;
		}
		enforceHasContractCode(init, "LibDiamondCut: _init address has no code");

		// solhint-disable-next-line avoid-low-level-calls
		(bool success, bytes memory error) = init.delegatecall(calldata_);
		if (!success) {
			if (error.length > 0) {
				// bubble up error
				/// @solidity memory-safe-assembly
				assembly {
					let returndata_size := mload(error)
					revert(add(32, error), returndata_size)
				}
			} else {
				revert InitializationFunctionReverted(init, calldata_);
			}
		}
	}

	function enforceHasContractCode(address contract_, string memory errorMessage) internal view {
		uint256 contractSize;
		assembly {
			contractSize := extcodesize(contract_)
		}
		require(contractSize > 0, errorMessage);
	}

	function diamondStorage() internal pure returns (DiamondStorage storage ds) {
		bytes32 position = DIAMOND_STORAGE_POSITION;
		assembly {
			ds.slot := position
		}
	}
}