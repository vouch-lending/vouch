import { FC, useEffect, useState } from 'react'
import Card from '../common/Card'
import { BrowserProvider, ethers } from 'ethers';
import { VOUCH_ADDRESS, VOUCH_ABI } from '@/constants';
import { Loans } from '@/types';
import MetaMaskSDK from '@metamask/sdk';
import Modal from '../common/Modal';

const Loans: FC = () => {
  const [loanArray, setLoanArray] = useState<Loans[] | undefined>()
  const [modal, setModal] = useState(false)

  useEffect(() => {
    getLoans()
    // Run the code on the client side after the component mounts
    const interval = setInterval(() => {
      getLoans();
    }, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // The empty dependency array ensures that the effect runs only once on mount

  const openModal = () => setModal(true)
  const closeModal = () => setModal(false)

  const getLoans = async () => {
    const options = {
      injectProvider: true,
      dappMetadata: { name: "My Dapp", url: "https://mydapp.com" },
    }

    const MMSDK = new MetaMaskSDK(options)

    const ethereum = MMSDK.getProvider()

    await ethereum.request({ method: 'eth_requestAccounts', params: [] })

    const provider = new BrowserProvider(ethereum as any);

    const contractInstance = new ethers.Contract(VOUCH_ADDRESS, VOUCH_ABI, await provider.getSigner());

    let i = 0
    let allLoans: Loans[] = []
    while (true) {
      const loan = await contractInstance.loans(i);
      const loanStrings = await contractInstance.loanstrings(i);

      if (loan[0] == '0x0000000000000000000000000000000000000000' || !loanStrings[0]) {
        console.log(i)
        break
      }

      const meritScore = await contractInstance.meritScores(loan[0])

      allLoans.push({
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
      
      i++;
    }

    setLoanArray(allLoans)
    // console.log(loan, loanStrings)
  }

  return (
    <div className="h-screen-minus">
      
      {/* <div className='flex items-center justify-between gap-8'>
        <h1 className='text-l'>Active Loans</h1>
        <button
          className="hidden xs:inline-flex group items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900"
        >
          Request Loan
        </button>
      </div> */}
      {loanArray && <Card loanArray={loanArray} />}
    </div>
  )
}

export default Loans
