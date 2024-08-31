import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import abiAccessControl from '@abi/AccessControlFaucet.json';
import { PacientRegistrationForm } from './PacientRegistrationForm';
import { PacientPage } from './PacientPage';
import { AccessControlFaucet } from '../types/AccessControlFaucet';

const providerUrl = process.env.REACT_APP_RPC_URL as unknown as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

interface UserProps {
  account: string;
}

export const User: React.FC<UserProps> = props => {
  const { account } = props;
  const [isPacient, setIsPacient] = useState<boolean>(false);
  const [registered, setRegistered] = useState<boolean>(false);

  useEffect(() => {
    const checkIsPacient = async (account: string) => {
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const contract = new ethers.Contract(
        address,
        abiAccessControl,
        provider,
      ) as unknown as AccessControlFaucet;
      const isMedic = await contract.connect(provider).isUser(account);

      if (isMedic !== isPacient) {
        setIsPacient(isMedic);
      }
    };

    if (account !== '0x0') {
      checkIsPacient(account).then();
    }
  }, [account, isPacient, registered]);

  return (
    <div>
      {!isPacient ? (
        <PacientRegistrationForm
          account={account}
          setRegistered={setRegistered}
        />
      ) : (
        <PacientPage account={account} />
      )}
    </div>
  );
};
