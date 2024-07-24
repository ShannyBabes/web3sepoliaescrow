import { useEffect, useState } from 'react'
import ConnectWallet from './connectWallet'
import './App.css'
import './index.css';
import { Web3Provider, useWeb3Context } from './web3Context';
import { ethers, Contract, parseEther,formatEther } from 'ethers';
import BlockToTime from './blockToTime';
import BlockDate from './blockDate';

function Current() {
  const { account,theSigner,provider,blockNumber } = useWeb3Context();
  const [abridgedAccount,setAbridgedAccount] = useState();
  const [escrowList, setEscrowList] = useState([]);
  const [escrowAddresses, setEscrowAddresses] = useState([]);
  const [theFilter, setTheFilter] = useState();
  const [isReturning, setIsReturning] = useState(null);
  const [isReturned, setIsReturned] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // 
  const escrowAbi = [
    {
      "inputs": [],
      "name": "sendBack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_blockDelay",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "blockDelay",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fundsSentBack",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isFinished",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sender",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startBlock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];


// contract factory ABI:

const contractABI =
  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_blockDelay",
          "type": "uint256"
        }
      ],
      "name": "createEscrow",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "escrowAddress",
          "type": "address"
        }
      ],
      "name": "EscrowCreated",
      "type": "event"
    }
];
const contractAddress = '0x5D91003503750d3d04256B13eE03c8274C246252';

const contract = new Contract(contractAddress, contractABI, theSigner);
  // 

  useEffect(() => {
    if(account!=null) {
      setAbridgedAccount(`${account.substring(0, 8)}...${account.substring(account.length - 8)}`);
    }
    const fetchedEscrowList = [
      { id: 1, name: 'Escrow 1', amount: 1000 },
      { id: 2, name: 'Escrow 2', amount: 2000 },
      { id: 3, name: 'Escrow 3', amount: 3000 }
    ];
    setEscrowList(fetchedEscrowList);
  },[account])
  // const smallAccount = `${account.substring(0, 8)}...${account.substring(account.length - 8)}`;
 // Has this user deployed 1 or more contracts?
 const [escrowData, setEscrowData] = useState([]);
 useEffect(() => {
  if(!account){
    return;
  } else {
  const userAddress = account.toString();
  const fetchUserEscrows = async () => {
    try {

    const filter = contract.filters.EscrowCreated(userAddress);
    const events = await contract.queryFilter(filter);
    const addresses = events.map(event => event.args.escrowAddress);
    // setEscrowAddresses(addresses);
    const dataPromises = addresses.map(async (address) => {
      // const escrowContract = new ethers.Contract(address, escrowAbi, contract.provider);
      const escrowContract = new Contract(address, escrowAbi, provider);
      const balancePromise = provider.getBalance(address);
      const blockDelayPromise = escrowContract.blockDelay();
      const startBlockPromise = escrowContract.startBlock();
      const fundsSentBackPromise = escrowContract.fundsSentBack();
      // Fetch other data as needed
      
      // Await all promises
      const [balance, blockDelay, startBlock,fundsSentBack] = await Promise.all([
        balancePromise,
        blockDelayPromise,
        startBlockPromise,
        fundsSentBackPromise,
        // Add other promises here
      ]);
      
      return {
        address,
        balance: formatEther(balance),
        blockDelay: blockDelay.toString(),
        startBlock: startBlock.toString(),
        fundsSentBack: fundsSentBack.toString(),
        // Add other data here
      };
    });
    // Resolve all data promises
    const theEscrowData = await Promise.all(dataPromises);
    setEscrowData(theEscrowData);
  } catch (error) {
    console.error('Error fetching user escrows:', error);
  }
  };
  if (userAddress) {
    fetchUserEscrows();
  }
}
}, [account]);

const returnEth = async (escrow,i) => {
  try {
    setIsReturning(i);
    const escrowContract = new Contract(escrow.address, escrowAbi, theSigner);
    const tx = await escrowContract.sendBack();
    await tx.wait();
    console.log('Funds sent back successfully!');
    setIsReturned(i);
  } catch (error) {
    setIsReturning(null);
    setIsReturned(null);
    console.error('Error sending back funds:', error);
  } finally {
    // window.location.reload();
  }
};

function filterAll() {
  setTheFilter('All');
  sessionStorage.setItem('theFilter', 'All');
}
function filterInProgress() {
  setTheFilter('InProgress');
  sessionStorage.setItem('theFilter', 'InProgress');
}
function filterReady() {
  setTheFilter('Ready');
  sessionStorage.setItem('theFilter', 'Ready');
}
function filterFinished() {
  setTheFilter('Finished');
  sessionStorage.setItem('theFilter', 'Finished');
}

