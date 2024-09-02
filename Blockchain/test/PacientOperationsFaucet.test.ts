import { ethers } from "hardhat";
import { deployContracts } from "../scripts/deploymentUtils";
import { getSignersByNetwork } from "../scripts/signers";

const { expect } = require("chai");

describe("PacientOperationsFaucet", async function() {
    let contracts;
    let signers;
    const pacientHash = "dummyPacientHash";
    const reportCID = "dummyCID";
    const reportDetails = "dummyDetails";

    before(async () => {
        contracts = await deployContracts(ethers.provider);
        signers = await getSignersByNetwork(31337);
    });

    describe("Pacient Operations Faucet", function() {
        it("Should allow a new pacient to register", async function() {
            await expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).register(pacientHash))
                .to.emit(contracts.PacientOperationsFaucet, "PacientRegistered")
                .withArgs(signers.Pacient1.address, pacientHash);
        });

        it("Should revert if the same pacient tries to register again", async function() {
            await expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).register(pacientHash))
                .to.be.revertedWith("26");
        });

        it("Should return an empty array if no medics are associated with the pacient", async function() {
            const medics = await contracts.PacientOperationsFaucet.connect(signers.Pacient1).getMedics(pacientHash);
            expect(medics).to.be.an('array').that.is.empty;
        });

        it("Should return an empty array if no reports exist for the given medic and pacient", async function() {
            const reports = await contracts.PacientOperationsFaucet.connect(signers.Pacient1).getReportsFromMedic(signers.Medic1.address, pacientHash);
            expect(reports).to.be.an('array').that.is.empty;
        });

        it("Should return a list of reports from a specific medic for a specific pacient", async function() {
            await contracts.OwnerOperationsFaucet.connect(signers.Owner).addMedic(signers.Medic1.address);
            contracts.MedicOperationsFaucet.connect(signers.Medic1).medicAddReport(pacientHash, reportCID);

            const reports = await contracts.PacientOperationsFaucet.connect(signers.Pacient1).getReportsFromMedic(signers.Medic1.address, pacientHash);
            expect(reports).to.be.an('array').that.is.not.empty;
            expect(reports[0].reportCID).to.equal(reportCID);
        });

        it("Should revert if the pacient tries to retrieve another pacient reports", async function() {
            await expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).getReportsFromMedic(signers.Medic1.address, pacientHash + "111"))
                .to.be.revertedWith("27");
        });

        it("Should return a list of medics associated with the pacient", async function() {
            const medics = await contracts.PacientOperationsFaucet.connect(signers.Pacient1).getMedics(pacientHash);
            expect(medics).to.include(signers.Medic1.address);
        });

    });
});
