import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'ethers';

// Chainlink Aggregator V3 Interface - only the functions we need
const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer', type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Sepolia ETH/USD Price Feed address
const ETH_USD_PRICE_FEED = '0x694AA1769357215DE4FAC081bf1f309aDC325306';

export const useEthUsdPrice = () => {
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | undefined>(undefined);

  // Get decimals
  const { data: decimalsData } = useReadContract({
    address: ETH_USD_PRICE_FEED as `0x${string}`,
    abi: aggregatorV3InterfaceABI,
    functionName: 'decimals',
  });

  // Get latest price data
  const { data: roundData, isError, isLoading } = useReadContract({
    address: ETH_USD_PRICE_FEED as `0x${string}`,
    abi: aggregatorV3InterfaceABI,
    functionName: 'latestRoundData',
  });

  useEffect(() => {
    if (isError) {
      setError(new Error('Failed to fetch ETH/USD price'));
      setLoading(false);
      return;
    }

    if (!isLoading && roundData && decimalsData) {
      try {
        // Extract the price from roundData (answer is at index 1)
        // @ts-ignore - We know the structure of roundData from the ABI
        const rawPrice = roundData[1];
        const decimals = Number(decimalsData);
        
        // Get the updatedAt timestamp from roundData (at index 3)
        // @ts-ignore - We know the structure of roundData from the ABI
        const timestamp = roundData[3];
        setUpdatedAt(Number(timestamp));
        
        // Format using ethers with the correct number of decimals
        const formattedPrice = formatUnits(rawPrice, decimals);
        setPrice(formattedPrice);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error parsing price data'));
        setLoading(false);
      }
    }
  }, [roundData, decimalsData, isLoading, isError]);

  return { price, loading, error, updatedAt };
}; 