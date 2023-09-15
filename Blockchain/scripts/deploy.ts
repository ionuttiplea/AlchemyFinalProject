import { ethers } from "hardhat";
import { deployContracts } from "./deploymentUtils";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider( "localhost" );
  
  deployContracts( provider );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
