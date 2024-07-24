import { useEffect, useState } from 'react'
import ConnectWallet from './connectWallet'
import './App.css'
import './index.css';
import { Web3Provider, useWeb3Context } from './web3Context';
import { ethers, Contract, parseEther } from 'ethers';
import BlockToTime from './blockToTime';

function Create() {
  const { account, network, theChain,sig,theSigner,provider } = useWeb3Context();
  const [error,setError] = useState('');
  const [off,setOff] = useState(false);
  const [spin,setSpin] = useState(false);
  // const userAddress = account.toString();
  const [formData, setFormData] = useState({
    blocksToWait:'',
    amount:''
  });

  // new contract instance ABI:

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

   // Handler for input change
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [transactionHash, setTransactionHash] = useState('');
  const [escrowAddresses, setEscrowAddresses] = useState([]);
  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpin(true);
    if(theChain.toString()==="11155111"){
      // setError('yes');
      console.log(theSigner);
      // theSigner.signMessage('dfgdfg');
      try {
        const blockDelay = formData.blocksToWait;
        const value = parseEther(formData.amount);
  
        const tx = await contract.createEscrow(blockDelay, { value });
        setTransactionHash(tx.hash);
        await tx.wait(); // Wait for transaction to be mined
        console.log('Escrow created successfully!');
        console.log(transactionHash);
        console.log(tx);
        setSpin(false);
        setError('Escrow created successfully!');
        setFormData({
          blocksToWait: '',
          amount: ''
        });
      } catch (error) {
        setFormData({
          blocksToWait: '',
          amount: ''
        });
        setSpin(false);
        console.error('Error creating escrow:', error);
        setError(error.message);
      }

    } else {
      setFormData({
        blocksToWait: '',
        amount: ''
      });
      setSpin(false);
      setError('Change network to Sepolia');
    }
    
  };
  // escrow fields:
  // 
  //
  // useEffect(()=>{
  //   console.log(network);
  // },[])

  function returnEth() {
    // alert('dfg');
  }

  // Has this user deployed 1 or more contracts?
  useEffect(() => {
    if(!account){
      return;
    } else {

    const userAddress = account.toString();
    const fetchUserEscrows = async () => {
      // Set up the provider and contract
      // const factoryContract = new ethers.Contract(contractAddress, contractABI, provider);

      // Filter the EscrowCreated events by user address
      const filter = contract.filters.EscrowCreated(userAddress);
      const events = await contract.queryFilter(filter);

      // Extract the escrow addresses from the events
      const addresses = events.map(event => event.args.escrowAddress);
      setEscrowAddresses(addresses);
    };

    if (userAddress) {
      // alert('dfg');
      fetchUserEscrows();
    }
  }
  }, [account]);

  useEffect(() => {
    if(formData.amount.length==0 || formData.blocksToWait.length==0) {
      setOff(true);
    } else {
      setOff(false);
    }
  },[formData])

  return (
    <>
    <div className="title">
      <h1>Lock It Up</h1>
    </div>
     {/* <ConnectWallet /> */}
     {/* <br/> */}
     {/* create escrow flow below: */}
     <div>
     {/* <div>
          <label>
          {account && <div className="center-stuff">Address:</div>}
          <div className="center-stuff">
            {account &&
            <span style={{margin:"5px"}}>
            <i>{account.substring(0, 8)}.....{account.substring(account.length - 8)}</i>
            </span>
            }
            </div>
          </label>
        </div> */}
        <br/>
      <form onSubmit={handleSubmit}>
        {/* date version */}
        {/* <div>
          <label>
            <div className="center-stuff">
            <span style={{margin:"5px"}}>Completion Date:</span>
            </div>
            <div className="center-stuff">
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              className="date-input"
            />
            </div>
          </label>
        </div> */}

        {/* block time version: */}
        <div>
          <label>
            <div className="center-stuff">
            <span style={{margin:"5px"}}>Number of Blocks to Wait:</span>
            </div>
            <div className="center-stuff">
            <input
              // type="number"
              name="blocksToWait"
              value={formData.blocksToWait}
              onChange={handleChange}
              className="date-input"
            />
            </div>
          </label>
        </div>
        {formData.blocksToWait &&
        <div className="center-stuff" style={{margin:"15px"}}>
        ~&nbsp;<BlockToTime blocksLeft={formData.blocksToWait} />
        </div>
        }
        
        {/* <br/><br/> */}
        <div>
          <label>
          <div className="center-stuff">
            <span style={{margin:"5px"}}>{network &&`(${network})`} ETH Amount:</span>
            </div>          
            <div className="center-stuff">
            <input
              // type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="amount-input"

            />
            </div>
          </label>
        </div>

        {/* <div>
          <label>
          <div className="center-stuff">
            <span style={{margin:"5px"}}>Lesson ID:</span>
            </div>            
            <div className="center-stuff">
            <input
              type="text"
              name="three"
              value={formData.three}
              onChange={handleChange}
            />
            </div>
          </label>
        </div> */}

        {/* <div>
          <label>
          <div className="center-stuff">
            <span style={{margin:"5px"}}>Routine:</span>
            </div>          
            <div className="center-stuff">
            <input
              type="text"
              name="four"
              value={formData.four}
              onChange={handleChange}
            />
            </div>
          </label>
        </div> */}
      
        <div className="center-stuff">
        <button disabled={!account || off || spin ? true : false} className="a-button" type="submit">Create Escrow</button>
        </div>
        {spin &&
          <div className="center-stuff">
          <div className="current-spinner"></div>
          </div>
        }
        <div className="center-stuff" style={{margin:"10px"}}>{error}</div>
        {/* {network && <span>{network.toString()}</span>} */}
        {/* {JSON.stringify(dfgfd)} */}
        {/* {!account && <div className="center-stuff"><i>No Wallet Connected...</i></div>} */}
      </form>
      <br/>
      {/* <div className="center-stuff">
        <button onClick={returnEth}>Return ETH</button>
        </div> */}
        {/* {JSON.stringify(escrowAddresses)} */}
      <div>
          <label>
          {/* {account && <div className="center-stuff">Connected with:</div>} */}
          <div className="center-stuff">
            {account &&
            <span style={{margin:"5px"}}>
            {/* <i>{account.substring(0, 8)}.....{account.substring(account.length - 8)}</i> */}
            </span>
            }
            </div>
          </label>
        </div>
    </div>
    </>
  )
}

export default Create