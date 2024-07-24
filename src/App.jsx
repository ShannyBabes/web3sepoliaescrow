import { useState,useEffect,useRef } from 'react'
import ConnectWallet from './connectWallet'
import './App.css'
import './index.css';
import Home from './home';
import About from './about';
import Create from './createEscrow';
import Current from './currentEscrows';
import CenterMessage from './centerMessage';
import FinishConnect from './finishConnect';

import Dropdown from './dropdown';
import { BrowserRouter as Router, Routes, Route,useLocation } from 
'react-router-dom';

import { Web3Provider, useWeb3Context } from './web3Context';

function OldApp() {
  const { testState, testFunction, triggerConnect, account,disableButton,setDisableButton } = useWeb3Context();
  const [placeholder, setPlaceholder] = useState('Home');
  const location = useLocation();
  const options = ['Home','Create Escrow','Current Escrows'];
  const [full, setFull] = useState(false);
  const centerMessageRef = useRef(null);
// just find what route your own and set placeholder to that?

useEffect(() => {
  // Update the placeholder based on the current path
  switch (location.pathname) {
    case '/home':
      setPlaceholder('Home');
      break;
    case '/current-escrows':
      setPlaceholder('Current Escrows');
      break;
    case '/create-escrow':
      setPlaceholder('Create Escrow');
      break;
    case '/about':
      // setPlaceholder('Home');
      break;
    default:
      setPlaceholder('Home'); // Default to Home if no match
  }
}, [location]);

function showFull() {
  setFull(true);
}

useEffect(() => {
  // console.log(JSON.stringify(network));
  const handleClickOutside = (event) => {
    if (centerMessageRef.current && !centerMessageRef.current.contains(event.target)) {
      setFull(false);
      setDisableButton(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

useEffect(() => {
 if(account) {
   setDisableButton(false);
   setFull(false);
 }
},[account])

  return (
    <>
      <div className={full || disableButton ? "blur-it" :"no-blur"}>
        <div className="top-right">
        {account &&<span className="dot-style"></span>}
        {account ? 
        <button disabled={full || disableButton} className="wallet-button" onClick={showFull}>
        {account.substring(0, 8)}........{account.substring(account.length - 8)}
        </button>
        :
        <button disabled={full || disableButton} className="wallet-button" onClick={triggerConnect}>Connect Wallet</button>
        }
        </div>
        <Dropdown options={options} placeholder={placeholder} />
        <Routes>
        <Route path="/" element={<Home />} />
      {/* <Route path="/about" element={<About  />} /> */}
      <Route path="/create-escrow" element={<Create  />} />
      <Route path="/current-escrows" element={<Current  />} />
      {/* <Route path="/current-courses" element={<CurrentCourses  />} /> */}
     </Routes>
     </div>
     {full && <div style={{position: "absolute", top: "75px", left: "50%", transform: "translateX(-50%)"}} ref={centerMessageRef} ><CenterMessage /></div>}
     {disableButton && <div style={{position: "absolute", top: "75px", left: "50%", transform: "translateX(-50%)"}} ref={centerMessageRef} ><FinishConnect /></div> }
    </>
  )
}

function App() {
  return (
    <Router>
      <Web3Provider>
        <OldApp />
      </Web3Provider>
    </Router>
  );
}

export default App
