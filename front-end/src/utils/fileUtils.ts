import { ethers } from 'ethers';
import abiMedicOperationsFaucet from '@abi/MedicOperationsFaucet.json';
import { IPFSHTTPClient } from 'ipfs-http-client';
import { MedicOperationsFaucet } from '../types';

export const uploadData = async (
  ipfsProvider: IPFSHTTPClient,
  fileData: File | Buffer,
  address: string,
  pacientName: string,
  providerUrl: string,
) => {
  try {
    const result = await ipfsProvider.add(fileData);
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(
      address,
      abiMedicOperationsFaucet,
      provider,
    ) as unknown as MedicOperationsFaucet;
    const signer = await new ethers.BrowserProvider(
      window.ethereum,
    ).getSigner();
    const tx = await contract
      .connect(signer)
      .medicAddReport(
        ethers.keccak256(ethers.toUtf8Bytes(pacientName)),
        result.path,
      );
    tx.wait();
  } catch (e) {
    console.log(e);
  }
};
