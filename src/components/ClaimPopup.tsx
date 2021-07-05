import { useEffect, useRef, useState } from 'react'
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography 
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

import SuccessPopup from './SuccessPopup'
import ErrorPopup from '@components/ErrorPopup'

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    borderRadius: theme.spacing(10),
    height: 'max-content',
    width: 'max-content',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'max-content',
      width: 'max-content',
      minWidth: theme.spacing(60),
      maxHeight: '90%',
      overflowY: 'scroll',
    },
  },
  description: {
    maxWidth: theme.spacing(55)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
    alignItems: 'center'
  },
  fields: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    width: '100%',
    height: theme.spacing(6),
    margin: theme.spacing(2, 2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dropdown: {
    minWidth: theme.spacing(23)
  },
  info: {
    textAlign: 'center'
  },
  actions: {
    float: 'right', 
    width: '100%',
    marginTop: theme.spacing(-1)
  }
}));

// Presentational component for handling trades
const ClaimPopup = (props) => {
  const classes = useStyles();
  const { 
    open, 
    onClose, 
    poolContractAddress,
    defaulted, 
    coverBalance, 
    premBalance, 
    coverTotalSupply, 
    premTotalSupply, 
    totalCoverage, 
    totalPremium, 
    approveCover, 
    approvePrem,
    claimCoverage,
    withdrawPremium
  } = props;
  const [coverInDai, setCoverInDai] = useState(0);
  const [premInDai, setPremInDai] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const claimEnabled = defaulted ? +coverBalance > 0 : +premBalance > 0;

  useEffect(() => {
    // Reset
    setSuccessMessage('');
    setError('');
    setCoverInDai(coverTotalSupply === 0 ? 0 : +totalCoverage / coverTotalSupply); 
    setPremInDai(premTotalSupply === 0 ? 0 : +totalPremium / premTotalSupply);
  }, [open])
  console.log(totalPremium, premTotalSupply, "HJIO", premInDai)

  // Function passed into 'onClick'
  const executeClaim = async () => {
    setError('');
    let message = '';
    try {
      if (defaulted) {
        // Handle claim coverage
        const approved = await approveCover(poolContractAddress, +coverBalance);
        if (approved) {
          await claimCoverage(+coverBalance);
        } else {
          return setError('Failed to approve COVER transaction');
        }
      } else {
        // Handle withdraw premium
        const approved = await approvePrem(poolContractAddress, +premBalance);
        if (approved) {
          console.log("APPROVING")
          await withdrawPremium(+premBalance);
          
        } else {
          return setError('Failed to approve PREM transaction');
        }
      };
    } catch (e) {
      const err = JSON.stringify(JSON.stringify(e.message));
      console.log('Error', err);
      return setError(err);
    }
    
    // Show success message for 2 seconds before closing popup
    setSuccessMessage(message);
    setTimeout(() => {
      onClose();
    }, 2000);
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
      <DialogTitle>
        <Typography gutterBottom variant='h6'>
          { defaulted ? 'Claim Coverage' : 'Claim Premium' }
        </Typography>
        <Typography gutterBottom variant='body2' className={classes.description}>
          { defaulted 
            ? 
              `Exchange your ${coverBalance} COVER tokens for ${coverBalance * coverInDai} DAI in coverage`
            :
              `Exchange your ${premBalance} PREM tokens for ${premBalance * premInDai} DAI (premiums) + ${premBalance} DAI (original stake)`
          }
        </Typography>
      </DialogTitle>
      <DialogContent>
        <IconButton 
          aria-label="close" 
          className={classes.closeButton} 
          onClick={onClose}
          size='small'
        >
          <CloseIcon fontSize='small' />
        </IconButton>
        { (defaulted && +coverBalance > 0) || (!defaulted && +premBalance > 0)
          ?
            <>
              <DialogContent className={classes.content}>
                <div>
                  <Typography gutterBottom variant='subtitle2'>
                    { defaulted ? 'COVER Balance' : 'PREM Balance'}
                  </Typography>
                  <Typography variant='body2'>
                   { defaulted ? `${coverBalance} COVER` : `${premBalance} PREM`}
                  </Typography>
                </div>
                <SwapHorizIcon />
                <div>
                  <Typography gutterBottom variant='subtitle2'>
                    Amount in DAI
                  </Typography>
                  <Typography variant='body2'>
                  { defaulted ? `${coverBalance * coverInDai} DAI` : `${+(premBalance * premInDai) + +premBalance} DAI`}
                  </Typography>
                </div>
              </DialogContent>
              <DialogContent className={classes.info}>
                <Typography variant='subtitle2'>
                  { defaulted
                    ? 
                      `1 COVER = ${coverInDai} DAI`
                    : 
                      `1 PREM = ${premInDai} DAI`
                  }
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button 
                  disabled={!claimEnabled}
                  className={classes.button} 
                  color='primary' 
                  variant='contained'
                  onClick={executeClaim}
                >
                  {defaulted ? 'Exchange COVER for DAI' : 'Exchange PREM for DAI'} 
                </Button> 
              </DialogActions>
            </>
          :
            <Typography style={{ textAlign: 'center' }} variant='body2'>
              You don&apos;t have enough tokens to submit a claim
            </Typography>
        }
      </DialogContent>
      <SuccessPopup
        handleClose={() => setSuccessMessage('')}
        message={successMessage}
      />
      <ErrorPopup
        error={error}
        handleCloseError={() => setError('')}
      />
    </Dialog>
  )
}

export default ClaimPopup;