import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/config';

const TokenizedMutualFundApp = () => {
  const [account, setAccount] = useState('');
  const [navPerShare, setNavPerShare] = useState('0');
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  const mintShares = async () => {
    try {
      const contract = getContract();
      const tx = await contract.mint({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      alert('Shares minted successfully!');
    } catch (error) {
      console.error('Error minting shares:', error);
      alert('Error minting shares');
    }
  };

  const redeemShares = async () => {
    try {
      const contract = getContract();
      const tx = await contract.redeem(ethers.utils.parseEther(amount));
      await tx.wait();
      alert('Shares redeemed successfully!');
    } catch (error) {
      console.error('Error redeeming shares:', error);
      alert('Error redeeming shares');
    }
  };

  const updateNav = async (newNav) => {
    try {
      const contract = getContract();
      const tx = await contract.setNAV(ethers.utils.parseEther(newNav));
      await tx.wait();
      alert('NAV updated successfully!');
    } catch (error) {
      console.error('Error updating NAV:', error);
      alert('Error updating NAV');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (window.ethereum && account) {
        const contract = getContract();
        const nav = await contract.navPerShare();
        setNavPerShare(ethers.utils.formatEther(nav));
        
        const balance = await contract.balanceOf(account);
        setBalance(ethers.utils.formatEther(balance));
        
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      }
    };
    fetchData();
  }, [account]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tokenized Mutual Fund</h1>
      
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <p>Current NAV: {navPerShare} ETH</p>
          <p>Your Balance: {balance} shares</p>
          
          <div className="mt-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="border p-2 mr-2"
            />
            <button
              onClick={mintShares}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Mint Shares
            </button>
            <button
              onClick={redeemShares}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Redeem Shares
            </button>
          </div>

          {isOwner && (
            <div className="mt-4">
              <input
                type="number"
                placeholder="New NAV in ETH"
                className="border p-2 mr-2"
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                onClick={() => updateNav(amount)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Update NAV
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenizedMutualFundApp; 