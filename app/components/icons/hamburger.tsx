import { FC } from 'react'

const Hamburger: FC = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className="origin-center transition"
      ></path>
      <path
        d="M2 2L12 12M12 2L2 12"
        className="origin-center transition scale-90 opacity-0"
      ></path>
    </svg>
  )
}

export default Hamburger
