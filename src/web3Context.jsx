import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers, BrowserProvider,formatEther } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [theSigner, setTheSigner] = useState(null);
    const [theChain, setTheChain] = useState(null);
    const [network, setNetwork] = useState(null);
    const [sig, setSig] = useState(null);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isWalletConnected, setIsWalletConnected] = useState(localStorage.getItem('isConnected'));
    const [disableButton, setDisableButton] = useState(false);
    const [popup, setPopup] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [blockNumber, setBlockNumber] = useState(null);

  
    useEffect(() => {
      if(isWalletConnected){
          setShowSpinner(true);
     const timer = setTimeout(() => {
        setShowSpinner(false);
      }, 2000);
      return () => clearTimeout(timer);
  }
    }, []);
  
    const connectWallet = async () => {
      localStorage.setItem('isConnected', 'true');
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new BrowserProvider(window.ethereum);
          setProvider(provider);
          const signer = await provider.getSigner();
          setTheSigner(signer);
          const connectedAccount = await signer.getAddress();
          setAccount(connectedAccount);
          const theNetwork = await provider.getNetwork();
          setNetwork(theNetwork.name);
          setTheChain(theNetwork.chainId);
          // const signIt = await signer.signMessage();
          // setSig(signIt);
          localStorage.setItem('isConnected', 'true');
            setIsWalletConnected(true);
          const connectedBalance = await provider.getBalance(connectedAccount);
          const balanceInEther = formatEther(connectedBalance);
          setBalance(balanceInEther);
          setError(null);
          setIsWalletConnected(true);
          setPopup(false);
          const theBlockNumber = await provider.getBlockNumber();
          setBlockNumber(theBlockNumber);
        } catch (error) {
          console.error("Error connecting to wallet:", error);
          if (error.code === -32002) {
            setDisableButton(true);
          }
          setError(error.message || "An error occurred while connecting to the wallet");
          // localStorage.setItem('isConnected', 'false');
          // setIsWalletConnected(false); 
        }
      } else {
        setError("No Ethereum provider found. Install MetaMask.");
      }
    };
  
    useEffect(() => {
        if(localStorage.getItem('isConnected')=='true'){
          // alert('dfgfdg');
          connectWallet();
          // localStorage.setItem('isConnected', 'true');
            // setIsWalletConnected(true);
        } 
        const handleNetworkChanged = () => {
          connectWallet();
      };
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setNetwork(null);
          setTheChain(null);
          setBalance(null);
          setProvider(null);
          setError(null);
          // localStorage.setItem('isConnected', 'false');
          // setIsWalletConnected(false);
        } else {
          // connectWallet();
        }
      };
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleNetworkChanged);
          return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleNetworkChanged);
        };
      }
    }, []); 

    useEffect(() => {
      if(!account) {
        // localStorage.setItem()
        localStorage.setItem('isConnected', 'false');
      } else {
        localStorage.setItem('isConnected', 'true');
      }
    },[account])
  
    const triggerConnect = () => {
      // setPopup(true);
      connectWallet();
    };

    const [testState, setTestState] = useState('dfgdfgfd');
    const testFunction = () => {
        console.log('test function passed through');
    }

  return (
    <Web3Context.Provider value={{ testState, testFunction, triggerConnect, provider,account,network,theChain,sig,theSigner,disableButton,setDisableButton,blockNumber }}>
      {children}
      {/* {JSON.stringify(isWalletConnected)} */}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => useContext(Web3Context);