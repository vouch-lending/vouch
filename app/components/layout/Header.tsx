import { Popover, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Close from '../icons/close'
import Hamburger from '../icons/hamburger'
import Logo from '../icons/logo'
import WorldCoin from '../icons/worldcoin'
import { MetaMaskSDK } from '@metamask/sdk';
import { formatAddress } from '@/utils/format'

const Header = () => {
  const [address, setAddress] = useState('')

  const connect = async () => {
    const options = {
      injectProvider: true,
      dappMetadata: {name: "My Dapp", url: "https://mydapp.com"}	,
    }
    
    const MMSDK = new MetaMaskSDK(options)

    const ethereum = MMSDK.getProvider() // You can also access via window.ethereum

    const addr = await ethereum.request({ method: 'eth_requestAccounts', params: [] })

    if (addr && Array.isArray(addr) && addr.length > 0) setAddress(addr[0])
  }

  const disconnect = () => {
    setAddress('')
  }

  // https://www.deepshot.ai/?ref=producthunt
  return (
    <header className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-8">
            <Logo />
            <div className="hidden md:flex md:gap-x-6">
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/"
              >
                About
              </a>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/dashboard"
              >
                Dashboard
              </a>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/loans"
              >
                Loans
              </a>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <button
                className="flex items-center gap-3 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 "
              >
                <WorldCoin />
                Sign in
              </button>
            </div>
            <button
              className="hidden xs:inline-flex group items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2
                focus-visible:outline-offset-2 bg-black text-white hover:bg-cerise-red-700 hover:text-slate-100 active:bg-cerise-red-800 active:text-slate-300 focus-visible:outline-cerise-red-900"
              onClick={!address ? connect : disconnect}
            >
              {address ? <span>{formatAddress(address)}</span> : <span>
                Connect <span className="hidden lg:inline">Wallet</span>
              </span>}
            </button>
            <div className="-mr-1 md:hidden">
              <Popover className="">
                {({ open, close }) => (
                  <>
                    <Popover.Button
                      className={`${open ? '' : 'text-opacity-90'
                        } group inline-flex items-center rounded-md px-3 py-3 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      {!open ? <Hamburger /> : <Close />}
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-500"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="fixed inset-0 flex items-start justify-center py-24">
                        <div
                          className="absolute inset-0 bg-slate-300 bg-opacity-50"
                          onClick={close}
                        />
                        <div className="relative z-10 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5 opacity-100 scale-100 w-screen sm:mx-6 mx-4">
                          <a className="block w-full p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/about">
                            About
                          </a>
                          <a className="block w-full p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/dashboard">
                            Dashboard
                          </a>
                          <a className="block w-full p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/loans">
                            Loans
                          </a>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
