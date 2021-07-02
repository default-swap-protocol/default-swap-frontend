import React, { useContext, useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { formatUnits } from "@ethersproject/units";
import BalanceHelper from '@utils/balanceHelper';

const AccountContext = React.createContext<ContextProps | null>(null);

export interface ContextProps {
  getDaiBalance: () => string,
  setDaiBalance: (balance: string) => void
}
 
export const useAccount = () => {
  return useContext(AccountContext);
}

// Context for tracking account info and balances
export const AccountProvider = ({ children }) => {
  const { isAuthenticated } = useMoralis();
  const [_daiBalance, _setDaiBalance] = useState('0');

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const balance = await BalanceHelper.getERC20TokenBalance('DAI');
        _setDaiBalance(formatUnits(balance.balance, 18));
      }
    })();
  }, [isAuthenticated])  

  const getDaiBalance = () => {
    return _daiBalance;
  }

  const setDaiBalance = (balance: string) => {
    _setDaiBalance(balance);
  }

  const value: ContextProps = {
    getDaiBalance,
    setDaiBalance
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}
