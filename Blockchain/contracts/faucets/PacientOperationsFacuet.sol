// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { LibStructStorage } from "../libraries/LibStructStorage.sol";
import { LibMedicalStorage } from "../libraries/LibMedicalStorage.sol";
import { LibAccessControlStorage as Storage } from "../libraries/LibAccessControlStorage.sol";
import { IPacientOperationsFaucet } from "../interfaces/IPacientOperationsFaucet.sol";

contract PacientOperationsFaucet is IPacientOperationsFaucet {
	function register(string memory pacientHash) external {
		Storage.AccessControlStorage storage s = Storage.getStorage();

		require(!s._pacients[msg.sender], LibStructStorage.PACIENT_ALREADY_EXISTS);

		s._pacients[msg.sender] = true;
		emit PacientRegistered(msg.sender, pacientHash);
	}

	function getMedics(string memory pacientHash) external view returns (address[] memory) {
		LibMedicalStorage.MedicalStorage storage s = LibMedicalStorage.getStorage();

		return s.pacientMedics[pacientHash];
	}

	function getReportsFromMedic(
		address medic,
		string memory pacientHash
	) external view returns (LibMedicalStorage.MedicalReport[] memory) {
		return LibMedicalStorage.getStorage().medicalReports[medic][pacientHash];
	}
}
