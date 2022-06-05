import { useContractKit } from '@celo-tools/use-contractkit';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLoadingContext } from './LoadingContext';

const BalanceContext = React.createContext([])

const BalanceContextProvider = ({ children }) => {
	const { address, kit } = useContractKit();
  const [balance, setBalance] = useState(0);
	const [refreshRequests, setRefreshRequests] = useState(0);
  const [,incLoading, decLoading] = useLoadingContext();

  const getBalance = useCallback(async () => {
    // Set loading
    incLoading();
    
    // fetch a connected wallet token balance
    // TODO: Change to generic ERC20
    const value = await kit.getTotalBalance(address);
    setBalance(value);

    // Reset loading
    decLoading();
  }, [address, kit, incLoading, decLoading]);

  useEffect(() => {
    if (address) getBalance();
  }, [address, getBalance, refreshRequests]);

	const requestRefresh = useCallback(() => setRefreshRequests(prev => prev + 1), [setRefreshRequests]);

	return <BalanceContext.Provider value={[balance, requestRefresh]}>
		{children}
	</BalanceContext.Provider>
}

const useBalanceContext = () => {
	const context = useContext(BalanceContext)

	return context
}

export { BalanceContextProvider, useBalanceContext }
