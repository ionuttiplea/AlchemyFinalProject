import "@nomicfoundation/hardhat-chai-matchers";

import "hardhat-abi-exporter";

import * as dotenv from "dotenv";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
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
};
