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
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

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
      minWidth: theme.spacing(50),
      maxHeight: '90%',
      overflowY: 'scroll',
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center'
  },
  fields: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
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
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listItem: {
    margin: theme.spacing(1, 3)
  }
}));

// Presentational component for handling trades
const TradePopup = (props) => {
  const classes = useStyles();
  const { open, onClose, daiBalance, coverage, premium, expiry, buyCover, sellCover } = props;
  const [tab, setTab] = useState(0);
  const [error, setError] = useState('');
  const quantityRef = useRef<HTMLInputElement>();
  const costRef = useRef<HTMLInputElement>();

  // TODO: Update costRef when quantityRef is changed by user input
  useEffect(() => {
  }, [quantityRef?.current?.value])
  useEffect(() => {
  }, [costRef?.current?.value])

  // Function passed into 'onClick'
  const executeTrade = async () => {
    if (tab === 0) {
      await buyCover();
    } else {
      await sellCover();
    };
    onClose();
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
          Trade Coverage
        </Typography>
      </DialogTitle>
      <div>
        <div style={{ float: 'left', width: '30%'}}>
          <List disablePadding subheader={<li />} className={classes.list}>
            <div className={classes.listItem}>
              <Typography variant='body2'>Balance</Typography>
              <Typography variant='subtitle2'>
                { daiBalance } DAI
              </Typography>
            </div>
            <div className={classes.listItem}>
              <Typography variant='body2'>Coverage</Typography>
              <Typography variant='subtitle2'>
                { coverage }
              </Typography>
            </div>
            <div className={classes.listItem}>
              <Typography variant='body2'>Premium</Typography>
              <Typography variant='subtitle2'>
                { premium }
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
        <div style={{ float: 'right', width: '70%'}}>
          <div className={classes.content}>
            <Tabs indicatorColor="primary" value={tab} onChange={(e, val) => setTab(val)}>
              <Tab disableRipple label="Buy" />
              <Tab disableRipple label="Sell" />
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
          <DialogContent>
            <Typography gutterBottom variant='subtitle2'>
              Amount to Buy
            </Typography>
            <TextField 
              className={classes.textField} 
              placeholder={'0.0'}
              variant='outlined' 
              InputProps={{
                endAdornment: <InputAdornment position="end">Coverage Tokens</InputAdornment>,
              }}
              inputRef={quantityRef}
            />
          </DialogContent>
          <DialogContent>
            <Typography gutterBottom variant='subtitle2'>
              Cost
            </Typography>
            <TextField 
              disabled
              className={classes.textField} 
              variant='outlined' 
              placeholder={'0.0'}
              InputProps={{
                endAdornment: <InputAdornment position="end">DAI</InputAdornment>,
              }}
              inputRef={costRef}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              className={classes.button} 
              color='primary' 
              variant='contained'
              onClick={executeTrade}
            >
              { tab === 0 ? 'Buy' : 'Sell' } {' Coverage'}
            </Button> 
          </DialogActions>
        </div>
      </div>
      <ErrorPopup
        error={error}
        handleCloseError={() => setError('')}
      />
    </Dialog>
  )
}

export default TradePopup;