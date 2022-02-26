import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 50,
    p:1,
  };
  

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  