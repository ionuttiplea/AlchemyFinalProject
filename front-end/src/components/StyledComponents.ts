import { Box, Button, Container } from '@mui/material';
import { styled } from '@mui/system';

export const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginTop: theme.spacing(4),
}));

export const Root = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

export const FormBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
}));

export const SecondContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const InFormButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export const ReportContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(4),
  width: '100%',
  maxWidth: '600px',
}));

export const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '500px',
  marginTop: theme.spacing(4),
}));

export const LargeButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '1.2rem',
  marginTop: theme.spacing(2),
}));

export const Background = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("/path/to/your/background.jpg")', // Add a nice background image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
  },
  padding: theme.spacing(2),
  fontSize: '1.2rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
}));
