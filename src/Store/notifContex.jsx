import { createContext } from 'react';

export const NotifContext = createContext({
  notifTotal: 0,
  setNotifTotal: () => {},
});
