import { ethers } from 'ethers';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import abiPacientOperationsFaucet from '@abi/PacientOperationsFaucet.json';
import { Typography, TextField, Button } from '@mui/material';
import { PacientOperationsFaucet } from '../types';
import { StyledContainer, StyledForm } from './StyledComponents';
const providerUrl = process.env.REACT_APP_RPC_URL as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

interface PacientRegistrationFormProps {
  account: string;
  setRegistered: (registered: boolean) => void;
}

export const PacientRegistrationForm: React.FC<
  PacientRegistrationFormProps
> = ({ account, setRegistered }) => {
  const [username, setUserName] = useState<string>('');

  useEffect(() => {
    return;
  }, [account, username]);

  const fieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'Username') {
      setUserName(event.target.value);
    }
  };

  const registerPacient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username && window.ethereum) {
      console.log(account);
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const contract = new ethers.Contract(
        address,
        abiPacientOperationsFaucet,
        provider,
      ) as unknown as PacientOperationsFaucet;
      const signer = await new ethers.BrowserProvider(
        window.ethereum,
      ).getSigner();
      const tx = await contract
        .connect(signer)
        .register(ethers.keccak256(ethers.toUtf8Bytes(username)));
      await tx.wait();
      setRegistered(true);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome !!
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Here you can register to our platform
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom>
        This step will only be done once, make sure you are connected with the
        right wallet address
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom>
        Also, keep your username private and share it only with the medics you
        trust
      </Typography>
      <Typography
        variant="body1"
        component="h4"
        color="red"
        fontWeight="bold"
        gutterBottom
      >
        Writing on the blockchain will come with a very small transaction fee,
        if you don&#39;t want or can&#39;t afford it ask the medic you are going
        to, to register your account
      </Typography>
      <StyledForm onSubmit={registerPacient}>
        <TextField
          label="Username"
          placeholder="Username"
          onChange={fieldChanged}
          name="Username"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Account"
          style={{ width: `${account.length * 6.5}px` }}
          InputProps={{
            readOnly: true,
          }}
          name="account"
          value={account}
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Register Account
        </Button>
      </StyledForm>
    </StyledContainer>
  );
};
