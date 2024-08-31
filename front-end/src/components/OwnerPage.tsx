import { ethers } from 'ethers';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import abiOwnerOperationsFaucet from '@abi/OwnerOperationsFaucet.json';
import { Typography, TextField } from '@mui/material';
import { StyledContainer, StyledForm, LargeButton } from './StyledComponents';
import { OwnerOperationsFaucet } from '../types';

const providerUrl = process.env.REACT_APP_RPC_URL as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

interface OwnerPageProps {
  account: string;
}

export const OwnerPage: React.FC<OwnerPageProps> = () => {
  const [medicAddress, setMedicAddress] = useState<string>('');

  const addMedic = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!medicAddress) {
      alert('Address is empty');
      return;
    }
    try {
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const contract = new ethers.Contract(
        address,
        abiOwnerOperationsFaucet,
        provider,
      ) as unknown as OwnerOperationsFaucet;
      const signer = await new ethers.BrowserProvider(
        window.ethereum,
      ).getSigner();
      const tx = await contract.connect(signer).addMedic(medicAddress);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  const removeMedic = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!medicAddress) {
      alert('Address is empty');
      return;
    }
    try {
      const provider = new ethers.JsonRpcProvider(providerUrl);
      const contract = new ethers.Contract(
        address,
        abiOwnerOperationsFaucet,
        provider,
      ) as unknown as OwnerOperationsFaucet;

      const signer = await new ethers.BrowserProvider(
        window.ethereum,
      ).getSigner();

      const tx = await contract.connect(signer).removeMedic(medicAddress);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Hello Owner !!
      </Typography>
      <StyledForm onSubmit={addMedic}>
        <TextField
          label="Medic Address"
          placeholder="Medic Address"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setMedicAddress(event.target.value);
          }}
          fullWidth
          margin="normal"
          variant="outlined"
          inputProps={{ style: { fontSize: '1.2rem' } }}
          InputLabelProps={{ style: { fontSize: '1.2rem' } }}
        />
        <LargeButton type="submit" variant="contained" color="primary">
          Add Medic
        </LargeButton>
        <LargeButton
          variant="contained"
          color="error"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            removeMedic(event as unknown as FormEvent<HTMLFormElement>);
          }}
        >
          Remove Medic
        </LargeButton>
      </StyledForm>
    </StyledContainer>
  );
};
