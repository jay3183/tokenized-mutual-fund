import {
  useReadContract,
  useWriteContract
} from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/config';

export function useReadTokenizedMutualFundNavPerShare({ chainId }: { chainId: number }) {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'navPerShare',
    chainId,
  });
}

export function useReadTokenizedMutualFundBalanceOf({ 
  chainId, 
  args,
}: { 
  chainId: number; 
  args: [string];
}) {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args,
    chainId,
  });
}

export function useReadTokenizedMutualFundOwner({ chainId }: { chainId: number }) {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'owner',
    chainId,
  });
}

export function useWriteTokenizedMutualFundMint({ 
  chainId, 
  value, 
  onSuccess, 
  onError 
}: { 
  chainId: number; 
  value?: bigint;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  return {
    write: () => writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'mint',
      value: value,
      chainId,
    })
  };
}

export function useWriteTokenizedMutualFundRedeem({ 
  chainId, 
  args, 
  onSuccess, 
  onError 
}: { 
  chainId: number; 
  args?: [bigint];
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  return {
    write: () => writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'redeem',
      args: args,
      chainId,
    })
  };
}

export function useWriteTokenizedMutualFundSetNav({ 
  chainId, 
  args, 
  onSuccess, 
  onError 
}: { 
  chainId: number; 
  args?: [bigint];
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: onSuccess,
      onError: onError
    }
  });

  return {
    write: () => writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'setNav',
      args: args,
      chainId,
    })
  };
}

export function useReadTokenizedMutualFundTotalSupply({ chainId }: { chainId: number }) {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
    chainId,
  });
} 