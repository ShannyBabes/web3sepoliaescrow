import React, { useState } from 'react';
import './index.css';
import { Web3Provider, useWeb3Context } from './web3Context';

const FinishConnect = () => {
  const { testState, testFunction, triggerConnect, account } = useWeb3Context();

  return (
    <>
    
    <div className="centered-container">
      <div className="centered-message">
        <p>Please finish connecting via the extension</p>
        {/* <p>&uarr;</p> */}
      </div>
    </div>
    </>
  );
};

export default FinishConnect;