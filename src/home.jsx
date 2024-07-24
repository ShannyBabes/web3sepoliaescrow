import { useState } from 'react'
import ConnectWallet from './connectWallet'
import './App.css'
import './index.css';
import { Web3Provider, useWeb3Context } from './web3Context';
import { useNavigate } from 
'react-router-dom';

function Home() {
  const navigate = useNavigate();
  // change testState etc. for accounts/balance/connectWallet?
  const { testState, testFunction } = useWeb3Context();

  function toCreate() {
    // navigate('/create-escrow');
    window.location.href = '/create-escrow';
}

function toTwitter() {
  window.location.href='https://x.com/Shannonhereok';
}

  return (
    <>
    <div className="title">
      <h1>Lock It Up</h1>
    </div>
    {/* <ConnectWallet /> */}
    {/* <br/> */}
    <div className="center-stuff">
    <span className="centered-text">This is a site that facilitates <i style={{textDecoration:"underline"}}>sepolia</i> ETH escrows</span>
    </div>
    <div className="center-stuff">
    <span className="centered-text">Configure your escrow specifications and lock up your ETH</span>
    </div>
    <div className="center-stuff">
<button className="a-button" onClick={toCreate}>Create Escrow</button>    
</div>
    <div className="center-stuff">
    <span style={{margin:"5px"}}><i>Created by <a href="#" onClick={toTwitter}>@Shannonhereok</a></i></span>
    </div>

    {/* <div className="center-stuff">{testState}</div> */}
    {/* <div> */}
    {/* <button onClick={testFunction}>test function</button> */}
    {/* </div> */}
    </>
  )
}

export default Home