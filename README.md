# Tokenized Mutual Fund Application

A decentralized application (dApp) for managing a tokenized mutual fund on the Ethereum blockchain.

## Features

- Mint fund shares by sending ETH
- Redeem fund shares for ETH
- View current NAV (Net Asset Value) per share
- Admin functionality to update NAV (for contract owner only)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Web3 wallet
- Hardhat (for smart contract development)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd tokenized-mutual-fund-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_private_key
```

4. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

5. Update the contract address in `src/utils/config.js`

6. Start the development server:
```bash
npm start
```

## Usage

1. Connect your Web3 wallet (MetaMask recommended)
2. To mint shares:
   - Enter the amount of ETH you want to invest
   - Click "Mint Shares"
3. To redeem shares:
   - Enter the number of shares you want to redeem
   - Click "Redeem Shares"
4. To update NAV (admin only):
   - Enter the new NAV value in ETH
   - Click "Update NAV"

## Development

- Smart contracts are located in `src/contracts/`
- Frontend components are in `src/components/`
- Contract configuration is in `src/utils/config.js`

## Testing

Run the test suite:
```bash
npm test
```

## Security Considerations

- The contract uses OpenZeppelin's SafeMath for arithmetic operations
- Owner-only functions are protected by the Ownable modifier
- All user inputs are validated
- Contract balance checks are implemented for redemptions

## License

MIT 