import { ethers } from "hardhat";
import { BaseProvider, JsonRpcProvider } from "@ethersproject/providers";
import { ContractTransaction, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import myAbi from "../artifacts/contracts/faucets/OwnerOperationsFaucet.sol/OwnerOperationsFaucet.json";
import { getSignersByNetwork } from "./signers";

/**
 * Given a list of contracts and the proxi address get all the contracts from that list
 *
 * @param contractNames An array containing the names of the contracts to be retrieved
 * @param diamondAddress The address at which the contracts are deployed, in this case the diamond proxi
 * @returns An object like array containing the retrieved contracts
 */
let signer: Wallet | SignerWithAddress;

const ContractNames = {
  DiamondLoupeFaucet: "DiamondLoupeFaucet",
  LibAccessControlStorage: "LibAccessControlStorage",
  LibStructStorage: "LibStructStorage",
  LibMedicalStorage: "LibMedicalStorage",
  Diamond: "Diamond",
  LibDiamond: "LibDiamond",
  DiamondInitFaucet: "DiamondInit",
  AccessControlFaucet: "AccessControlFaucet",
  OwnerOperationsFaucet: "OwnerOperationsFaucet",
  MedicOperationsFaucet: "MedicOperationsFaucet",
  PacientOperationsFaucet: "PacientOperationsFaucet",
};

export const tryCatchTransaction = async (tx: ContractTransaction) => {
  try {
    await tx.wait();
  } catch (error) {
    console.error(
      `Transaction with transactionHash=${error.receipt.transactionHash}, receipt=${JSON.stringify(
        error.receipt
      )} errored with code=${error.code} and reason=${error.reason}.`
    );
  }
};

const getContractsAt = async (contractNames: any, diamondAddress: string) => {
  let deployedContracts: any = [];

  let promises: any = [];
  for (const contractName of contractNames) {
    promises[contractName] = ethers.getContractAt(
      contractName,
      diamondAddress
    );
  }

  for (const label in promises) {
    deployedContracts[label] = await promises[label];
  }

  return deployedContracts;
}

export async function initContractWithLibraries(contractName: any, libraries: any) {
  const librariesObj = {};
  libraries.forEach((library) => (librariesObj[library.name] = library.address));

  return (
    await ethers.getContractFactory(contractName, {
      libraries: librariesObj,
    })
  ).connect(signer);

}

export async function initContract(contractName, ethersProvider: BaseProvider = null, ...constructorArgs) {
  try {
    const Contract = (await ethers.getContractFactory(contractName)).connect(signer);

    const contract = await Contract.deploy(...constructorArgs, {});

    await contract.deployTransaction.wait();
    
    //logAddress(networkName, contractName, contract.address);
    //logDeploymentParams(networkName, contractName, constructorArgs);

    return contract;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deployContract(
  contractName,
  libraries = [],
  ethersProvider: BaseProvider = null,
  ...constructorArgs
) {
  let contract = null;

  if (libraries && libraries.length > 0) {
    const contractFactory = await initContractWithLibraries(contractName, libraries);
    contract = await contractFactory.deploy(...constructorArgs);
    await contract.deployTransaction.wait();

    //   logAddress(networkName, contractName, contract.address);
    //   logDeploymentParams(networkName, contractName, constructorArgs);

  } else {
    contract = initContract(contractName, ethersProvider, ...constructorArgs);
  }

  return contract;
}

export const deployContracts = async (ethersProvider: JsonRpcProvider) => {
  let deployedContracts: any = {};
  const network = await ethersProvider.getNetwork();
  
  signer = (await getSignersByNetwork(network.chainId, ethersProvider)).Owner;
  console.log(signer);

  deployedContracts.DiamondLoupeFaucet = await initContract(ContractNames.DiamondLoupeFaucet, ethersProvider);
  deployedContracts.DiamondInitFaucet = await initContract(ContractNames.DiamondInitFaucet, ethersProvider);

  deployedContracts.LibMedicalStorage = await initContract(ContractNames.LibMedicalStorage, ethersProvider);
  deployedContracts.LibAccessControlStorage = await initContract(ContractNames.LibAccessControlStorage, ethersProvider);

  deployedContracts.AccessControlFaucet = await initContract(
    ContractNames.AccessControlFaucet,
    ethersProvider
  );

  deployedContracts.OwnerOperationsFaucet = await initContract(
    ContractNames.OwnerOperationsFaucet,
    ethersProvider
  );
  
  deployedContracts.PacientOperationsFaucet = await deployContract(
    ContractNames.PacientOperationsFaucet,
    [{
      name: ContractNames.LibMedicalStorage,
      address: deployedContracts.LibMedicalStorage.address
    }],
    ethersProvider
  );

  deployedContracts.MedicOperationsFaucet = await deployContract(
    ContractNames.MedicOperationsFaucet,
    [{
      name: ContractNames.LibMedicalStorage,
      address: deployedContracts.LibMedicalStorage.address
    }],
    ethersProvider
  );

  deployedContracts.Diamond = await initContract(
    ContractNames.Diamond,
    ethersProvider,
    deployedContracts.DiamondLoupeFaucet.address,
    deployedContracts.DiamondInitFaucet.address,
    deployedContracts.AccessControlFaucet.address,
    deployedContracts.OwnerOperationsFaucet.address,
    deployedContracts.MedicOperationsFaucet.address,
    deployedContracts.PacientOperationsFaucet.address
  );
  
  const prettyContracts = {
    "DiamondLoupeFaucet" : deployedContracts.DiamondLoupeFaucet.address,
    "DiamondInitFaucet" : deployedContracts.DiamondInitFaucet.address,
    "AccessControlFaucet" : deployedContracts.AccessControlFaucet.address,
    "OwnerOperationsFaucet" :  deployedContracts.OwnerOperationsFaucet.address,
    "MedicOperationsFaucet" : deployedContracts.MedicOperationsFaucet.address,
    "PacientOperationsFaucet" : deployedContracts.PacientOperationsFaucet.address,
    "LibMedicalStorage" : deployedContracts.LibMedicalStorage.address,
    "LibAccessControlStorage" : deployedContracts.LibAccessControlStorage.address
  }

  deployedContracts[ContractNames.DiamondLoupeFaucet] = await ethers.getContractAt(
    ContractNames.DiamondLoupeFaucet,
    deployedContracts.Diamond.address
  );

  deployedContracts[ContractNames.DiamondInitFaucet] = await ethers.getContractAt(
    ContractNames.DiamondInitFaucet,
    deployedContracts.Diamond.address
  );

  const diamondInitTx = await deployedContracts[ContractNames.DiamondInitFaucet].connect(signer).init();
  await diamondInitTx.wait();

  deployedContracts[ContractNames.AccessControlFaucet] = await ethers.getContractAt(
    ContractNames.AccessControlFaucet,
    deployedContracts.Diamond.address
  );

  deployedContracts[ContractNames.OwnerOperationsFaucet] = await ethers.getContractAt(
    ContractNames.OwnerOperationsFaucet,
    deployedContracts.Diamond.address
  );

  deployedContracts[ContractNames.MedicOperationsFaucet] = await ethers.getContractAt(
    ContractNames.MedicOperationsFaucet,
    deployedContracts.Diamond.address
  );

  deployedContracts[ContractNames.PacientOperationsFaucet] = await ethers.getContractAt(
    ContractNames.PacientOperationsFaucet,
    deployedContracts.Diamond.address
  );

  console.log(deployedContracts.Diamond.address);

  // initialize ownership
  await tryCatchTransaction(await deployedContracts.OwnerOperationsFaucet.connect(signer).initializeOwnership());

  prettyContracts[ContractNames.Diamond] = deployedContracts.Diamond.address;
  console.log( prettyContracts );
  
  return deployedContracts;
}