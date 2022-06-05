import React, { useContext, useState, useCallback } from 'react';

const LoadingContext = React.createContext([])

const LoadingContextProvider = ({ children }) => {
	const [state, setState] = useState(0);

	const increaseLoading = useCallback(
		() => {
			setState(prev => prev + 1);
		},
		[setState],
	);

	const decreaseLoading = useCallback(
		() => {
			setState(prev => prev - 1);
		},
		[setState],
	);


	return <LoadingContext.Provider value={[state !== 0, increaseLoading, decreaseLoading]}>
		{children}
	</LoadingContext.Provider>
}

const useLoadingContext = () => {
	const context = useContext(LoadingContext)

	return context
}

export { LoadingContextProvider, useLoadingContext }
