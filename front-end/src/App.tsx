import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import abiAccessControl from '@abi/AccessControlFaucet.json';
import { MedicPage } from '@components/MedicPage';
import { User } from '@components/User';
import { OwnerPage } from '@components/OwnerPage';
import { Typography, Stack } from '@mui/material';
import { StyledButton, Background } from '@components/StyledComponents';

const providerUrl = process.env.REACT_APP_RPC_URL as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isMedic, setIsMedic] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accountsChanged);
      window.ethereum.on('chainChanged', chainChanged);
    }
  });

  useEffect(() => {
    if (account !== null) {
      checkIsMedic(account).then(setIsMedic);
      checkIsOwner(account).then(setIsOwner);
    }
  }, [account]);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        await accountsChanged(res[0]);
      } catch (err) {
        console.error(err);
        setErrorMessage('There was a problem connecting to MetaMask');
      }
    } else {
      setErrorMessage('Install MetaMask');
    }
  };

  const checkIsOwner = async (account: string) => {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(address, abiAccessControl, provider);

    const isOwner = await contract.hasRole(
      ethers.keccak256(ethers.toUtf8Bytes('OWNER')),
      account,
    );

    return isOwner;
  };

  const checkIsMedic = async (account: string) => {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(address, abiAccessControl, provider);

    const isMedic = await contract.hasRole(
      ethers.keccak256(ethers.toUtf8Bytes('MEDIC')),
      account,
    );

    return isMedic;
  };

  const accountsChanged = async (newAccount: string | string[]) => {
    try {
      if (newAccount) {
        const account = Array.isArray(newAccount) ? newAccount[0] : newAccount;
        setAccount(account);
        const { ethereum } = window;
        const myBalance = await ethereum.request({
          method: 'eth_getBalance',
          params: [account],
        });
        setBalance(ethers.formatEther(myBalance));
        console.log(balance);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('There was a problem connecting to MetaMask');
    }
  };

  const chainChanged = () => {
    setErrorMessage(null);
    setAccount(null);
    setBalance(null);
  };

  return (
    <Background>
      <Stack spacing={3} alignItems="center">
        {!account ? (
          <>
            <Typography variant="h4" color="primary" gutterBottom>
              Welcome to Your Secure Health Portal
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Please connect your Metamask to continue
            </Typography>

            <StyledButton variant="contained" onClick={connectHandler}>
              Connect With Metamask
            </StyledButton>
          </>
        ) : isMedic ? (
          <MedicPage account={account} />
        ) : isOwner ? (
          <OwnerPage account={account} />
        ) : (
          <User account={account} />
        )}
        {errorMessage && (
          <Typography variant="body1" color="error">
            Error: {errorMessage}
          </Typography>
        )}
      </Stack>
    </Background>
  );
};

export default App;
