// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;
import { LibMedicalStorage } from "../libraries/LibMedicalStorage.sol";

interface IPacientOperationsFaucet {
	event PacientRegistered(address, string);

	function register(string memory pacientHash) external;

	function getReportsFromMedic(
		address medic,
		string memory pacientHash
	) external view returns (LibMedicalStorage.MedicalReport[] memory);

	function getMedics(string memory pacientHash) external view returns (address[] memory);
}