const filteredEscrowData = escrowData.filter(escrow => {
  const blocksLeft = (parseInt(escrow.startBlock) + parseInt(escrow.blockDelay)) - blockNumber;

  if (theFilter === 'All') {
    return true;
  } else if (theFilter === 'InProgress') {
    return blocksLeft > 0;
  } else if (theFilter === 'Ready') {
    return blocksLeft <= 0 && escrow.fundsSentBack === "false";
  } else if (theFilter === 'Finished') {
    return blocksLeft <= 0 && escrow.fundsSentBack === "true";
  }
  return false;
});

useEffect(() => {
  const storedFilter = sessionStorage.getItem('theFilter');
  if (storedFilter) {
    setTheFilter(storedFilter);
  } else {
    setTheFilter('All');
  }
}, [theFilter]);

// 
// const connectedBalance = await provider.getBalance(connectedAccount);
// const balanceInEther = formatEther(connectedBalance);
// setBalance(balanceInEther);
// 

// useEffect(() => {
//   const calculateTimeLeft = () => {
//     const secondsPerBlock = 15;
//     const totalSeconds = blocksLeft * secondsPerBlock;

//     const days = Math.floor(totalSeconds / (24 * 60 * 60));
//     const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
//     const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

//     setTimeLeft({ days, hours, minutes });
//   };

//   calculateTimeLeft();
// }, [blocksLeft]);

const [waitTime, setWaitTime] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaitTime(true);
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  return (
    <>
    <div className="title">
      <h1>Lock It Up</h1>
    </div>
     {/* <ConnectWallet /> */}
     {/* <br/> */}
     <div >
     {account ? 
     <>
      <div className="centered-text">Escrows for: {abridgedAccount}:</div>
      <div className="center-stuff">

      <button className={theFilter === 'All'?"current-filters-clicked":"current-filters"} onClick={filterAll}>All</button>
      <button className={theFilter === 'InProgress'?"current-filters-clicked":"current-filters"} onClick={filterInProgress}>Not Ready</button>
      <button className={theFilter === 'Ready'?"current-filters-clicked":"current-filters"} onClick={filterReady}>Ready</button>
      <button className={theFilter === 'Finished'?"current-filters-clicked":"current-filters"} onClick={filterFinished}>Finished</button>
      </div>
      <div >
      <br/>
      <>
        {filteredEscrowData.length===0 && <div className="center-stuff"><br/><br/><i>{waitTime?"Nothing here...":<div className="current-spinner"></div>}</i></div>}
        {filteredEscrowData.map((escrow,i) => {
          const blocksLeft = (parseInt(escrow.startBlock) + parseInt(escrow.blockDelay)) - blockNumber;
          return(
          <div className="center-stuff">
          <div className={blocksLeft < 0 ?escrow.fundsSentBack=="false" ?"current-ready":"current-finished":"current-active"} key={i}>
            {/* <h4>{JSON.stringify(escrow)}{i+1}</h4> */}
            <p>Escrow address: <strong>{escrow.address}</strong></p>
            <p>Creation Date: <BlockDate blockNumber={escrow.startBlock} /></p>
            <p>Balance: {escrow.balance} ETH</p>
            {escrow.fundsSentBack=="true" ? 
            <>
            <p>FINISHED (ETH returned)</p>
            </>
            :
            <>
            {blocksLeft < 0 ?
              <>
              {isReturned===i ?
              <>
              <div style={{marginBottom:"35px",textAlign:"center",textDecoration:"underline"}}>&#10003; Funds have been returned &#10003;</div>
              </>
              :
              <>
              {isReturning===i ?
              <>
              <div>
                <div className="current-spinner"></div>
                </div>
              </>
              :
              <>
              <p>ACTIVE (ready to withdraw)</p>
              <button className="return-funds" onClick={() => returnEth(escrow,i)}>Return Funds</button>
              </>
              }
              </>
              }
              
              </>
              :
              <div>
            <p>ACTIVE
            ~ {blocksLeft} blocks <BlockToTime blocksLeft={blocksLeft} /> left
            </p>
            {/* {blocksLeft}; minutes left: ~ {(blocksLeft*15)/60}; hours left: ~ {((blocksLeft*15)/60)/60}; days left: ~ {(((blocksLeft*15)/60)/60)/24} */}
            <button className="return-funds" disabled onClick={() => returnEth(escrow)}>Return Funds</button>
            </div>
            }
            </>
            }
          </div>
          </div>
        )})}
      </>
     </div>
    <br/><br/><br/>
     {/* {JSON.stringify(escrowData)} */}
      </>
     :
     <div className="centered-text"><i>No wallet connected...</i></div>
     }
     </div>
    </>
  )
}

export default Current