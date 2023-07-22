import { FC } from "react"
import Blockies from 'react-blockies';
import Telegram from "../icons/socials/telegram";
import Twitter from "../icons/socials/twitter";
import { Loans } from "@/types";
import { formatAddress } from "@/utils/format";

interface Props {
  vouchArray: Loans[]
}

const UserVouches: FC<Props> = ({ vouchArray }) => {
  const openURLInNewTab = (url: string) =>
    window.open(url, '_blank');

  return (
    <div className='grid grid-flow-col grid-cols-3'>
      {vouchArray.map((loan) => {
        return (
          <div className="flex flex-col w-80 p-3 outline rounded-xl h-auto" key={loan.id}>
            {/* header */}
            <div className='flex items-center gap-4 w-full'>
              {/* icon */}

              <div className='bg-black'>

                <Blockies
                  seed={loan.borrower}
                  size={16}
                  scale={3}
                  color="#000"
                  bgColor="#ffe"
                  spotColor="#000"
                  className="identicon"
                />
              </div>

              {/* second section */}
              <div className='flex flex-col gap-2 w-full'>
                {/* top */}
                <div className='flex items-center justify-between'>
                  <p>{formatAddress(loan.borrower)}</p>
                  <div className='flex items-center gap-2'>
                    {/* <div className='bg-[#E0E0E0] p-1 rounded-full cursor-pointer' onClick={openURLInNewTab(loan.)}>
                        <Discord />
                      </div> */}
                    <div className='bg-[#E0E0E0] p-1 rounded-full cursor-pointer' onClick={() => openURLInNewTab(loan.telegram)}>
                      <Telegram />
                    </div>
                    <div className='bg-[#E0E0E0] p-1 rounded-full cursor-pointer' onClick={() => openURLInNewTab(loan.twitter)}>
                      <Twitter />
                    </div>
                  </div>
                </div>
                {/* bottom */}
                <div className='flex justify-between w-full'>
                  <div className='flex items-center bg-[#E0E0E0] text-black px-4 rounded-full font-normal text-sm'>
                    {loan.apr}%
                  </div>
                  <div className='flex items-center bg-[#E0E0E0] text-black px-4 rounded-full font-normal text-sm'>
                    {loan.term}d Term
                  </div>
                  <div className='flex items-center bg-[#E0E0E0] text-black px-4 rounded-full font-normal text-sm'>
                    2d left
                  </div>
                </div>
              </div>
            </div>
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
            <p className='text-[#334155] text-xs font-normal pb-4'>{loan.description}</p>
            <button className="group items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                  focus-visible:outline-offset-2 bg-red-700 text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900"
            >
              Cancel Vouch
            </button>
          </div>
        )
      })}
    </ div>
  )
}

export default UserVouches