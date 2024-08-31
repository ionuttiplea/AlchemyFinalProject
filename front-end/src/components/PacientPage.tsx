import { ethers } from 'ethers';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import abiPatientOperationsFaucet from '@abi/PacientOperationsFaucet.json';
import { Typography, TextField, Box } from '@mui/material';
import { PacientOperationsFaucet } from '../types';
import { StyledContainer, StyledForm, LargeButton } from './StyledComponents';

const providerUrl = process.env.REACT_APP_RPC_URL as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

interface PacientPageProps {
  account: string;
}

export const PacientPage: React.FC<PacientPageProps> = ({ account }) => {
  const [pacientName, setPacientName] = useState<string>('');
  const [reports, setReports] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [hasUserRetrievedReports, setHasUserRetrievedReports] =
    useState<boolean>(false);

  useEffect(() => {
    return;
  }, [account, hasUserRetrievedReports]);

  const getPacientReports = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(
      address,
      abiPatientOperationsFaucet,
      provider,
    ) as unknown as PacientOperationsFaucet;
    const signer = await provider.getSigner(account);

    const response = await contract
      .connect(signer)
      .getMedics(ethers.keccak256(ethers.toUtf8Bytes(pacientName)));

    // eslint-disable-next-line
    let pacientReports: any = [];
    for (const medic of response) {
      const reportsFromMedic = await contract
        .connect(signer)
        .getReportsFromMedic(
          medic,
          ethers.keccak256(ethers.toUtf8Bytes(pacientName)),
        );
      pacientReports = pacientReports.concat(reportsFromMedic);
    }

    setReports(pacientReports);
    setHasUserRetrievedReports(true);
  };

  const getPacientReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedReport) {
      window.open('https://ipfs.io/ipfs/' + selectedReport);
    } else {
      alert('No report selected');
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Hello Pacient !!!
      </Typography>
      <StyledForm onSubmit={getPacientReports}>
        <TextField
          label="Username"
          placeholder="Username"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            setPacientName(event.target.value);
          }}
          fullWidth
          margin="normal"
          variant="outlined"
          inputProps={{ style: { fontSize: '1.2rem' } }}
          InputLabelProps={{ style: { fontSize: '1.2rem' } }}
        />
        <LargeButton type="submit" variant="contained" color="primary">
          Get Your Reports
        </LargeButton>
      </StyledForm>
      {reports.length > 0 ? (
        <Box mt={4} textAlign="left">
          <Typography variant="h4" component="h2" gutterBottom>
            These are your reports CIDs:
          </Typography>
          <ol style={{ fontSize: '1.2rem' }}>
            {reports.map((item, index) => (
              <li key={index}>{`${index + 1}. ${item}`}</li>
            ))}
          </ol>
        </Box>
      ) : (
        hasUserRetrievedReports && (
          <Box mt={4} textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              No reports found for this user.
            </Typography>
          </Box>
        )
      )}
      <StyledForm onSubmit={getPacientReport}>
        <TextField
          label="Report CID"
          placeholder="Report CID"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            setSelectedReport(event.target.value);
          }}
          fullWidth
          margin="normal"
          variant="outlined"
          inputProps={{ style: { fontSize: '1.2rem' } }}
          InputLabelProps={{ style: { fontSize: '1.2rem' } }}
        />
        <LargeButton type="submit" variant="contained" color="primary">
          Download Selected Report
        </LargeButton>
      </StyledForm>
    </StyledContainer>
  );
};
