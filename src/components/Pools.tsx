import { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { formatUnits } from "@ethersproject/units";
import { useAccount } from '@contexts/AccountContext'
import { Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import moment from 'moment'

import { pool, sampleMapleLoanContract } from "@contracts/index" // TODO: Make dynamic after demo
import TradePopup from '@components/TradePopup'
import ErrorPopup from '@components/ErrorPopup'
import theme from '@utils/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
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
    width: '100%',
    margin: theme.spacing(0, 1)
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

// Table of coverage pools
const Pools = () => {
  const classes = useStyles();
  const { getDaiBalance, getCoverBalance, getPremBalance, updateBalances, approveCover, approvePrem } = useAccount();
  const [error, setError] = useState('');
  const { web3, enableWeb3, isWeb3Enabled, web3EnableError, user, isAuthenticated } = useMoralis();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [inter, setInter] = useState<NodeJS.Timeout>();
  
  // TODO: Make the following dynamic + into a hook after hackathon
  const [poolAddress, setPoolAddress] = useState(process.env.POOL_CONTRACT_ADDRESS_DEV);
  const [daiBalance, setDaiBalance] = useState(getDaiBalance());
  const [coverBalance, setCoverBalance] = useState(getCoverBalance());
  const [premBalance, setPremBalance] = useState(getPremBalance());
  const [expiry, setExpiry] = useState('N/A');
  const [totalPremium, setTotalPremium] = useState('0');
  const [totalCoverage, setTotalCoverage] = useState('0');
  const [loanDefaulted, setLoanDefaulted] = useState(false);
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
        const expiryInSeconds = await contract.methods.expirationTimestamp().call();
        const _premium = await contract.methods.premiumPool().call();
        const _coverage = await contract.methods.coveragePool().call();
        
        const loanContractAddress = await contract.methods.sampleMapleLoanContract().call()
        const loanContract = new web3.eth.Contract(sampleMapleLoanContract, loanContractAddress);
        const _loanDefaulted = await loanContract.methods.loanDefaulted().call();
        setExpiry(makeTimestampReadable(expiryInSeconds * 1000));
        setTotalPremium(`${formatUnits(_premium, 18)} DAI`);
        setTotalCoverage(`${formatUnits(_coverage, 18)} DAI`);
        setDaiBalance(getDaiBalance());
        setCoverBalance(getCoverBalance());
        setPremBalance(getPremBalance());
        setLoanDefaulted(_loanDefaulted);
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
    await contract.methods.buyCoverage(premium).send({ from: user.get('ethAddress') });
    await updateBalances();
  }
  const sellCover = async (coverage: number) => {
    const contract = new web3.eth.Contract(pool, poolAddress);
    await contract.methods.sellCoverage(coverage).send({ from: user.get('ethAddress') });
    await updateBalances();
  }

  return (
    <Container className={classes.root} maxWidth="lg">
      <MaterialTable
        style={{
          borderRadius: '8px'
        }}
        columns={[
          { title: "Pool", field: "pool", cellStyle: { fontWeight: 500, width: '18%' }, disableClick: true },
          { title: "Expiry", field: "expiry", cellStyle: { width: '18%' } },
          { title: "Defaulted", field: "defaulted", cellStyle: { width: '0%' } },
          { title: "Total Purchased", field: "totalCoverage", cellStyle: { width: '15%' } },
          { title: "Total Supplied", field: "totalPremium", cellStyle: { width: '14%' } },
          { title: "Balance", field: "balance", cellStyle: { width: '5%' } },
          { title: "", field: "action", cellStyle: { width: '18%' } }
        ]}
        data={[
          { 
            pool: "Maple default swaps", 
            expiry: expiry, 
            defaulted: loanDefaulted,
            totalCoverage: totalCoverage, 
            totalPremium: totalPremium, 
            balance: `${coverBalance} Cover ${premBalance} Prem`,
            action: (
              <div className={classes.row}>
                <Button 
                  className={classes.button} 
                  color='primary' 
                  variant='outlined'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Trade
                </Button> 
                <Button 
                  className={classes.button} 
                  color='primary' 
                  variant='contained'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Claim
                </Button> 
              </div>
            )
          },
          { 
            pool: "Goldfinch default swaps", 
            expiry: 'July 8, 2021 3:22pm EDT', 
            defaulted: loanDefaulted,
            totalCoverage: '6508.15 DAI', 
            totalPremium: '21915.10 DAI', 
            balance: `0.0 Cover 0.0 Prem`,
            action: (
              <div className={classes.row}>
                <Button 
                  className={classes.button} 
                  color='primary' 
                  variant='outlined'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Trade
                </Button> 
                <Button 
                  disabled
                  className={classes.button} 
                  color='primary' 
                  variant='contained'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Claim
                </Button> 
              </div>
            )
          },
          { 
            pool: "Aave default swaps", 
            expiry: 'July 10, 2021 10:42pm EDT', 
            defaulted: loanDefaulted,
            totalCoverage: '7508.91 DAI', 
            totalPremium: '36352.24 DAI', 
            balance: `0.0 Cover 0.0 Prem`,
            action: (
              <div className={classes.row}>
                <Button 
                  className={classes.button} 
                  color='primary' 
                  variant='outlined'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Trade
                </Button> 
                <Button 
                  disabled
                  className={classes.button} 
                  color='primary' 
                  variant='contained'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Claim
                </Button> 
              </div>
            )
          },
          { 
            pool: "Uniswap liquidation swaps", 
            expiry: 'July 12, 2021 10:42pm EDT', 
            defaulted: loanDefaulted,
            totalCoverage: '10309.20 DAI', 
            totalPremium: '80395.85 DAI', 
            balance: `0.0 Cover 0.0 Prem`,
            action: (
              <div className={classes.row}>
                <Button 
                  className={classes.button} 
                  color='primary' 
                  variant='outlined'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Trade
                </Button> 
                <Button 
                  disabled
                  className={classes.button} 
                  color='primary' 
                  variant='contained'
                  onClick={() => {
                    setTradeOpen(true)
                  }}
                >
                  Claim
                </Button> 
              </div>
            )
          },
        ]}
        options={{
          toolbar: false,
          paging: false,
          headerStyle: {
            backgroundColor: '#3531a2',
            color: '#FFF',
          },
          rowStyle: {
            padding: '7px',
          }
        }}
      />
    <TradePopup 
      open={tradeOpen} 
      onClose={() => setTradeOpen(false)}
      daiBalance={daiBalance}
      coverBalance={coverBalance}
      premBalance={premBalance}
      totalCoverage={totalCoverage}
      totalPremium={totalPremium}
      expiry={expiry}
      buyCover={buyCover}
      sellCover={sellCover}
      approveCover={approveCover}
      approvePrem={approvePrem}
    />
    <ErrorPopup error={error} handleCloseError={() => setError('')} />
    </Container>
  )
};

export default Pools;