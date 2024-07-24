import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserProvider, formatEther } from "ethers";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(localStorage.getItem('isConnected') === 'true');
  const [disableButton, setDisableButton] = useState(false);
  const [popup, setPopup] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // Set showSpinner to true when component mounts
    if(isWalletConnected){
        setShowSpinner(true);
    
    // Wait for 2 seconds before setting showSpinner back to false
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 2000);
    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timer);
}
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        const connectedAccount = await signer.getAddress();
        console.log('dfgdfg:');
        setAccount(connectedAccount);
        const theNetwork = await provider.getNetwork().name;
        console.log('Network:',theNetwork);
        setNetwork(theNetwork);

        localStorage.setItem('isConnected', 'true');
        const connectedBalance = await provider.getBalance(connectedAccount);
        const balanceInEther = formatEther(connectedBalance);
        setBalance(balanceInEther);
        setError(null);
        setIsWalletConnected(true);
        setPopup(false);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        if (error.code === -32002) {
          setDisableButton(true);
        }
        setError(error.message || "An error occurred while connecting to the wallet");
        localStorage.setItem('isConnected', 'false');
        setIsWalletConnected(false); // Ensure state reflects disconnect
      }
    } else {
      setError("No Ethereum provider found. Install MetaMask.");
    }
  };

  useEffect(() => {
      if(isWalletConnected){
        connectWallet();
        localStorage.setItem('isConnected', 'true');
      } 
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setNetwork(null);
        setBalance(null);
        setProvider(null);
        setError(null);
        localStorage.setItem('isConnected', 'false');
        setIsWalletConnected(false); // Update state on disconnect
      } else {
        // Handle account change
        // For simplicity, you might reload the page or reinitialize provider
        // based on your application's needs
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Clean up the event listener on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }

  }, []); // Empty dependency array ensures this effect runs only once on mount

  const triggerConnect = () => {
    // setPopup(true);
    connectWallet();
  };

  return (
    <div>
      <div className={popup ? "blur-it" : ""}>
      {/* {isWalletConnected ? "yes" : "no"} */}
        {account ? (
          <div>
            <p className="center-stuff">Connected: <b>{account}</b></p>
            <p className="center-stuff">Balance: <b>{balance} ETH</b></p>
          </div>
        ) : (<>
                {showSpinner ?
                <div className="spinner-container">
                <div className="spinner"></div>
                </div>
                :
                <>
            <div className="center-stuff">
              <button disabled={disableButton || popup} className="wallet-stuff" onClick={triggerConnect}>Connect Wallet</button>
            </div>
            {disableButton &&
              <div className="center-stuff">
                <i>Please finish via the extension&nbsp;</i>&#8599;
              </div>
            }
            </>
                }
           
            </>
        )}
      </div>
      <br />
      {/* {popup &&
        <div className="centered-square">
          <button className="styled-button" onClick={connectWallet}>Connect to Metamask</button>
          <div>{error}</div>
        </div>
      } */}
    </div>
  );
};

export default ConnectWallet;