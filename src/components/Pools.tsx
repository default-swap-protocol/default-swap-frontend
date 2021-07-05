import { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { useAccount } from '@contexts/AccountContext'
import { Button, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'

import { pool } from "@contracts/index" // TODO: Make dynamic after demo
import usePoolInfo from '@hooks/usePoolInfo'
import TradePopup from '@components/TradePopup'
import ClaimPopup from '@components/ClaimPopup'
import ErrorPopup from '@components/ErrorPopup'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    '&:nth-child(1) .Component-horizontalScrollContainer-26': {
      borderRadius: theme.spacing(1)
    }
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
  const { updateBalances, approveDai, approveCover, approvePrem } = useAccount();
  const [error, setError] = useState('');
  const { web3, user } = useMoralis();
  const [selectedPoolAddress, setSelectedPoolAddress] = useState(process.env.POOL_CONTRACT_ADDRESS_DEV);
  const { daiBalance, coverBalance, premBalance, coverTotalSupply, premTotalSupply, expiry, isExpired, totalPremium, totalCoverage, loanDefaulted} = usePoolInfo(process.env.POOL_CONTRACT_ADDRESS_DEV);

  const [tradeOpen, setTradeOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  
  const buyCover = async (premium: number) => {
    const contract = new web3.eth.Contract(pool, selectedPoolAddress);
    const amountToBuy = web3.utils.toBN(web3.utils.toWei(premium.toString(), 'ether'));
    await contract.methods.buyCoverage(amountToBuy).send({ from: user.get('ethAddress') });
    await updateBalances();
  }
  const sellCover = async (coverage: number) => {
    const contract = new web3.eth.Contract(pool, selectedPoolAddress);
    const amountToSell = web3.utils.toBN(web3.utils.toWei(coverage.toString(), 'ether'))
    await contract.methods.sellCoverage(amountToSell).send({ from: user.get('ethAddress') });
    await updateBalances();
  }
  const claimCoverage = async (coverTokenBalance: number) => {
    const contract = new web3.eth.Contract(pool, selectedPoolAddress);
    const amountToClaim = web3.utils.toBN(web3.utils.toWei(coverTokenBalance.toString(), 'ether'));
    await contract.methods.claimCoverage(amountToClaim).send({ from: user.get('ethAddress') });
    await updateBalances();
  }
  const withdrawPremium = async (premiumTokenBalance: number) => {
    const contract = new web3.eth.Contract(pool, selectedPoolAddress);
    const amountToWithdraw = web3.utils.toBN(web3.utils.toWei(premiumTokenBalance.toString(), 'ether'));
    await contract.methods.withdrawPremium(amountToWithdraw).send({ from: user.get('ethAddress') });
    await updateBalances();
  }

  return (
    <Container className={classes.root} maxWidth="lg">
      <MaterialTable
        style={{
          borderRadius: '10px'
        }}
        columns={[
          { title: "Pool", field: "pool", cellStyle: { fontWeight: 500, width: '18%' }, disableClick: true },
          { title: "Expiry", field: "expiry", cellStyle: { width: '18%' } },
          { title: "Defaulted", field: "defaulted", cellStyle: { width: '0%' } },
          { title: "Total Supplied", field: "totalCoverage", cellStyle: { width: '16%' } },
          { title: "Total Premiums", field: "totalPremium", cellStyle: { width: '16%' } },
          { title: "", field: "action", cellStyle: { width: '18%' } }
        ]}
        data={[
          { 
            pool: "Maple default swaps", 
            expiry: expiry, 
            defaulted: loanDefaulted,
            totalCoverage: `${totalCoverage} DAI`, 
            totalPremium: `${totalPremium} DAI`, 
            balance: `${coverBalance} COVER ${premBalance} PREM`,
            action: (
              <div className={classes.row}>
                <Button 
                  disabled={isExpired || loanDefaulted}
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
                  disabled={!isExpired && !loanDefaulted}
                  className={classes.button} 
                  color='primary' 
                  variant='contained'
                  onClick={() => {
                    setClaimOpen(true)
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
            defaulted: false,
            totalCoverage: '6508.15 DAI', 
            totalPremium: '21915.10 DAI', 
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
                    setClaimOpen(true)
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
            defaulted: false,
            totalCoverage: '7508.91 DAI', 
            totalPremium: '36352.24 DAI', 
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
                    setClaimOpen(true)
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
            defaulted: false,
            totalCoverage: '10309.20 DAI', 
            totalPremium: '80395.85 DAI', 
            action: (
              <div className={classes.row}>
                <Button 
                  disabled
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
                    setClaimOpen(true)
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
      poolContractAddress={selectedPoolAddress}
      daiBalance={daiBalance}
      coverBalance={coverBalance}
      premBalance={premBalance}
      totalCoverage={totalCoverage}
      totalPremium={totalPremium}
      expiry={expiry}
      buyCover={buyCover}
      sellCover={sellCover}
      approveDai={approveDai}
      approveCover={approveCover}
      approvePrem={approvePrem}
    />
    <ClaimPopup
      open={claimOpen}
      onClose={() => setClaimOpen(false)}
      poolContractAddress={selectedPoolAddress}
      defaulted={loanDefaulted}
      coverBalance={coverBalance}
      premBalance={premBalance}
      coverTotalSupply={coverTotalSupply}
      premTotalSupply={premTotalSupply}
      totalCoverage={totalCoverage}
      totalPremium={totalPremium}
      claimCoverage={claimCoverage}
      withdrawPremium={withdrawPremium}
      approveCover={approveCover}
      approvePrem={approvePrem}
    />
    <ErrorPopup error={error} handleCloseError={() => setError('')} />
    </Container>
  )
};

export default Pools;