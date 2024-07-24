import React, { useState } from 'react';
import './index.css';
import { Web3Provider, useWeb3Context } from './web3Context';

const CenterMessage = () => {
  const { testState, testFunction, triggerConnect, account } = useWeb3Context();

  return (
    <div className="centered-container">
      <div className="centered-message">
        <p>Connected with:</p>
        <p>{account}</p>
        <p><i>(Lock wallet to disconnect)</i></p>
      </div>
    </div>
  );
};

export default CenterMessage;