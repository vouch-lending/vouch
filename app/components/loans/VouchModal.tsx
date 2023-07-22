import { VOUCH_ADDRESS, VOUCH_ABI } from "@/constants";
import { Loans } from "@/types";
import MetaMaskSDK from "@metamask/sdk";
import { BrowserProvider, ethers } from "ethers";
import { FC, useState } from "react"

interface Props {
  loan: Loans
}

const VouchModal: FC<Props> = ({ loan }) => {
  const [inputAmount, setInputAmount] = useState("");

  const submit = async () => {
    const options = {
      injectProvider: true,
      dappMetadata: { name: "My Dapp", url: "https://mydapp.com" },
    }

    const MMSDK = new MetaMaskSDK(options)

    const ethereum = MMSDK.getProvider()

    await ethereum.request({ method: 'eth_requestAccounts', params: [] })

    const provider = new BrowserProvider(ethereum as any);

    const contractInstance = new ethers.Contract(VOUCH_ADDRESS, VOUCH_ABI, await provider.getSigner());

    const result = await contractInstance.vouch(loan.id, ethers.parseEther(inputAmount), { value: ethers.parseEther(inputAmount)});

    console.log(result.hash)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className='flex justify-evenly py-3'>
        <div className='flex flex-col items-center'>
          <h1 className='font-black text-lg'>{loan.meritScore}</h1>
          <p className='font-normal text-base'>Merit Score</p>
        </div>
        <div className='flex flex-col items-center'>
          <h1 className='font-black text-lg'>{loan.totalCommitted}/{loan.loanAmount} ΞTH</h1>
          <p className='font-normal text-base'>Total Vouched</p>
        </div>
      </div>
      <div className="relative h-10 w-full min-w-[200px]">
        <input
          className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-black focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          placeholder=" "
          onChange={(e) => setInputAmount(e.target.value)}
          value={inputAmount}
        />
        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-medium leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-black peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-black peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-black peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
        >
          Vouch Amount
        </label>
      </div>
      <button
        className="group items-center justify-center rounded-full py-3 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900" onClick={submit}
      >Submit</button>
    </div>
  )

}

export default VouchModal