import React, { useContext, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { formatUnits } from "@ethersproject/units";
import BalanceHelper from '@utils/balanceHelper';
import { premToken, coverToken } from "@contracts/index" // TODO: Make dynamic after demo

const AccountContext = React.createContext<ContextProps | null>(null);

// TODO: Remove hardcoding and get token addresses from factory contract
const PREM_TOKEN_ADDRESS_DEV = "0x59f2f1fcfe2474fd5f0b9ba1e73ca90b143eb8d0"
const COVER_TOKEN_ADDRESS_DEV= "0xbcf26943c0197d2ee0e5d05c716be60cc2761508"

export interface ContextProps {
  getDaiBalance: () => string,
  setDaiBalance: (balance: string) => void,
  getCoverBalance: () => string,
  setCoverBalance: (balance: string) => void
  getPremBalance: () => string,
  setPremBalance: (balance: string) => void,
  updateBalances: () => Promise<void>,
  approveDai: (amount: number) => Promise<boolean>,
  approveCover: (amount: number) => Promise<boolean>,
  approvePrem: (amount: number) => Promise<boolean>
}
 
export const useAccount = () => {
  return useContext(AccountContext);
}

// Context for tracking account info and balances
export const AccountProvider = ({ children }) => {
  const { web3, isWeb3Enabled, enableWeb3, user, isAuthenticated } = useMoralis();
  const [_daiBalance, _setDaiBalance] = useState('0.0');
  const [_coverBalance, _setCoverBalance] = useState('0.0'); // TODO: extend to different pools' cover tokens
  const [_premBalance, _setPremBalance] = useState('0.0');

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
    const coverTokenContract = new web3.eth.Contract(coverToken, COVER_TOKEN_ADDRESS_DEV);
    const premTokenContract = new web3.eth.Contract(premToken, PREM_TOKEN_ADDRESS_DEV);

    const daiBalance = await BalanceHelper.getERC20TokenBalance('DAI');
    const premBalance = await premTokenContract?.methods.balanceOf(user.get('ethAddress')).call();
    const coverBalance = await coverTokenContract?.methods.balanceOf(user.get('ethAddress')).call();
    _setDaiBalance(formatUnits(daiBalance.balance, 18));
    _setPremBalance(formatUnits(premBalance, 18));1
    _setCoverBalance(formatUnits(coverBalance, 18));
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

  const approveDai = async (amount: number) => {
    return true;
  }

  const approveCover = async (amount: number) => {
    const coverTokenContract = new web3.eth.Contract(coverToken, COVER_TOKEN_ADDRESS_DEV);
    const approved: boolean = await coverTokenContract?.methods.approve(user.get('ethAddress'), amount).call();
    return approved;
  }

  const approvePrem = async (amount: number) => {
    const premTokenContract = new web3.eth.Contract(premToken, PREM_TOKEN_ADDRESS_DEV);
    const approved: boolean = await premTokenContract?.methods.approve(user.get('ethAddress'), amount).call();
    return approved;
  }

  const value: ContextProps = {
    getDaiBalance,
    setDaiBalance,
    getCoverBalance,
    setCoverBalance,
    getPremBalance,
    setPremBalance,
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
