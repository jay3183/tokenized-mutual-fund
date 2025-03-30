import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenizedMutualFund
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const tokenizedMutualFundAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'initialNav', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'MINIMUM_MINT_SHARES',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'navPerShare',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shareAmount', internalType: 'uint256', type: 'uint256' }],
    name: 'redeem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newNav', internalType: 'uint256', type: 'uint256' }],
    name: 'setNAV',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amountEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Minted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newNav',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'updatedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NAVUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountEth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Redeemed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const tokenizedMutualFundAddress = {
  11155111: '0x820228309522f3eB39A3700b9Bc42ac3f3f66571',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const tokenizedMutualFundConfig = {
  address: tokenizedMutualFundAddress,
  abi: tokenizedMutualFundAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFund = /*#__PURE__*/ createUseReadContract({
  abi: tokenizedMutualFundAbi,
  address: tokenizedMutualFundAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"MINIMUM_MINT_SHARES"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundMinimumMintShares =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'MINIMUM_MINT_SHARES',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"allowance"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"balanceOf"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"decimals"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"name"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundName =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"navPerShare"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundNavPerShare =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'navPerShare',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"paused"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundPaused =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'paused',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"symbol"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundSymbol =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'symbol',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"totalAssets"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundTotalAssets =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'totalAssets',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"totalSupply"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useReadTokenizedMutualFundTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFund = /*#__PURE__*/ createUseWriteContract(
  { abi: tokenizedMutualFundAbi, address: tokenizedMutualFundAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundMint =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundPause =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"redeem"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundRedeem =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'redeem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"setNAV"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundSetNav =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'setNAV',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWriteTokenizedMutualFundUnpause =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFund =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"approve"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"mint"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"pause"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"redeem"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundRedeem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'redeem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"setNAV"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundSetNav =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'setNAV',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"transferFrom"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `functionName` set to `"unpause"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useSimulateTokenizedMutualFundUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"Approval"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"Minted"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'Minted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"NAVUpdated"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundNavUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'NAVUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"Paused"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"Redeemed"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundRedeemedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'Redeemed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"Transfer"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenizedMutualFundAbi}__ and `eventName` set to `"Unpaused"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x820228309522f3eB39A3700b9Bc42ac3f3f66571)
 */
export const useWatchTokenizedMutualFundUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenizedMutualFundAbi,
    address: tokenizedMutualFundAddress,
    eventName: 'Unpaused',
  })
