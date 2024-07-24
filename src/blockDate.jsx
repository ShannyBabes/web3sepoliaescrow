import React, { useState, useEffect } from 'react';
import { Web3Provider, useWeb3Context } from './web3Context';
import { ethers } from 'ethers';
const BlockDate = ({ blockNumber }) => {
const theBlockNumber = Number(blockNumber);
const { provider } = useWeb3Context();
const [blockDate, setBlockDate] = useState('');
const getBlockDate = async (provider, theBlockNumber) => {
    try {
      const block = await provider.getBlock(theBlockNumber);
      const timestamp = block.timestamp;
      const date = new Date(timestamp * 1000);
        const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      return date.toLocaleString(undefined, options); // Format as year/month/day, hour:minute:second
    } catch (error) {
      console.error('Error fetching block:', error);
      return 'Error fetching date';
    }
  };
  useEffect(() => {
    const fetchBlockDate = async () => {
      const date = await getBlockDate(provider, theBlockNumber);
      setBlockDate(date);
    };
    fetchBlockDate();
  }, [theBlockNumber, provider]);
  return (
  <span>{blockDate}</span>
  );
};
export default BlockDate