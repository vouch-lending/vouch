import { FC } from 'react'
import Discord from '../icons/socials/discord'
import Telegram from '../icons/socials/telegram'
import Twitter from '../icons/socials/twitter'
import Blockies from 'react-blockies';

const Card: FC = () => {
  return (
    <div className="flex flex-col w-80 p-3 outline rounded-xl h-auto">
      {/* header */}
      <div className='flex items-center gap-4 w-full'>
        {/* icon */}

        <div className='bg-black'>

          <Blockies
            seed="0x8239123012347123o1239497914781"
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
            <p>0x3782...28E1</p>
            <div className='flex items-center gap-2'>
              <div className='bg-[#E0E0E0] p-1 rounded-full cursor-pointer'>
                <Discord />
              </div>
              <div className='bg-[#E0E0E0] p-1 rounded-full cursor-pointer'>
                <Telegram />              
              </div>
              <div className='bg-[#E0E0E0] p-1 rounded-full cursor-pointer'>
                <Twitter />              
              </div>
            </div>
          </div>
          {/* bottom */}
          <div className='flex justify-between w-full'>
            <div className='flex items-center bg-[#E0E0E0] text-black px-4 rounded-full font-normal text-sm'>
              3.14%
            </div>
            <div className='flex items-center bg-[#E0E0E0] text-black px-4 rounded-full font-normal text-sm'>
              7d Term
            </div>
            <div className='flex items-center bg-[#E0E0E0] text-black px-4 rounded-full font-normal text-sm'>
              2d left
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-evenly py-3'>
        <div className='flex flex-col items-center'>
          <h1 className='font-black text-lg'>243</h1>
          <p className='font-normal text-base'>Merit Score</p>
        </div>
        <div className='flex flex-col items-center'>
          <h1 className='font-black text-lg'>9 ΞTH</h1>
          <p className='font-normal text-base'>Loan Amount</p>
        </div>
      </div>
      <p className='text-[#334155] text-xs font-normal pb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
      <button className="group items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900"
      >
        Vouch
      </button>
    </div>
  )
}

export default Card
