import { ethers } from "hardhat";
import { deployContracts } from "./deploymentUtils";
import { JsonRpcProvider } from "@ethersproject/providers";

const getRpcProvider = (): JsonRpcProvider => {
  let provider: JsonRpcProvider;
  const url = process.env.RPC_URL;
  if (process.env.ENV === 'local') {
    provider = new ethers.providers.JsonRpcProvider();
  } else {
    provider = new JsonRpcProvider(url);
  }

  return provider;
};

async function main() {
  const provider = getRpcProvider();

  await deployContracts(provider);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
