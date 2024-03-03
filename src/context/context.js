'use client'
import { useContext, createContext, useState } from "react"

export const brcContext = createContext({});

export const BrcContextProvider = ({children}) => {
    const [isConnectModal, setIsConnectModal] = useState(false);
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(0)
    const [wallet, setWallet] = useState('')
    const value = {
       isConnectModal,
       address,
       wallet,
       setWallet,
       setAddress,
       setIsConnectModal
    }
    return(
    <brcContext.Provider value={value}>
     {children}
    </brcContext.Provider>
    )
}

export const GlobalContext = () => useContext(brcContext)