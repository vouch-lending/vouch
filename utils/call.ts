import { ethers } from 'ethers';
import artifact from '../artifacts/contracts/vouch.sol/Vouch.json'
import * as dotenv from 'dotenv'
dotenv.config()

const contractABI = artifact.abi; // Your contract's ABI
const contractAddress = '0xA29AAe7F645821d8A9939843824aBE4aBCf3b198'; // Your contract's address
const nodeRpcUrl = process.env.CELO_RPC_URL; // Your Ethereum node URL or Infura project ID

async function call() {
  const provider = new ethers.providers.JsonRpcProvider(nodeRpcUrl);
  const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

  try {
    const functionName = 'modMerit'; // Replace with the name of the function you want to call
    const functionArgs = ['0x6F04df36eA09e7c924116390f36DdFD915900894', 27]; // Replace with the actual arguments (if any) for your function

    // Optional: If you need to sign the transaction, provide a private key
    const privateKey = process.env.PRIVATE_KEY ?? ''; // Your private key
    const wallet = new ethers.Wallet(privateKey, provider);
    const signedContract = contract.connect(wallet);

    const result = await signedContract[functionName](...functionArgs);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error calling contract function:', error);
  }
}

call().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
