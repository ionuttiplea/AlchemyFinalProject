import React, { useState, ChangeEvent, FormEvent } from 'react';
import './MedicalReport.css';
import {
  Button,
  Box,
  Typography,
  FormGroup,
  TextField,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ReportContainer } from './StyledComponents';
import { Buffer } from 'buffer';

interface Patient {
  name: string;
  age: string;
  gender: string;
  contact: string;
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    temperature: string;
  };
  medicalHistory: string[];
  summary: string;
  // eslint-disable-next-line
  [key: string]: any;
}

interface MedicalReportProps {
  submitHandle: (filedata: File | Buffer) => Promise<void>;
}

const MedicalReport: React.FC<MedicalReportProps> = ({ submitHandle }) => {
  const [patient, setPatient] = useState<Patient>({
    name: '',
    age: '',
    gender: '',
    contact: '',
    vitalSigns: {
      heartRate: '',
      bloodPressure: '',
      temperature: '',
    },
    medicalHistory: [''],
    summary: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, key] = name.split('.');

    if (key) {
      setPatient(prevPatient => ({
        ...prevPatient,
        [section]: {
          ...prevPatient[section],
          [key]: value,
        },
      }));
    } else {
      setPatient(prevPatient => ({
        ...prevPatient,
        [name]: value,
      }));
    }
  };

  const handleMedicalHistoryChange = (index: number, value: string) => {
    const newMedicalHistory = [...patient.medicalHistory];
    newMedicalHistory[index] = value;
    setPatient(prevPatient => ({
      ...prevPatient,
      medicalHistory: newMedicalHistory,
    }));
  };

  const addMedicalHistory = () => {
    setPatient(prevPatient => ({
      ...prevPatient,
      medicalHistory: [...prevPatient.medicalHistory, ''],
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateReportData()) {
      console.log('Form submitted', patient);

      const jsonString = JSON.stringify(patient);
      const fileData = Buffer.from(jsonString);
      submitHandle(fileData);
      setSubmitted(true);
    }
  };

  const validateReportData = () => true;

  const isValidPatientData =
    patient.name &&
    patient.age &&
    patient.gender &&
    patient.contact &&
    patient.vitalSigns.heartRate &&
    patient.vitalSigns.bloodPressure &&
    patient.vitalSigns.temperature &&
    patient.medicalHistory.every(history => history.trim() !== '') &&
    patient.summary;

  return (
    <ReportContainer>
      {(!submitted || !isValidPatientData) && (
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <Typography variant="h4" component="h1" align="center">
              Or you can create a report in the following format
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="h5" component="h2">
              Patient Information
            </Typography>
            <FormGroup aria-readonly={true}>
              <TextField
                label="Name"
                name="name"
                value={patient.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                value={patient.age}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                label="Gender"
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                label="Contact"
                name="contact"
                value={patient.contact}
                onChange={handleChange}
                required
                margin="normal"
              />
            </FormGroup>
          </Box>

          <Box mb={4}>
            <Typography variant="h5" component="h2">
              Vital Signs
            </Typography>
            <FormGroup>
              <TextField
                label="Heart Rate (bpm)"
                name="vitalSigns.heartRate"
                type="number"
                value={patient.vitalSigns.heartRate}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                label="Blood Pressure"
                name="vitalSigns.bloodPressure"
                value={patient.vitalSigns.bloodPressure}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                label="Temperature (°C)"
                name="vitalSigns.temperature"
                type="number"
                value={patient.vitalSigns.temperature}
                onChange={handleChange}
                required
                margin="normal"
              />
            </FormGroup>
          </Box>

          <Box mb={4}>
            <Typography variant="h5" component="h2">
              Medical History
            </Typography>
            <FormGroup>
              {patient.medicalHistory.map((history, index) => (
                <TextField
                  key={index}
                  label={`History ${index + 1}`}
                  value={history}
                  onChange={e =>
                    handleMedicalHistoryChange(index, e.target.value)
                  }
                  required
                  margin="normal"
                />
              ))}
              <IconButton onClick={addMedicalHistory} color="primary">
                <AddIcon />
              </IconButton>
            </FormGroup>
          </Box>

          <Box mb={4}>
            <Typography variant="h5" component="h2">
              Summary
            </Typography>
            <TextField
              label="Summary"
              name="summary"
              value={patient.summary}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      )}
    </ReportContainer>
  );
};

export default MedicalReport;
