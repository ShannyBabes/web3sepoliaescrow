import { useState } from 'react'
import ConnectWallet from './connectWallet'
import './App.css'
import './index.css';

function Past() {


  return (
    <>
    <div className="title">
      <h1>Lock It Up</h1>
    </div>
     {/* <ConnectWallet /> */}
     <br/>
     <div className="center-stuff">These are escrows you had in the past</div>
    </>
  )
}

export default Past