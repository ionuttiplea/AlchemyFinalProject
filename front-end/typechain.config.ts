import { TypeChain } from 'typechain';

const typechainConfig = {
  files: './src/abi/*.json', // Path to your ABI files
  outDir: '.src/types', // Output directory for generated types
  target: 'ethers-v5', // Target ethers version, can be 'ethers-v5' or 'ethers-v6'
};

export default typechainConfig;
