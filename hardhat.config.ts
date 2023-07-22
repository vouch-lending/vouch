import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import "hardhat-deploy";

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  optimizer: { 
    enabled: true,
    runs: 50
   },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL || '',
        enabled: true,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || '',
  },
}

export default config