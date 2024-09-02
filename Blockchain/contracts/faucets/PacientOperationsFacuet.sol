// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { LibStructStorage } from "../libraries/LibStructStorage.sol";
import { LibMedicalStorage } from "../libraries/LibMedicalStorage.sol";
import { LibAccessControlStorage as Storage } from "../libraries/LibAccessControlStorage.sol";
import { IPacientOperationsFaucet } from "../interfaces/IPacientOperationsFaucet.sol";

contract PacientOperationsFaucet is IPacientOperationsFaucet {
	function register(string memory pacientHash) external {
		Storage.AccessControlStorage storage s = Storage.getStorage();

		require(bytes(s._pacients[msg.sender]).length == 0, LibStructStorage.PACIENT_ALREADY_EXISTS);

		s._pacients[msg.sender] = pacientHash;
		emit PacientRegistered(msg.sender, pacientHash);
	}

	function getMedics(string memory pacientHash) external view returns (address[] memory) {
		Storage.AccessControlStorage storage s = Storage.getStorage();

		require(keccak256(bytes(s._pacients[msg.sender])) == keccak256(bytes(pacientHash)),LibStructStorage.PACIENT_HASH_ADDRESS_DO_NOT_MATCH);

		LibMedicalStorage.MedicalStorage storage m = LibMedicalStorage.getStorage();
		return m.pacientMedics[pacientHash];

	}

	function getReportsFromMedic(
		address medic,
		string memory pacientHash
	) external view returns (LibMedicalStorage.MedicalReport[] memory) {
		Storage.AccessControlStorage storage s = Storage.getStorage();

		require(keccak256(bytes(s._pacients[msg.sender])) == keccak256(bytes(pacientHash)),LibStructStorage.PACIENT_HASH_ADDRESS_DO_NOT_MATCH);

		return LibMedicalStorage.getStorage().medicalReports[medic][pacientHash];
	}
}
