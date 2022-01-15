import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('success');

  const closeNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const setNotification = (type, message) => {
    setMessage(message);
    setType(type);
  };

  const showNotification = () => {
    setOpen(true);
  };

  const makeAndShowNotification = (type, message) => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider
      value={{ open, type, message, setNotification, closeNotification, showNotification, makeAndShowNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);
