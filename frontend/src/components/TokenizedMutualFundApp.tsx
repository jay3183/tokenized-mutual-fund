import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import heroImage from '@/assets/hero.jpg';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useChainId,
} from 'wagmi';
import {
  useReadTokenizedMutualFundNavPerShare,
  useReadTokenizedMutualFundBalanceOf,
  useReadTokenizedMutualFundOwner,
  useReadTokenizedMutualFundTotalSupply,
  useWriteTokenizedMutualFundRedeem,
  useWriteTokenizedMutualFundSetNav,
} from '../hooks/tokenizedMutualFund';
import { useEthUsdPrice } from '../hooks/useEthUsdPrice';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/config';

// Add Sepolia constant 
const SEPOLIA_CHAIN_ID = 11155111;

interface TxEvent {
  type: 'Minted' | 'Redeemed' | 'NAVUpdated';
  user: string;
  amount: string;
  timestamp: string;
  txHash?: string;
}

// Add a utility function to format token amounts
const formatTokenAmount = (amount: string, decimals = 2): string => {
  const num = parseFloat(amount);
  return num.toFixed(decimals);
};

const TokenizedMutualFundApp = () => {
  const { address: account, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address: account });
  const chainId = useChainId();
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHistory, setTxHistory] = useState<TxEvent[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [directBalance, setDirectBalance] = useState("0");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Use the Chainlink ETH/USD price feed hook
  const { price: ethUsdPrice, loading: ethUsdPriceLoading, updatedAt } = useEthUsdPrice();

  const { data: nav, refetch: refetchNav } = useReadTokenizedMutualFundNavPerShare({ chainId });
  const { data: balance, refetch: refetchBalance } = useReadTokenizedMutualFundBalanceOf({ 
    chainId, 
    args: [account ?? '0x'],
  });
  const { data: owner, refetch: refetchOwner } = useReadTokenizedMutualFundOwner({ chainId });
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadTokenizedMutualFundTotalSupply({ chainId });
  const ownerAddress = owner as string;
  const isOwner = ownerAddress?.toLowerCase() === account?.toLowerCase();

  // Load transaction history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('txHistory');
    if (savedHistory) {
      try {
        setTxHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse transaction history from localStorage:", e);
      }
    }
  }, []);

  // Save transaction history to localStorage whenever it changes
  useEffect(() => {
    if (txHistory.length > 0) {
      localStorage.setItem('txHistory', JSON.stringify(txHistory));
    }
  }, [txHistory]);

  // Add debug logging to track transaction history changes
  useEffect(() => {
    console.log("Current transaction history:", txHistory);
  }, [txHistory]);

  // Monitor dark mode changes in DOM
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
    
    // Set up a mutation observer to track class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setDarkMode(isDarkMode);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Add network check before transactions
  const isNetworkReady = isConnected && isCorrectNetwork;

  const { write: redeem } = useWriteTokenizedMutualFundRedeem({
    chainId,
    args: amount ? [BigInt(ethers.parseEther(amount).toString())] : undefined,
    onSuccess: () => {
      toast.success("Redeemed shares!");
      setAmount('');
    },
    onError: () => toast.error("Redeem failed"),
  });

  const { write: setNAV } = useWriteTokenizedMutualFundSetNav({
    chainId,
    args: amount ? [BigInt(ethers.parseEther(amount).toString())] : undefined,
    onSuccess: () => {
      toast.success("NAV updated!");
      setAmount('');
    },
    onError: () => toast.error("Update NAV failed"),
  });

  // Function to refresh all data
  const refreshAllData = async () => {
    console.log("Refreshing all data...");
    try {
      if (refetchBalance) {
        console.log("Refreshing balance...");
        const result = await refetchBalance();
        console.log("New balance data:", result.data ? ethers.formatEther(result.data.toString()) : '0', "FTF");
      }
      if (refetchNav) {
        console.log("Refreshing NAV...");
        await refetchNav();
      }
      if (refetchOwner) {
        console.log("Refreshing owner...");
        await refetchOwner();
      }
      if (refetchTotalSupply) {
        console.log("Refreshing total supply...");
        await refetchTotalSupply();
      }
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Add a useEffect to monitor balance changes
  useEffect(() => {
    if (balance) {
      console.log("Balance updated:", ethers.formatEther(balance.toString()), "FTF");
    }
  }, [balance]);

  // Add frequent balance refresh
  useEffect(() => {
    if (account) {
      // Refresh balance more frequently
      const balanceInterval = setInterval(() => {
        if (refetchBalance) refetchBalance();
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(balanceInterval);
    }
  }, [account, refetchBalance]);

  // Also maintain the full data refresh interval
  useEffect(() => {
    if (account) {
      refreshAllData();
      // Refresh all data every 30 seconds
      const interval = setInterval(() => {
        if (account) {
          refreshAllData();
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [account]);

  // Function to directly check balance using ethers.js
  const checkBalanceDirectly = async () => {
    if (!account || !window.ethereum) return;
    
    try {
      console.log("Checking balance directly via ethers.js...");
      setIsRefreshing(true);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract("0x884D9173b59C29EAB67c035604b9198DA3a9FfaB", CONTRACT_ABI, provider);
      
      // Call balanceOf directly
      const balanceResult = await contract.balanceOf(account);
      const formattedBalance = ethers.formatEther(balanceResult.toString());
      console.log("Direct balance check result:", formattedBalance, "FTF");
      
      // Update the direct balance state
      setDirectBalance(formattedBalance);
      
      // Force a refresh of the wagmi hook
      if (refetchBalance) {
        await refetchBalance();
      }
      
      // Show a success toast only if this was triggered by a user action (button click)
      // and not by the automatic refresh
      if (isRefreshing) {
        toast.success("Balance refreshed");
      }
    } catch (error) {
      console.error("Error checking balance directly:", error);
      // Only show error toast if this was triggered by a user action
      if (isRefreshing) {
        toast.error("Failed to refresh balance");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add more balance refresh attempts
  useEffect(() => {
    // Check every time refreshCounter changes
    if (account) {
      checkBalanceDirectly();
    }
  }, [refreshCounter, account]);

  // Function to add a transaction to history
  const addTransactionToHistory = (txEvent: TxEvent) => {
    setTxHistory(prev => {
      // Check if transaction already exists (avoid duplicates by checking hash)
      if (txEvent.txHash && prev.some(event => event.txHash === txEvent.txHash)) {
        return prev;
      }
      
      const newHistory = [txEvent, ...prev];
      // Limit history to 50 entries to prevent localStorage bloat
      if (newHistory.length > 50) {
        return newHistory.slice(0, 50);
      }
      return newHistory;
    });
  };

  // Function to clear transaction history
  const clearTransactionHistory = () => {
    setTxHistory([]);
    localStorage.removeItem('txHistory');
    toast.success("Transaction history cleared");
  };

  const handleMint = async () => {
    if (!isNetworkReady) {
      toast.error("Please connect to Sepolia network first");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        throw new Error("No ethereum provider found");
      }
      
      // Use direct JSON-RPC call for mint function
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Manually construct the transaction data
      const tx = {
        to: "0x884D9173b59C29EAB67c035604b9198DA3a9FfaB", // Correct contract address
        value: ethers.parseEther(amount),
        data: '0x1249c58b', // Function signature for mint()
      };
      
      console.log("Sending transaction:", tx);
      const txResponse = await signer.sendTransaction(tx);
      console.log("Transaction sent:", txResponse.hash);
      
      // Show pending transaction indicator
      const pendingToastId = toast.loading("Minting shares... Please wait for confirmation");
      
      await txResponse.wait();
      console.log("Transaction confirmed");
      
      toast.dismiss(pendingToastId);
      toast.success("Minted shares successfully!");
      
      // Add the new transaction to history immediately
      const newTx: TxEvent = {
        type: 'Minted',
        user: account || '',
        amount: amount,
        timestamp: new Date().toLocaleString(),
        txHash: txResponse.hash,
      };
      
      addTransactionToHistory(newTx);
      setAmount('');
      
      // Refresh balance data after successful transaction
      await refreshAllData();
      // Check balance directly once
      await checkBalanceDirectly();
    } catch (error) {
      console.error("Mint error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to mint shares");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!isNetworkReady) {
      toast.error("Please connect to Sepolia network first");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        throw new Error("No ethereum provider found");
      }
      
      // Use direct JSON-RPC call for redeem function
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // For redeem, we need to encode the parameters
      const amountInWei = ethers.parseEther(amount);
      const contractInterface = new ethers.Interface(CONTRACT_ABI);
      const data = contractInterface.encodeFunctionData("redeem", [amountInWei]);
      
      // Manually construct the transaction data
      const tx = {
        to: "0x884D9173b59C29EAB67c035604b9198DA3a9FfaB", // Correct contract address
        data: data,
      };
      
      console.log("Sending redeem transaction:", tx);
      const txResponse = await signer.sendTransaction(tx);
      console.log("Redeem transaction sent:", txResponse.hash);
      
      // Show pending transaction indicator
      const pendingToastId = toast.loading("Redeeming shares... Please wait for confirmation");
      
      await txResponse.wait();
      console.log("Redeem transaction confirmed");
      
      toast.dismiss(pendingToastId);
      toast.success("Redeemed shares successfully!");
      
      // Add the new transaction to history immediately
      const newTx: TxEvent = {
        type: 'Redeemed',
        user: account || '',
        amount: amount,
        timestamp: new Date().toLocaleString(),
        txHash: txResponse.hash,
      };
      
      addTransactionToHistory(newTx);
      setAmount('');
      
      // Refresh balance data after successful transaction
      await refreshAllData();
      // Also check balance directly
      await checkBalanceDirectly();
    } catch (error) {
      console.error("Redeem error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to redeem shares");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNAV = async () => {
    if (!isNetworkReady) {
      toast.error("Please connect to Sepolia network first");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        throw new Error("No ethereum provider found");
      }
      
      // Use direct JSON-RPC call for setNAV function
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // For setNAV, we need to encode the parameters
      const newNavInWei = ethers.parseEther(amount);
      const contractInterface = new ethers.Interface(CONTRACT_ABI);
      const data = contractInterface.encodeFunctionData("setNAV", [newNavInWei]);
      
      // Manually construct the transaction data
      const tx = {
        to: "0x884D9173b59C29EAB67c035604b9198DA3a9FfaB", // Correct contract address
        data: data,
      };
      
      console.log("Sending setNAV transaction:", tx);
      const txResponse = await signer.sendTransaction(tx);
      console.log("SetNAV transaction sent:", txResponse.hash);
      
      // Show pending transaction indicator
      const pendingToastId = toast.loading("Updating NAV... Please wait for confirmation");
      
      await txResponse.wait();
      console.log("SetNAV transaction confirmed");
      
      toast.dismiss(pendingToastId);
      toast.success("NAV updated successfully!");
      
      // Add the new transaction to history immediately
      const newTx: TxEvent = {
        type: 'NAVUpdated',
        user: account || '',
        amount: amount,
        timestamp: new Date().toLocaleString(),
        txHash: txResponse.hash,
      };
      
      addTransactionToHistory(newTx);
      setAmount('');
      
      // Refresh balance data after successful transaction
      await refreshAllData();
    } catch (error) {
      console.error("SetNAV error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update NAV");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a connectWallet function
  const connectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleSwitchNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + SEPOLIA_CHAIN_ID.toString(16) }],
      });
      await refreshAllData();
    } catch (error) {
      console.error("Error switching network:", error);
      toast.error("Failed to switch network");
    }
  };

  return (
    <div className="min-h-screen transition-all duration-300 flex justify-center items-center relative p-0 sm:p-4 app-background"
      style={{ 
        background: 'var(--bg-color)'
      }}
    >
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: darkMode ? 0.3 : 0.5
        }}
      />
      <div 
        className="absolute inset-0 z-0 transition-all duration-300 app-hero-overlay"
      />
      <Toaster position="top-right" />

      {isLoading && (
        <div className="fixed inset-0 bg-white/60 dark:bg-black/60 z-50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isConnected && !isCorrectNetwork && (
        <div className="fixed top-20 left-0 right-0 bg-amber-500 text-white py-2 px-4 text-center font-semibold z-50">
          Please switch to Sepolia network to interact with this app
        </div>
      )}

      {!isConnected ? (
        <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col items-center justify-center px-4">
          {/* Centered Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
            className="relative z-10 backdrop-blur-xl border rounded-2xl shadow-xl p-6 sm:p-10 max-w-xl mx-auto text-center app-card"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-md mb-4"
              style={{ color: 'var(--text-color)' }}
            >
              Franklin Templeton<br/>Tokenized Fund
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 text-base sm:text-lg"
              style={{ color: 'var(--text-color)' }}
            >
              Invest, track, and manage your mutual fund shares on Ethereum seamlessly.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-6 mx-auto text-left space-y-3 max-w-md"
              style={{ color: 'var(--text-color)' }}
            >
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> 
                <span>Instant minting and redemption</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> 
                <span>Real-time NAV updates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> 
                <span>Secure blockchain custody</span>
              </li>
              <li className="flex items-center gap-2 bg-purple-500/20 p-2 rounded-md border border-purple-400/30 mt-4">
                <span className="text-purple-400">ℹ️</span> 
                <span className="text-sm">This app runs exclusively on the <strong>Sepolia test network</strong></span>
              </li>
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-base sm:text-lg flex items-center gap-2 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-lg border app-card"
              >
                <span className="text-2xl"></span> 
                <span>Connect your wallet using the button in the header to get started! 👆</span>
              </motion.div>
              
              <a 
                href="https://sepolia.etherscan.io/address/0x884D9173b59C29EAB67c035604b9198DA3a9FfaB" 
                target="_blank" 
                rel="noopener noreferrer"
                className="primary-btn font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transition-all hover:shadow-lg hover:scale-105 border flex items-center gap-2 w-full sm:w-auto"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span>View Contract</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto pt-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-sm" style={{ color: 'var(--text-color)' }}>Tokenized Mutual Fund</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 app-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Your Balance</h2>
                <button 
                  onClick={checkBalanceDirectly}
                  disabled={isRefreshing}
                  className="primary-btn text-xs px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-wait transition-colors ml-2"
                >
                  {isRefreshing ? "..." : "↻"}
                </button>
              </div>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
                {isRefreshing ? (
                  <span className="opacity-60">Loading...</span>
                ) : (
                  formatTokenAmount(directBalance) + " FTF"
                )}
              </p>
              <small className="text-gray-500 italic block mt-2">
                FTF (Franklin Templeton Fund tokens) represent your shares in the mutual fund.
              </small>
            </div>
            <div className="backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 app-card">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>NAV per Share</h2>
              </div>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
                {!nav ? (
                  <span className="opacity-60">Loading...</span>
                ) : (
                  formatTokenAmount(ethers.formatEther(nav.toString())) + " ETH"
                )}
              </p>
              <small className="text-gray-500 italic block mt-2">
                NAV: Set by fund owner. Determines mint/redeem share pricing.
              </small>
              {totalSupply ? (
                <p className="text-sm text-gray-600 mt-2">
                  Total Supply: {formatTokenAmount(ethers.formatEther(totalSupply.toString()))} FTF
                </p>
              ) : null}
            </div>
          </div>
          
          {/* Chainlink ETH/USD Price Card */}
          <div className="backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border mb-8 transition-all duration-300 app-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>ETH/USD Price</h2>
              <div className="flex items-center">
                <span className="text-xs px-2 py-1 rounded-md bg-blue-500/20 text-blue-500 border border-blue-500/30">
                  Chainlink Data Feed
                </span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-color)' }}>
              {ethUsdPriceLoading ? (
                <span className="opacity-60">Loading...</span>
              ) : ethUsdPrice ? (
                <span>${parseFloat(ethUsdPrice).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              ) : (
                <span className="opacity-60">Not available</span>
              )}
            </p>
            <small className="text-gray-500 italic block mt-2">
              ETH/USD: Live Chainlink price feed.
              {updatedAt && (
                <span className="block mt-1">
                  Last updated: {new Date(Number(updatedAt) * 1000).toLocaleString()}
                </span>
              )}
            </small>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border mb-8 transition-all duration-300 app-card"
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Actions</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="w-full p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-color)'
              }}
            />
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={handleMint}
                disabled={isLoading}
                className="flex-1 bg-green-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-green-600/90 transition-colors shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
              >
                {isLoading ? "Minting..." : "Mint"}
              </button>
              <button
                onClick={handleRedeem}
                className="flex-1 bg-red-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-red-600/90 transition-colors shadow-md font-semibold min-w-[80px]"
              >
                Redeem
              </button>
              {isOwner && (
                <button
                  onClick={handleUpdateNAV}
                  className="flex-1 bg-blue-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-600/90 transition-colors shadow-md font-semibold min-w-[80px]"
                >
                  Update NAV
                </button>
              )}
            </div>
          </motion.div>

          <div className="backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-lg border transition-all duration-300 app-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Transaction History</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--text-color)' }}>
                  {txHistory.length} transaction{txHistory.length !== 1 ? 's' : ''}
                </span>
                {txHistory.length > 0 && (
                  <button 
                    onClick={clearTransactionHistory}
                    className="primary-btn text-sm px-3 py-1.5 rounded-md transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {txHistory.length > 0 ? (
                txHistory
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((event, index) => (
                    <div key={index} className="border-b pb-3 transition-all duration-300"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          event.type === 'Minted' ? 'text-green-400' : 
                          event.type === 'Redeemed' ? 'text-red-400' : 
                          'text-blue-400'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-xs opacity-60" style={{ color: 'var(--text-color)' }}>
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-sm opacity-80" style={{ color: 'var(--text-color)' }}>User: {event.user}</p>
                      <p className="text-sm opacity-80" style={{ color: 'var(--text-color)' }}>Amount: {formatTokenAmount(event.amount)} ETH</p>
                      {event.txHash && (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${event.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:underline"
                        >
                          View on Etherscan
                        </a>
                      )}
                    </div>
                  ))
              ) : (
                <p className="opacity-50" style={{ color: 'var(--text-color)' }}>No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenizedMutualFundApp;