import { createConfig } from 'wagmi';
import { sepolia } from 'viem/chains';
import { metaMask } from 'wagmi/connectors';
import { http } from 'wagmi';

export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: false,
}); 