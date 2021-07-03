import { useEffect, useRef, useState } from 'react'
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  InputAdornment,
  List,
  Tab,
  Tabs, 
  TextField,
  Typography 
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

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
      minWidth: theme.spacing(80),
      maxHeight: '90%',
      overflowY: 'scroll',
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
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
  textField: {
    width: '100%',
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listItem: {
    margin: theme.spacing(1, 3)
  },
  info: {
    float: 'left', 
    width: '40%',
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(-3)
  },
  actions: {
    float: 'right', 
    width: '59%',
    marginTop: theme.spacing(-1)
  }
}));

// Presentational component for handling trades
const TradePopup = (props) => {
  const classes = useStyles();
  const { open, onClose, daiBalance, coverBalance, premBalance, totalCoverage, totalPremium, expiry, buyCover, sellCover, approveCover, approvePrem } = props;
  const [tab, setTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [priceInput, setPriceInput] = useState<string>();
  const [priceOutput, setPriceOutput] = useState<string>();
  const quantityRef = useRef<HTMLInputElement>();
  const costRef = useRef<HTMLInputElement>();

  useEffect(() => {
    // Reset
    setPriceInput(undefined);
    setPriceOutput(undefined);
    setSuccessMessage('');
    setError('');
    setTab(0);
  }, [open])

  // Function passed into 'onClick'
  const executeTrade = async () => {
    setError('');
    let message = '';
    try {
      if (tab === 0) {
        const approved = approveCover(+priceInput);
        if (approved) {
          await buyCover(priceInput);
        } else {
          return setError('Failed to approve transaction');
        }
        await buyCover(priceInput);
        message = `You successfully exchanged ${priceInput} DAI for ${priceOutput} Cover tokens`;
      } else {
        const approved = approvePrem(+priceInput);
        if (approved) {
          await sellCover(priceInput);
        } else {
          return setError('Failed to approve transaction');
        }
        message = `You successfully staked ${priceInput} DAI in exchange for ${priceOutput} Prem tokens`;
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
          Maple default swaps
        </Typography>
        <Typography gutterBottom variant='body2'>
          { tab === 0
            ?
              'Buy COVER using DAI to get coverage if default event occurs'
            :
              'Stake DAI and earn PREM to get right to claim premiums if no default event occurs'
          }
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div className={classes.info}>
          <List disablePadding subheader={<li />} className={classes.list}>
            <div className={classes.listItem}>
              <Typography variant='body2'>Balance</Typography>
              <Typography variant='subtitle2'>
                { daiBalance } DAI
              </Typography>
              <Typography variant='subtitle2'>
                { coverBalance } Cover tokens
              </Typography>
              <Typography variant='subtitle2'>
                { premBalance } Prem tokens
              </Typography>
            </div>
            <div className={classes.listItem}>
              <Typography variant='body2'>Total Supplied Coverage</Typography>
              <Typography variant='subtitle2'>
                { totalCoverage }
              </Typography>
            </div>
            <div className={classes.listItem}>
              <Typography variant='body2'>Total Available Premium</Typography>
              <Typography variant='subtitle2'>
                { totalPremium }
              </Typography>
            </div>
            <div className={classes.listItem}>
              <Typography variant='body2'>Expiration</Typography>
              <Typography variant='subtitle2'>
                { expiry }
              </Typography>
            </div>
          </List>
        </div>
        <div className={classes.actions}>
          <div className={classes.content}>
            <Tabs indicatorColor="primary" value={tab} onChange={(e, val) => setTab(val)}>
              <Tab disableRipple label="Buy coverage" />
              <Tab disableRipple label="Supply coverage" />
            </Tabs>
            <IconButton 
              aria-label="close" 
              className={classes.closeButton} 
              onClick={onClose}
              size='small'
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </div>
          { daiBalance === '0.0'
            ?
              <>
                <DialogContent>
                  <Typography gutterBottom variant='subtitle2'>
                    Amount to  { tab === 0 ? 'Pay' : 'Stake' }
                  </Typography>
                  <TextField 
                    type='number'
                    className={classes.textField} 
                    placeholder={'0.0'}
                    variant='outlined' 
                    InputProps={{
                      endAdornment: <InputAdornment position="end">DAI</InputAdornment>,
                    }}
                    onChange={(e) => {
                      const val = `${Math.abs(+e.target.value)}`;
                      setPriceInput(val);
                      setPriceOutput(val); // TODO: replace this with COVER / PREM x DAI conversion
                    }}
                    inputRef={quantityRef}
                  />
                </DialogContent>
                <DialogContent>
                  <Typography gutterBottom variant='subtitle2'>
                    { tab === 0 ? 'Cost' : 'You will Receive' }
                  </Typography>
                  <TextField 
                    disabled
                    className={classes.textField} 
                    placeholder={'0.0'}
                    variant='outlined' 
                    value={priceOutput}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{ tab === 0 ? 'COVER' : 'PREM' }</InputAdornment>,
                    }}
                    inputRef={costRef}
                  />
                  <Typography variant='subtitle2'>
                  { tab === 0 
                    ? 
                      '1 COVER = 1 DAI' 
                    : 
                      '1 PREM = 1 DAI'
                    }
                    
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button 
                    className={classes.button} 
                    color='primary' 
                    variant='contained'
                    onClick={executeTrade}
                    disabled={!priceInput || priceInput === '0'}
                  >
                    { tab === 0 ? 'Buy Cover' : 'Stake' }
                  </Button> 
                </DialogActions>
              </>
            :
              <Typography style={{ textAlign: 'center' }} variant='body2'>
                You don&apos;t have enough DAI to trade coverage
              </Typography>
          }
          
        </div>
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

export default TradePopup;