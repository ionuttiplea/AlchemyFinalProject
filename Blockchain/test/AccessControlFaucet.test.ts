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
    describe("Access Control & Pacient Operations", function () {
        it("Should succeed when registering", function () {
            return expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).register("123")).to.not.be.reverted;
        });
        it("Should successfully identify new pacient", function () {
            return expect(contracts.AccessControlFaucet.connect(signers.Pacient1).isUser(signers.Pacient1.address)).to.not.be.false;
        });
        it("Should fail when adding the same pacient again", function () {
            return expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).register("123")).to.be.reverted;
        });
        // it("Should succeed if medic when retrieving reportHash", function () {
        //     return expect(diamond.connect(signers.Medic1).medicGetReportHash(pacientHash, 0)).to.not.be.null;
        // });
        // it("Should revert if owner when removing medic that doesn't exist", function () {
        //     return expect(diamond.connect(signers.Medic1).medicGetReportHash(pacientHash, 5)).to.be.reverted;
        // });
    });
});
