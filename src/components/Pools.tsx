import { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { useAccount } from '@contexts/AccountContext'
import { Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import moment from 'moment'

import { pool } from "@contracts/index" // TODO: Make dynamic after demo
import TradePopup from '@components/TradePopup'
import ErrorPopup from '@components/ErrorPopup'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  item: {
    padding: theme.spacing(1)
  },
  containerItem: {
    display: 'grid',
    gridTemplateColumns: `1fr`,
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: `repeat(2, 1fr)`,
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: `repeat(3, 1fr)`,
    }
  },
  table: {
    minWidth: 700,
  },
  cell: {
    '&:hover': {
      color: `${theme.palette.primary} !important`,
      cursor: 'pointer'
    }
  },
  button: {
    display: 'inline',
    width: '100%'
  }
}));

// Table of coverage pools
const Pools = () => {
  const classes = useStyles();
  const { getDaiBalance } = useAccount();
  const [error, setError] = useState('');
  const { web3, enableWeb3, isWeb3Enabled, web3EnableError, user, isAuthenticated } = useMoralis();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [inter, setInter] = useState<NodeJS.Timeout>();
  
  // TODO: Make the following dynamic + into a hook after hackathon
  const [poolAddress, setPoolAddress] = useState(process.env.CONTRACT_ADDRESS_DEV);
  const [daiBalance, setDaiBalance] = useState(getDaiBalance());
  const [expiry, setExpiry] = useState('N/A');
  const [premium, setPremium] = useState(0);
  const [coverage, setCoverage] = useState(0);
  useEffect(() => {
    (async () => {
      setError('');
      updatePool();
      if (!inter) {
        const id = setInterval(async () => {
          updatePool();
        }, 13000); // TODO: Update this to subscribing to block + update only when block is updated
        setInter(id);
      }
    })();
  }, [isAuthenticated, isWeb3Enabled]);
  const updatePool = async () => {
    enableWeb3();
    if (isAuthenticated && isWeb3Enabled && web3?.currentProvider) {    
      try {
        const contract = new web3.eth.Contract(pool, poolAddress);
        const expiryInMS = await contract.methods.expirationTimestamp().call();
        const _premium = await contract.methods.premiumPool().call();
        const _coverage = await contract.methods.coveragePool().call();
        setExpiry(makeTimestampReadable(expiryInMS));
        setPremium(_premium);
        setCoverage(_coverage);
        setDaiBalance(getDaiBalance());
      } catch (e) {
        setError(e);
        console.log("Error", e)
      }
    } else {
      setInter(undefined)
    }
  }
  const makeTimestampReadable = (expiryInMS: number): string => {
    const expDateString = new Date(+expiryInMS).toString();
    const expDateTimezone = new Date(+expiryInMS).toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
    return `${moment(expDateString).format('MMMM d, YYYY h:mma')} ${expDateTimezone}`;
  }
  const buyCover = async (premium: number) => {
    const contract = new web3.eth.Contract(pool, poolAddress);
    return await contract.methods.buyCoverage(premium).send({ from: user.get('ethAddress') });
  }
  const sellCover = async (coverage: number) => {
    const contract = new web3.eth.Contract(pool, poolAddress);
    return await contract.methods.sellCoverage(coverage).send({ from: user.get('ethAddress') });
  }

  return (
    <Container className={classes.root} maxWidth="lg">
      <MaterialTable
        style={{
          borderRadius: '8px'
        }}
        columns={[
          { title: "Pool", field: "pool", cellStyle: { fontWeight: 500, width: '20%' }, disableClick: true },
          { title: "Expiry", field: "expiry", cellStyle: { width: '30%' } },
          { title: "Premium", field: "premium", cellStyle: { width: '10%' } },
          { title: "Coverage", field: "coverage", cellStyle: { width: '10%' } },
          { title: "", field: "action", cellStyle: { width: '20%' } }
        ]}
        data={[
          { 
            pool: "Maple", 
            expiry: expiry, 
            premium: premium, 
            coverage: coverage, 
            action: (
              <Button 
                className={classes.button} 
                color='primary' 
                variant='outlined'
                onClick={() => {
                  setTradeOpen(true)
                }}
              >
                Trade Coverage
              </Button> 
            )
          },
        ]}
        options={{
          toolbar: false,
          paging: false,
          headerStyle: {
            backgroundColor: '#3531a2',
            color: '#FFF',
          }
        }}
      />
    <TradePopup 
      open={tradeOpen} 
      onClose={() => setTradeOpen(false)}
      daiBalance={daiBalance}
      coverage={coverage}
      premium={premium}
      expiry={expiry}
      buyCover={buyCover}
      sellCover={sellCover}
    />
    <ErrorPopup error={error} handleCloseError={() => setError('')} />
    </Container>
  )
};

export default Pools;