import { ethers } from "hardhat";
import { deployContracts } from "../scripts/deploymentUtils";
import { getSignersByNetwork } from "../scripts/signers";

const { expect } = require("chai");

describe("AccessControlFaucet", async function() {
    let contracts;
    let diamond;
    let signers;
    const pacientHash = "dummy";
    const reportCID = "dummyCID";

    // Define the OWNER_ROLE constant using keccak256 hash of "OWNER"
    const OWNER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("OWNER"));

    before(async () => {
        contracts = await deployContracts(ethers.provider);
        diamond = contracts.MedicOperationsFaucet;
        signers = await getSignersByNetwork(31337);
        await contracts.OwnerOperationsFaucet.connect(signers.Owner).addMedic(signers.Medic1.address);
    });

    describe("Access Control & Pacient Operations", function() {

        it("Should succeed when registering", async function() {
            await expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).register("123")).to.not.be.reverted;
        });

        it("Should successfully identify new pacient", async function() {
            const isUser = await contracts.AccessControlFaucet.connect(signers.Pacient1).isUser(signers.Pacient1.address);
            expect(isUser).to.be.true;
        });

        it("Should fail when adding the same pacient again", async function() {
            await expect(contracts.PacientOperationsFaucet.connect(signers.Pacient1).register("123")).to.be.reverted;
        });

        it("Should revert when checking if non-existent pacient is a user", async function() {
            const isUser = await contracts.AccessControlFaucet.connect(signers.Owner).isUser(signers.Owner.address);
            expect(isUser).to.be.false;
        });

        it("Should return false when checking if non-owner has owner role", async function() {
            const hasOwnerRole = await contracts.AccessControlFaucet.connect(signers.Pacient1).hasRole(OWNER_ROLE, signers.Pacient1.address);
            expect(hasOwnerRole).to.be.false;
        });

        it("Should return true when checking if owner has owner role", async function() {
            const hasOwnerRole = await contracts.AccessControlFaucet.connect(signers.Owner).hasRole(OWNER_ROLE, signers.Owner.address);
            expect(hasOwnerRole).to.be.true;
        });

        it("Should allow non-owner to check roles without error", async function() {
            await expect(contracts.AccessControlFaucet.connect(signers.Pacient1).hasRole(OWNER_ROLE, signers.Medic1.address)).to.not.be.reverted;
        });

        it("Should revert if owner when removing medic that doesn't exist", async function() {
            await expect(diamond.connect(signers.Medic1).medicGetReportHash(pacientHash, 5)).to.be.reverted;
        });

        it("Should revert if non-owner tries to remove a medic", async function() {
            await expect(contracts.OwnerOperationsFaucet.connect(signers.Pacient1).removeMedic(signers.Medic1.address)).to.be.reverted;
        });

        it("Should allow owner to remove a medic", async function() {
            await expect(contracts.OwnerOperationsFaucet.connect(signers.Owner).removeMedic(signers.Medic1.address)).to.not.be.reverted;
        });

    });
});
