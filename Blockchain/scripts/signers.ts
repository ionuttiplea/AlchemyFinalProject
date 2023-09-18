import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Wallet } from "ethers";
import { Provider } from "@ethersproject/providers";

export interface SignersDictionary {
  [index: string]: SignerWithAddress | Wallet;
}

// Signers SINGLETON
let signers;

/**
 * @param {string} address
 * @return {*}  {(Promise<Wallet | null>)}
 */
const getWalletByPrivateKey = (privateKey: string, ethersProvider: Provider = null): Wallet | null => {
  if (!privateKey) {
    return null;
  }
  return new Wallet(privateKey, ethersProvider);
};

export const getSignersByNetwork = async (networkChainId: number, ethersProvider: Provider = null) => {
  switch (networkChainId) {
    case 31337:
      const signersArray: SignerWithAddress[] = await ethers.getSigners();
      signers = {
        Owner: signersArray[0],
        Medic1: signersArray[1],
        Medic2: signersArray[2],
        Medic3: signersArray[3],
        Pacient1: signersArray[4],
        Pacient2: signersArray[5],
        Pacient3: signersArray[6],
      };
      break;
    case 11155111:
      signers = {
        Owner : getWalletByPrivateKey(process.env.OWNER_PK, ethersProvider)
      }
      break;
    default:
        throw Error("Unknown network chainId to get signers for.");
  }

  return signers;
};
