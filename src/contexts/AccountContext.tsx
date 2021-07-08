import React, { useContext, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { formatUnits } from "@ethersproject/units"
import { premToken, coverToken, daiToken } from "@contracts/index" // TODO: Make dynamic after demo

const AccountContext = React.createContext<ContextProps | null>(null);

// TODO: Remove hardcoding and get token addresses from factory contract
const DAI_TOKEN_ADDRESS_DEV = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const PREM_TOKEN_ADDRESS_DEV = '0x8438ad1c834623cff278ab6829a248e37c2d7e3f'
const COVER_TOKEN_ADDRESS_DEV= '0x2e983a1ba5e8b38aaaec4b440b9ddcfbf72e15d1'
export interface ContextProps {
  getDaiBalance: () => string,
  setDaiBalance: (balance: string) => void,
  getCoverBalance: () => string,
  setCoverBalance: (balance: string) => void
  getPremBalance: () => string,
  setPremBalance: (balance: string) => void,
  getCoverTotalSupply: () => number,
  getPremTotalSupply: () => number,
  updateBalances: () => Promise<void>,
  approveDai: (poolAddress: string, amount: number) => Promise<boolean>,
  approveCover: (poolAddress: string, amount: number) => Promise<boolean>,
  approvePrem: (poolAddress: string, amount: number) => Promise<boolean>,
}
 
export const useAccount = () => {
  return useContext(AccountContext);
}

// Context for tracking account info and balances
export const AccountProvider = ({ children }) => {
  const { web3, isWeb3Enabled, enableWeb3, user, isAuthenticated } = useMoralis();
  const [_daiBalance, _setDaiBalance] = useState('0');
  const [_coverBalance, _setCoverBalance] = useState('0'); // TODO: extend to different pools' cover tokens
  const [_premBalance, _setPremBalance] = useState('0');
  const [_coverTotalSupply, _setCoverTotalSupply] = useState(0);
  const [_premTotalSupply, _setPremTotalSupply] = useState(0);

  useEffect(() => {
    (async () => {
      if (!isWeb3Enabled) enableWeb3();
      if (isAuthenticated && isWeb3Enabled && web3?.currentProvider) {  
        await updateBalances();
      };
    })();
  }, [isAuthenticated, isWeb3Enabled])  

  // Call after each time balances change
  const updateBalances = async () => {
    const daiTokenContract = new web3.eth.Contract(daiToken, DAI_TOKEN_ADDRESS_DEV);
    const coverTokenContract = new web3.eth.Contract(coverToken, COVER_TOKEN_ADDRESS_DEV);
    const premTokenContract = new web3.eth.Contract(premToken, PREM_TOKEN_ADDRESS_DEV);

    // const daiBalance = await BalanceHelper.getERC20TokenBalance('DAI');
    const daiBalance = await daiTokenContract?.methods.balanceOf(user.get('ethAddress')).call();
    const premBalance = await premTokenContract?.methods.balanceOf(user.get('ethAddress')).call();
    const coverBalance = await coverTokenContract?.methods.balanceOf(user.get('ethAddress')).call();
    const premTotalSupply = await premTokenContract?.methods.totalSupply().call();
    const coverTotalSupply = await coverTokenContract?.methods.totalSupply().call();
    
    _setDaiBalance(daiBalance == 0 ? '0' : `${(+formatUnits(daiBalance, 18)).toFixed(3).replace(/\.000$/, '')}`);
    _setPremBalance(premBalance == 0 ? '0' : `${(+formatUnits(premBalance, 18)).toFixed(3).replace(/\.000$/, '')}`);
    _setCoverBalance(coverBalance == 0 ? '0' : `${(+formatUnits(coverBalance, 18)).toFixed(3).replace(/\.000$/, '')}`);
    _setCoverTotalSupply(web3.utils.fromWei(coverTotalSupply, "ether"));
    _setPremTotalSupply(web3.utils.fromWei(premTotalSupply, "ether"))
  }

  const getDaiBalance = () => {
    return _daiBalance;
  }

  const setDaiBalance = (balance: string) => {
    _setDaiBalance(balance);
  }

  const getCoverBalance = () => {
    return _coverBalance;
  }

  const setCoverBalance = (balance: string) => {
    _setCoverBalance(balance);
  }

  const getPremBalance = () => {
    return _premBalance;
  }

  const setPremBalance = (balance: string) => {
    _setPremBalance(balance);
  }

  const getCoverTotalSupply = () => {
    return _coverTotalSupply;
  }

  const getPremTotalSupply = () => {
    return _premTotalSupply;
  }

  const approveDai = async (poolAddress: string, amount: number) => {
    const daiTokenContract = new web3.eth.Contract(daiToken, DAI_TOKEN_ADDRESS_DEV);
    const amountToApprove = web3.utils.toWei(amount.toString(), 'ether');
    const convertedAmount = web3.utils.toBN(amountToApprove);
    await daiTokenContract.methods.approve(poolAddress, convertedAmount).send({ from: user.get('ethAddress') }).then(res => console.log(res));
    const allowance = await daiTokenContract.methods.allowance(user.get('ethAddress'), poolAddress).call();
    return allowance === amountToApprove;
  }

  const approveCover = async (poolAddress: string, amount: number) => {
    const coverTokenContract = new web3.eth.Contract(coverToken, COVER_TOKEN_ADDRESS_DEV);
    const amountToApprove = web3.utils.toWei(amount.toString(), 'ether');
    const convertedAmount = web3.utils.toBN(amountToApprove);
    await coverTokenContract.methods.approve(poolAddress, convertedAmount).send({ from: user.get('ethAddress') }).then(res => console.log(res));
    const allowance = await coverTokenContract.methods.allowance(user.get('ethAddress'), poolAddress).call();
    return allowance === amountToApprove;
  }

  const approvePrem = async (poolAddress: string, amount: number) => {
    const premTokenContract = new web3.eth.Contract(premToken, PREM_TOKEN_ADDRESS_DEV);
    const amountToApprove = web3.utils.toWei(amount.toString(), 'ether');
    const convertedAmount = web3.utils.toBN(amountToApprove);
    await premTokenContract.methods.approve(poolAddress, convertedAmount).send({ from: user.get('ethAddress') }).then(res => console.log(res));
    const allowance = await premTokenContract.methods.allowance(user.get('ethAddress'), poolAddress).call();
    return allowance === amountToApprove;
  }

  const value: ContextProps = {
    getDaiBalance,
    setDaiBalance,
    getCoverBalance,
    setCoverBalance,
    getPremBalance,
    setPremBalance,
    getCoverTotalSupply,
    getPremTotalSupply,
    updateBalances,
    approveDai,
    approveCover,
    approvePrem
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}
