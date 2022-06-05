import React, { useContext, useState, useCallback } from 'react';

const NotificationsContext = React.createContext([])

const NotificationsContextProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	const insertNotification = useCallback(
		({text, status = "success", duration = 5000}) => {
			const index = new Date().getTime();
			setNotifications(prev => [...prev, {text, status, duration, index}]);

			setTimeout(() => {
				setNotifications(prev => prev.filter(n => n.index !== index));
			}, duration);
		},
		[setNotifications],
	);

	window.addNotification = insertNotification;

	return <NotificationsContext.Provider value={[notifications, insertNotification]}>
		{children}
	</NotificationsContext.Provider>
}

const useNotificationsContext = () => {
	const context = useContext(NotificationsContext)

	return context
}

export { NotificationsContextProvider, useNotificationsContext }
