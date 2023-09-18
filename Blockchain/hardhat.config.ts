import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-abi-exporter";

import * as dotenv from "dotenv";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      chainId: 11155111,
      accounts : [process.env.OWNER_PK]
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      }
    ]
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 10,
    },
  },
  abiExporter: [
    {
      path: "./blockchain-shared/abi",
      format: "json",
      flat: true,
      runOnCompile: true,
    },
  ],
  etherscan: {
    apiKey: {
      sepolia: 'j_6o4saKlnIXehr3hsXa2Qg8G-s9NEb_'
    }
  }
};
