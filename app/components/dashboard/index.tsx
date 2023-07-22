import { VOUCH_ADDRESS, VOUCH_ABI } from '@/constants';
import { Loans } from '@/types';
import MetaMaskSDK from '@metamask/sdk';
import { BrowserProvider, ethers } from 'ethers';
import { FC, useEffect, useState } from 'react'
import UserLoans from './UserLoans';
import UserVouches from './UserVouches';

const Dashboard: FC = () => {
  const [vouchedList, setVouchedList] = useState<Loans[] | undefined>()
  const [loansList, setLoansList] = useState<Loans[] | undefined>()
  const [meritScore, setMeritScore] = useState<number>(0)

  useEffect(() => {
    getLoans()
    // Run the code on the client side after the component mounts
    const interval = setInterval(() => {
      getLoans();
    }, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // The empty dependency array ensures that the effect runs only once on mount

  const getLoans = async () => {
    const options = {
      injectProvider: true,
      dappMetadata: { name: "My Dapp", url: "https://mydapp.com" },
    }

    const MMSDK = new MetaMaskSDK(options)

    const ethereum = MMSDK.getProvider()

    const address: string[] = await ethereum.request({ method: 'eth_requestAccounts', params: [] }) as string[]

    const provider = new BrowserProvider(ethereum as any);

    const contractInstance = new ethers.Contract(VOUCH_ADDRESS, VOUCH_ABI, await provider.getSigner());

    let i = 0
    let userLoans: Loans[] = []
    while (true) {
      const loan = await contractInstance.loans(i);
      const loanStrings = await contractInstance.loanstrings(i);

      if (loan[0] == '0x0000000000000000000000000000000000000000' || !loanStrings[0]) {
        break
      }

      
      if (address[0].toLowerCase() === loanStrings[0].toLowerCase()) {
        const meritScore = await contractInstance.meritScores(address[0])
        setMeritScore(meritScore)

        userLoans.push({
          id: i,
          borrower: loanStrings[0],
          twitter: loanStrings[1],
          telegram: loanStrings[2],
          apr: loan[5].toString(),
          term: loan[4].toString(),
          meritScore: meritScore.toString(),
          loanAmount: ethers.formatEther(loan[1].toString()),
          totalCommitted: ethers.formatEther(loan[2].toString()),
          description: loanStrings[3],
        })
      }

      i++;
    }

    if (userLoans.length > 0) setLoansList(userLoans)

    const vouched = await contractInstance.getVouchedLoans(address[0])
    if (vouched.length > 0) setVouchedList(vouched)
  }

  return (
    <div className="h-screen-minus flex flex-col gap-4">
      <h3 className='font-medium'>Your Merit Score: <span className='font-black'>{meritScore.toString()}</span></h3>
      {loansList && <UserLoans loanArray={loansList } />}
      {vouchedList !== undefined && <UserVouches />}
    </div>
  )
}

export default Dashboard
