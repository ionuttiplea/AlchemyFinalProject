import { ethers } from 'ethers';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import abiMedicOperationsFaucet from '@abi/MedicOperationsFaucet.json';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import MedicalReport from '@components/MedicalReport';
import {
  Typography,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  Input,
  InputProps,
} from '@mui/material';

import {
  Root,
  FormBox,
  InFormButton,
  SubmitButton,
  SecondContainer,
} from './StyledComponents';

import { MedicOperationsFaucet } from '../types';
import { uploadData } from 'utils/fileUtils';

const providerUrl = process.env.REACT_APP_RPC_URL as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

const ipfs = ipfsHttpClient({
  url: 'http://localhost:5001',
  headers: {
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*',
  },
}); // by default url will be localhost:5001

interface MedicPageProps {
  account: string;
}

export const MedicPage: React.FC<MedicPageProps> = () => {
  const [pacientName, setPacientName] = useState<string>('');
  const [reportCID, setReportCID] = useState<string>('');
  const [reports, setReports] = useState<string[]>([]);
  const [pdfData, setPdfData] = useState<File | null>(null);

  const onFileLoad: InputProps['onChange'] = event => {
    const target = event.target as HTMLInputElement;

    if (target.files) {
      setPdfData(target.files[0]);
    }
  };

  const fieldChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'pacientName') {
      setPacientName(value);
    } else if (name === 'reportCID') {
      setReportCID(value);
      console.log(reportCID);
    }
  };

  const getReports = async () => {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(
      address,
      abiMedicOperationsFaucet,
      provider,
    ) as unknown as MedicOperationsFaucet;
    const signer = await new ethers.BrowserProvider(
      window.ethereum,
    ).getSigner();

    const response = await contract
      .connect(signer)
      .medicGetReportsForPacient(
        ethers.keccak256(ethers.toUtf8Bytes(pacientName)),
      );

    setReports(response as unknown as string[]);
  };

  const medicalReportSubmitHandle = async (fileData: File | Buffer) => {
    uploadData(ipfs, fileData, address, pacientName, providerUrl);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pacientName) {
      return;
    }

    if (!pdfData) {
      return alert('No files selected');
    }

    await medicalReportSubmitHandle(pdfData);
  };

  return (
    <Root>
      <Typography variant="h4" color="primary">
        Hello Medic !!!!
      </Typography>
      <Typography variant="h5">
        You can Upload a PDF file as a report
      </Typography>
      <FormBox>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Pacient Name"
            name="pacientName"
            placeholder="Pacient Name"
            onChange={fieldChanged}
            margin="dense"
            variant="outlined"
          />
          <Input type="file" onChange={onFileLoad} fullWidth margin="dense" />
          <SubmitButton type="submit" variant="contained" fullWidth>
            Upload Report
          </SubmitButton>
        </form>
        <InFormButton variant="contained" onClick={getReports} fullWidth>
          Get Reports for Pacient mentioned above
        </InFormButton>
      </FormBox>

      <SecondContainer>
        {reports.length > 0 && (
          <>
            <Typography variant="h6">
              These are the reports CIDs you made for the pacient mentioned
              above:
            </Typography>
            <List>
              {reports.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${item}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </SecondContainer>

      <Box sx={{ width: '100%', maxWidth: '600px', marginTop: 4 }}>
        <MedicalReport submitHandle={medicalReportSubmitHandle} />
      </Box>
    </Root>
  );
};
