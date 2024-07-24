import { useState } from 'react'
import ConnectWallet from './connectWallet'
import './App.css'
import './index.css';

function About() {


  return (
    <>
    <div className="title">
      <h1>Lock It Up</h1>
    </div>
     {/* <ConnectWallet /> */}
     <br/>
     <div className="center-stuff">This is where it says what the site is about</div>
    </>
  )
}

export default About