import { ethers } from "hardhat";
import { deployContracts } from "./deploymentUtils";
import { getSignersByNetwork } from "./signers";

const { expect } = require("chai");

describe("OwnerOperationFaucet", async function () {
  let diamond;
  let signers;

  before(async () => {
    diamond = (await deployContracts(ethers.provider)).OwnerOperationsFaucet;
    signers = await getSignersByNetwork(31337);
  });
  describe("Owner Operations", function () {
    it("Should revert if not owner when adding medic", function () {
      return expect(diamond.connect(signers.Pacient1).addMedic(signers.Medic1.address)).to.be.reverted;
    });
    it("Should revert if not owner when removing medic", function () {
      return expect(diamond.connect(signers.Pacient1).removeMedic(signers.Medic1.address)).to.be.reverted;
    });
    it("Should succeed if owner when adding medic", function () {
      return expect(diamond.connect(signers.Owner).addMedic(signers.Medic1.address)).to.not.be.reverted;
    });
    it("Should succeed if owner when removing medic", function () {
      return expect(diamond.connect(signers.Owner).removeMedic(signers.Medic1.address)).to.not.be.reverted;
    });
    it("Should revert if owner when removing medic that doesn't exist", function () {
      return expect(diamond.connect(signers.Owner).removeMedic(signers.Medic1.address)).to.be.reverted;
    });
    it("Should revert if not owner when transfering ownership", function () {
      return expect(diamond.connect(signers.Pacient1).transferOwnership(signers.Pacient1.address)).to.be.reverted;
    });
    it("Should succeed if owner when transfering ownership", function () {
      return expect(diamond.connect(signers.Owner).transferOwnership(signers.Pacient1.address)).to.not.be.reverted;
    });
    it("Should succeed with new Owner", function () {
      return expect(diamond.connect(signers.Pacient1).transferOwnership(signers.Owner.address)).to.not.be.reverted;
    });
  });
});
