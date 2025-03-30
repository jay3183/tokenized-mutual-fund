import React, { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useConnect, useChainId, useSwitchChain } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SEPOLIA_CHAIN_ID = 11155111;

const Header = () => {
  const { address, isConnected, status } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { 
    chains, 
    switchChain,
    status: switchNetworkStatus 
  } = useSwitchChain();
  const isSwitchingNetwork = switchNetworkStatus === 'pending';
  const [darkMode, setDarkMode] = useState(false);
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);

  const formatAddress = (addr: string | undefined) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      // Default to dark if no preference stored
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Light mode enabled');
    }
    
    // Notify user of the change
    toast.success(`${newMode ? 'Dark' : 'Light'} mode activated`, {
      duration: 1500,
      position: 'bottom-right',
      icon: newMode ? '🌙' : '☀️',
    });
  };

  // Check if connected to Sepolia and show warning if not
  useEffect(() => {
    if (isConnected && chainId !== SEPOLIA_CHAIN_ID) {
      setShowNetworkWarning(true);
      toast.error(`Please switch to Sepolia network`);
    } else {
      setShowNetworkWarning(false);
    }
  }, [isConnected, chainId]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connect({ connector: metaMask() });
    } catch (error) {
      toast.error('Wallet connection failed');
      console.error(error);
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    if (switchChain) {
      try {
        await switchChain({ chainId: SEPOLIA_CHAIN_ID });
        toast.success('Successfully switched to Sepolia');
      } catch (error) {
        toast.error('Failed to switch network');
        console.error(error);
      }
    } else {
      toast.error('Network switching not supported by your wallet');
    }
  };

  useEffect(() => {
    if (status === 'connected' && address) {
      if (chainId === SEPOLIA_CHAIN_ID) {
        toast.success(`Connected: ${formatAddress(address)}`);
      }
    } else if (status === 'disconnected') {
      // Only show disconnected notification if we previously had a connection
      // This prevents the notification when the app first loads
      const hadPreviousConnection = localStorage.getItem('hadConnection') === 'true';
      if (hadPreviousConnection) {
        toast('Wallet disconnected');
      }
    }
    
    // Save connection state for future reference
    if (status === 'connected' && address) {
      localStorage.setItem('hadConnection', 'true');
    }
  }, [status, address, chainId]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex items-center justify-between px-5 py-3 backdrop-blur-md text-white shadow-lg rounded-lg mb-2 mx-auto z-10 relative border"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-white drop-shadow-lg">Franklin Templeton Fund</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-purple-600/80 text-white text-xs px-3 py-1 rounded-md border border-purple-400/30">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
          Sepolia Network
        </div>
        <button
          onClick={toggleDarkMode}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all duration-300 text-sm font-medium ${darkMode 
            ? 'bg-slate-800 border border-yellow-500/50 text-yellow-300 hover:bg-slate-700 hover:border-yellow-400' 
            : 'primary-btn'
          } shadow-md hover:shadow-lg transform hover:scale-105 min-w-[140px] h-[34px] justify-center`}
          aria-label="Toggle dark mode"
        >
          <span className={`text-lg ${!darkMode && 'animate-pulse'}`}>{darkMode ? '🌙' : '☀️'}</span>
          <span>{darkMode ? 'Dark' : 'Light'}</span>
        </button>
        
        {showNetworkWarning ? (
          <button
            onClick={handleSwitchNetwork}
            disabled={isSwitchingNetwork}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-1.5 rounded-md shadow-md transition-all hover:shadow-lg hover:scale-105 text-sm min-w-[140px] h-[34px]"
          >
            {isSwitchingNetwork ? 'Switching...' : 'Switch to Sepolia'}
          </button>
        ) : isConnected ? (
          <>
            <span className="bg-white/10 text-white px-3 py-1.5 rounded-md text-sm border border-white/10">
              {formatAddress(address!)}
            </span>
            <button
              onClick={() => disconnect()}
              className="bg-red-500/80 hover:bg-red-500/90 text-white px-3 py-1.5 rounded-md shadow-md transition-colors text-sm"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="primary-btn hover:bg-[var(--jtf-brilliant-blue)] text-white font-medium px-4 py-1.5 rounded-md shadow-md transition-all hover:shadow-lg hover:scale-105 text-sm min-w-[140px]"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;