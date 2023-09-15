// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

library LibMedicalStorage {
    bytes32 public constant MEDICAL_STORAGE_SLOT = keccak256("MEDICAL.STORAGE");

	struct MedicalReport {
		string reportCID;
		uint256 timestamp;
	}

	struct MedicalStorage {
		mapping( address => mapping ( string => MedicalReport[]) ) medicalReports;
		mapping( string => uint256 ) pacientReportCount;
		mapping( string => address[]) pacientMedics;
	}

	/**
	 * @dev     https://dev.to/mudgen/how-diamond-storage-works-90e
	 * @return  s  Returns a pointer to an "arbitrary" location in memory
	 */
	function getStorage() external pure returns (MedicalStorage storage s) {
		bytes32 position = MEDICAL_STORAGE_SLOT;
		assembly {
			s.slot := position
		}
	}
}