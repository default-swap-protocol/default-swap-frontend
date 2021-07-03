import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography 
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import ErrorPopup from '@components/ErrorPopup'

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    borderRadius: theme.spacing(10),
    width: '100vw',
    height: '80vh',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'max-content',
      width: 'max-content',
      minWidth: theme.spacing(50),
      maxHeight: '90%',
      overflowY: 'scroll',
    },
  },
  title: {
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  field: {
    width: '100%',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    width: '100%',
    height: theme.spacing(6),
    margin: theme.spacing(2, 1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dropdown: {
    minWidth: theme.spacing(23)
  },
}));

// Handle Metamask and walletconnect authentication. TODO: Walletconnect (not on Moralis)
const ConnectWalletPopup = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { open, onClose } = props;
  const { authenticate } = useMoralis();
  const [error, setError] = useState('');

  const onConnect = async (wallet: string) => {
    setError('');
    switch (wallet) {
      case 'metamask': {
        try {
          await authenticate();
          onClose();
          router.push('/');
        } catch (e) {
          console.log('Error', e);
        }
        break;
      }
      case 'walletconnect': {
        break;
      }
    }
  }
  
  return (
    <Dialog
      className={classes.root}
      fullScreen
      fullWidth
      maxWidth='lg'
      disableScrollLock
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: '10px'
        }
      }}
    >
      <DialogTitle className={classes.title}>
        <Typography gutterBottom variant="h6">
          Connect to wallet
        </Typography>
        <Typography variant="body2">
          Please select a wallet to connect to this Dapp
        </Typography>
        <IconButton 
          aria-label="close" 
          className={classes.closeButton} 
          onClick={onClose}
          size='small'
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.actions}>
        <Button 
          variant="outlined" 
          color="primary" 
          className={classes.button}
          onClick={async () => await onConnect('metamask')}
          startIcon={
            <Image 
              src='/metamask.svg' alt='metamask' width='30px' height='30px' objectFit="contain" 
            />
          }
        >
          <Typography variant="body2">
            MetaMask
          </Typography>
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          className={classes.button}
          onClick={() => onConnect('walletconnect')}
          startIcon={
            <Image 
              src='/walletconnect.svg' alt='walletconnect' width='30px' height='30px' objectFit="contain" 
            />
          }
        >
          <Typography variant="body2">
            WalletConnect
          </Typography>
        </Button>
      </DialogContent>
      <ErrorPopup
        error={error}
        handleCloseError={() => setError('')}
      />
    </Dialog>
  )
}

export default ConnectWalletPopup;