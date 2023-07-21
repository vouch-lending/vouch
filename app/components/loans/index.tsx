import { FC } from 'react'
import Card from '../common/Card'

const Loans: FC = () => {
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
      <Card />
    </div>
  )
}

export default Loans
