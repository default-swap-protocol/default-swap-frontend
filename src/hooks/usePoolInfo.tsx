import { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { useAccount } from '@contexts/AccountContext'
import { formatUnits } from "@ethersproject/units";
import moment from 'moment'

import { pool, sampleMapleLoanContract } from "@contracts/index" // TODO: Make dynamic after demo

const usePoolInfo = (poolAddress: string) => {
  const { getDaiBalance, getCoverBalance, getPremBalance, getCoverTotalSupply, getPremTotalSupply, updateBalances, approveDai, approveCover, approvePrem } = useAccount();
  const { web3, enableWeb3, isWeb3Enabled, isAuthenticated } = useMoralis();
  const [inter, setInter] = useState<NodeJS.Timeout>();

  const [daiBalance, setDaiBalance] = useState(getDaiBalance());
  const [coverBalance, setCoverBalance] = useState(getCoverBalance());
  const [premBalance, setPremBalance] = useState(getPremBalance());
  const [coverTotalSupply, setCoverTotalSupply] = useState(0);
  const [premTotalSupply, setPremTotalSupply] = useState(0);
  const [expiry, setExpiry] = useState('N/A');
  const [isExpired, setIsExpired] = useState(false);
  const [totalPremium, setTotalPremium] = useState('0');
  const [totalCoverage, setTotalCoverage] = useState('0');
  const [loanDefaulted, setLoanDefaulted] = useState(false);
  useEffect(() => {
    (async () => {
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
        const poolContract = new web3.eth.Contract(pool, poolAddress);
        const expiryInSeconds = await poolContract.methods.expirationTimestamp().call();
        const _premium = await poolContract.methods.premiumPool().call();
        const _coverage = await poolContract.methods.coveragePool().call();
        const loanContractAddress = await poolContract.methods.sampleMapleLoanContract().call()
        const loanContract = new web3.eth.Contract(sampleMapleLoanContract, loanContractAddress);
        const _loanDefaulted = await loanContract.methods.loanDefaulted().call();

        const expiryInMS = expiryInSeconds * 1000
        setIsExpired(Date.now() > expiryInMS);
        setExpiry(makeTimestampReadable(expiryInMS));
        setTotalPremium(_premium == 0 ? '0' : `${(+formatUnits(_premium, 18)).toFixed(3).replace(/\.000$/, '')}`);
        setTotalCoverage(_coverage == 0 ? '0' : `${(+formatUnits(_coverage, 18)).toFixed(3).replace(/\.000$/, '')}`);
        setDaiBalance(getDaiBalance());
        setCoverBalance(getCoverBalance());
        setPremBalance(getPremBalance());
        setCoverTotalSupply(getCoverTotalSupply());
        setPremTotalSupply(getPremTotalSupply());
        setLoanDefaulted(_loanDefaulted);
      } catch (e) {
        console.log("Error", e)
        return {
          error: e
        }
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

  return {
    daiBalance,
    coverBalance,
    premBalance,
    coverTotalSupply,
    premTotalSupply,
    expiry,
    isExpired,
    totalPremium,
    totalCoverage,
    loanDefaulted
  }
}

export default usePoolInfo;