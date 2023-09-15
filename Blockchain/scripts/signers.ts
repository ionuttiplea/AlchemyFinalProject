import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Wallet } from "ethers";

export interface SignersDictionary {
  [index: string]: SignerWithAddress | Wallet;
}

// Signers SINGLETON
let signers;

/**
 * Gets a wallet by private key.
 * Some configurations might be empty (for example in prod, there is no User1, User2)
 * Handle the case where private key comes empty from AWS
 * @param {string} address
 * @return {*}  {(Promise<Wallet | null>)}
 */
const getWalletByPrivateKey = (privateKey: string): Wallet | null => {
  if (!privateKey) {
    return null;
  }
  return new Wallet(privateKey, ethers.provider);
};

export const getSignersByNetwork = async (networkChainId: number) => {
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
    default:
        throw Error("Unknown network chainId to get signers for.");
  }

  return signers;
};
