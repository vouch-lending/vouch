import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import "hardhat-deploy";

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL || '',
        enabled: true,
      },
    },
    celo: {
      url: process.env.CELO_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY || ''],
    },
    alfajores: {
      url: process.env.ALFAJORES_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY || ''],
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