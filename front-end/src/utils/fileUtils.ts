import { ethers } from 'ethers';
import abiMedicOperationsFaucet from '@abi/MedicOperationsFaucet.json';
import { IPFSHTTPClient } from 'ipfs-http-client';
import { MedicOperationsFaucet } from '../types';
import * as fileType from 'file-type';

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

export async function fetchFileFromIPFS(
  ipfsProvider: IPFSHTTPClient,
  cid: string,
): Promise<Uint8Array> {
  const stream = ipfsProvider.cat(cid);
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return new Uint8Array(
    chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []),
  );
}

export const triggerDownload = (
  data: Uint8Array,
  filename: string,
  mimeType = 'application/octet-stream',
) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

export async function getReportFileType(
  ipfsProvider: IPFSHTTPClient,
  cid: string,
) {
  try {
    const uint8Array = await fetchFileFromIPFS(ipfsProvider, cid);
    const type = await fileType.fileTypeFromBuffer(uint8Array);

    if (type) {
      console.log(`File type: ${type?.mime}, File extension: ${type?.ext}`);
      return type?.ext;
    } else {
      console.log('File type could not be determined');
      return null;
    }
  } catch (error) {
    console.error('Failed to determine file type from IPFS:', error);
    return null;
  }
}
