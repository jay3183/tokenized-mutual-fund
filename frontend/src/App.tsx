import React from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from './wagmi.config';
import Header from './components/Header';
import TokenizedMutualFundApp from './components/TokenizedMutualFundApp';
import './styles.css';

function App() {
  return (
    <WagmiConfig config={config}>
      <div className="App max-w-[100vw] overflow-x-hidden">
        <Header />
        <div className="mt-4">
          <TokenizedMutualFundApp />
        </div>
      </div>
    </WagmiConfig>
  );
}

export default App;