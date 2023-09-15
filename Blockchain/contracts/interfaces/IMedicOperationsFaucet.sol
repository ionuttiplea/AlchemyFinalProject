// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;
import {LibMedicalStorage as Storage} from "../libraries/LibMedicalStorage.sol";

interface IMedicOperationsFaucet {
	event MedicAddedReport(bool);

	function medicAddReport(string memory pacientHash, string memory reportHash) external returns (uint256);

	function medicGetReportHash(string memory pacientHash, uint256 reportNumber) external view returns (string memory);

	function medicGetReportsForPacient(
		string memory pacientHash
	) external view  returns (Storage.MedicalReport[] memory);
}
