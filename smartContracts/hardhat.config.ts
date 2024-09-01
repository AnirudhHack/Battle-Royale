import dotenv from 'dotenv';
import '@nomiclabs/hardhat-ethers';

dotenv.config();


export default {
  solidity: {
    version: '0.8.16',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  networks: {
    base_sepolia: {
      url: 'https://sepolia.base.org',
      chainId: 84532,
      accounts: [process.env.PRIVATE_KEY],
    },
    arbitrum_sepolia: {
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      chainId: 421614,
      accounts: [process.env.PRIVATE_KEY],
    },
    // subnet: {
    //   url: process.env.NODE_URL,
    //   chainId: Number(process.env.CHAIN_ID),
    //   gasPrice: 'auto',
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
}
