import { FC } from 'react'
import Link from 'next/link'

const About: FC = () => {
  return (
    <div className="h-screen-minus flex flex-col items-center justify-center gap-8 mx-16">
      <h1 className='font-black text-6xl text-center'>The future of lending is here with <span className='text-[#FF00FF] '>undercollateralised loans</span></h1>
      <p className='font-medium text-center text-gray-700'>Introducing Vouch, a new lending platform set to bring undercollateralised loans to millions around the world. We believe that trust is the cornerstone of any society, and with Vouch, we{"'"}re unlocking the power of social networks to provide undercollateralized loans to millions worldwide. Leverage your connections, reputation, and community support to gain quick and easy access to funds when you need them most, one Vouch loan at a time.</p>
      <div className='flex gap-4 items-center'>
        <Link
          className="group items-center justify-center rounded-full py-4 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900 cursor-pointer"
          href='/loans'
        >
          Check Open Loans
        </Link>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="group inline-flex ring-1 items-center justify-center rounded-full py-4 px-8 text-sm focus:outline-none ring-cerise-red-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300"><svg aria-hidden="true" className="h-3 w-3 flex-none fill-cerise-red-600 group-active:fill-current"><path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z"></path></svg><span className="ml-3">Watch video</span></a>
      </div>
    </div>
  )
}

export default About
