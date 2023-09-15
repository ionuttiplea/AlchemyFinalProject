import { ethers } from "hardhat";
import { deployContracts } from "./deploymentUtils";
import { getSignersByNetwork } from "./signers";

const { expect } = require("chai");

describe("MedicOperationsFaucet", async function () {
    let contracts;
    let diamond;
    let signers;
    const pacientHash = "dummy";
    const reportCID = "dummyCID";

    before(async () => {
        contracts = await deployContracts(ethers.provider);
        diamond = contracts.MedicOperationsFaucet;
        signers = await getSignersByNetwork(31337);
        await contracts.OwnerOperationsFaucet.connect(signers.Owner).addMedic( signers.Medic1.address );
    });
    describe("Medic Operations", function () {
        it("Should revert if not medic when adding report", function () {
            return expect(diamond.connect(signers.Pacient1).medicAddReport(pacientHash, reportCID)).to.be.reverted;
        });
        it("Should revert if not medic when retrieving report", function () {
            return expect(diamond.connect(signers.Pacient1).medicGetReportHash(pacientHash, 0)).to.be.reverted;
        });
        it("Should succeed if medic when adding report", function () {
            return expect(diamond.connect(signers.Medic1).medicAddReport(pacientHash, reportCID)).to.not.be.reverted;
        });
        it("Should succeed if medic when retrieving reportHash", function () {
            return expect(diamond.connect(signers.Medic1).medicGetReportHash(pacientHash, 0)).to.not.be.null;
        });
        it("Should revert if owner when removing medic that doesn't exist", function () {
            return expect(diamond.connect(signers.Medic1).medicGetReportHash(pacientHash, 5)).to.be.reverted;
        });
    });
});
