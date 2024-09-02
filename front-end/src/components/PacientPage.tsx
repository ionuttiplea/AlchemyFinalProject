import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import { ethers } from 'ethers';
import abiPatientOperationsFaucet from '@abi/PacientOperationsFaucet.json';
import { PacientOperationsFaucet } from '../types';
import { StyledContainer, StyledForm, LargeButton } from './StyledComponents';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import MedicalReport, { Patient } from './MedicalReport';
import {
  fetchFileFromIPFS,
  triggerDownload,
  getReportFileType,
} from 'utils/fileUtils';

const providerUrl = process.env.REACT_APP_RPC_URL as string;
const address = process.env.REACT_APP_DIAMOND_ADDRESS as string;

interface PacientPageProps {
  account: string;
}

export interface MedicalReportType {
  cid: string;
  type: string | null;
}

const ipfs = ipfsHttpClient({
  url: 'http://localhost:5001',
  headers: {
    'Access-Control-Request-Headers': '*',
    'Access-Control-Request-Method': '*',
  },
}); // by default url will be localhost:5001

export const PacientPage: React.FC<PacientPageProps> = ({ account }) => {
  const [pacientName, setPacientName] = useState<string>('');
  const [reports, setReports] = useState<MedicalReportType[]>([]);
  const [hasUserRetrievedReports, setHasUserRetrievedReports] =
    useState<boolean>(false);
  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  const [reportData, setReportData] = useState<Patient>();

  useEffect(() => {
    if (!reportData) {
      setShowReportForm(false);
    }
    return;
  }, [account, hasUserRetrievedReports, reportData, pacientName]);

  const doNothingSubmitHandle = (file: File | Buffer) => {
    event?.preventDefault();
    console.log(file);
    return new Promise<void>(resolve => resolve);
  };

  const getPacientReports = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
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
      let pacientReports: MedicalReportType[] = [];
      for (const medic of response) {
        const medicalReportsProxy = await contract
          .connect(signer)
          .getReportsFromMedic(
            medic,
            ethers.keccak256(ethers.toUtf8Bytes(pacientName)),
          );

        for (const report of medicalReportsProxy) {
          const type = await getReportFileType(ipfs, report[0]);
          pacientReports.push({
            cid: report[0],
            type: type?.toString() ?? 'nothing',
          });
        }
      }

      setReports(pacientReports);
      setHasUserRetrievedReports(true);
    } catch (error: any) {
      if (error.message && error.message.includes('execution reverted: "27"')) {
        alert('You do not have accesss to read this pacient reports');
      } else {
        console.log(error);
      }

      setHasUserRetrievedReports(false);
    }
  };

  const handleReportClick = async (item: MedicalReportType) => {
    const fileData = await fetchFileFromIPFS(ipfs, item.cid);
    const textDecoder = new TextDecoder('utf-8');
    const jsonString = textDecoder.decode(fileData);

    if (item.type !== 'nothing') {
      triggerDownload(fileData, item.cid);
      setShowReportForm(false);
    } else {
      setShowReportForm(true);
      try {
        setReportData(JSON.parse(jsonString));
      } catch (error) {
        console.error(error);
      }
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
            setReportData(undefined);
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
        <Box mt={4} textAlign="center">
          <Typography variant="h4" component="h2" gutterBottom>
            These are your reports CIDs:
          </Typography>
          <ol
            style={{
              fontSize: '1.2rem',
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
            }}
          >
            {reports.map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onClick={() => handleReportClick(item)}
                onMouseOver={e =>
                  (e.currentTarget.style.backgroundColor = '#e0e0e0')
                }
                onMouseOut={e =>
                  (e.currentTarget.style.backgroundColor = '#f9f9f9')
                }
              >
                {`Report ${index + 1}`}
              </li>
            ))}
          </ol>{' '}
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
      {showReportForm ? (
        <MedicalReport
          submitHandle={doNothingSubmitHandle}
          readonly={true}
          patientData={reportData}
          headerString="This is your report"
        />
      ) : (
        <></>
      )}
    </StyledContainer>
  );
};
