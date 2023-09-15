// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IMedicOperationsFaucet } from "../interfaces/IMedicOperationsFaucet.sol";
import { RoleBased } from "../RoleBased.sol";
import { LibMedicalStorage as Storage } from "../libraries/LibMedicalStorage.sol";

contract MedicOperationsFaucet is RoleBased, IMedicOperationsFaucet {
	function medicAddReport(string memory pacientHash, string memory reportCID) external onlyMedic returns (uint256) {
		Storage.MedicalStorage storage s = Storage.getStorage();
		s.medicalReports[msg.sender][pacientHash].push(Storage.MedicalReport(reportCID, block.timestamp));
		s.pacientReportCount[pacientHash] += 1;
		bool isAlreadyMedic = false;
		for (uint256 i = 0; i < s.pacientMedics[pacientHash].length; i++) {
			if (s.pacientMedics[pacientHash][i] == msg.sender) {
				isAlreadyMedic = true;
				break;
			}
		}
		if (!isAlreadyMedic) {
			s.pacientMedics[pacientHash].push(msg.sender);
		}

		emit MedicAddedReport(true);

		return s.pacientReportCount[pacientHash] - 1;
	}

	function medicGetReportHash(
		string memory pacientHash,
		uint256 reportNumber
	) external view onlyMedic returns (string memory) {
		Storage.MedicalStorage storage s = Storage.getStorage();
		require(reportNumber < s.pacientReportCount[pacientHash], "That report doesn't exist");

		return s.medicalReports[msg.sender][pacientHash][reportNumber].reportCID;
	}

	function medicGetReportsForPacient(
		string memory pacientHash
	) public view onlyMedic returns (Storage.MedicalReport[] memory) {
		Storage.MedicalStorage storage s = Storage.getStorage();
		return s.medicalReports[msg.sender][pacientHash];
	}
}
