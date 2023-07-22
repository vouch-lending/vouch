import { Popover, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Close from '../icons/close'
import Hamburger from '../icons/hamburger'
import Logo from '../icons/logo'
import WorldCoin from '../icons/worldcoin'
import { MetaMaskSDK } from '@metamask/sdk';
import { formatAddress } from '@/utils/format'
import Modal from '../common/Modal'
import RequestModal from './RequestModal'
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "../../pages/api/verify";
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SismoButton from './SismoButton'

const Header = () => {
  const [address, setAddress] = useState('')
  const [proof, setProof] = useState<ISuccessResult | undefined>()
  const [modal, setModal] = useState(false)

  const connect = async () => {
    const options = {
      injectProvider: true,
      dappMetadata: { name: "My Dapp", url: "https://mydapp.com" },
    }

    const MMSDK = new MetaMaskSDK(options)

    const ethereum = MMSDK.getProvider() // You can also access via window.ethereum

    const addr = await ethereum.request({ method: 'eth_requestAccounts', params: [] })

    if (addr && Array.isArray(addr) && addr.length > 0) {
      setAddress(addr[0])
      toast.success(
        <div>Wallet successfully connected!</div>
        , {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
    }
  }

  const disconnect = () => setAddress('')

  const openModal = () => setModal(true)
  const closeModal = () => setModal(false)

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    // window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
    setProof(result)
    toast.success('You have been verified successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      credential_type: result.credential_type,
      action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
      signal: "",
    };
    console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody)) // Log the proof being sent to our backend for visibility
    const res: Response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
    const data: VerifyReply = await res.json()
    if (res.status == 200) {
      console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
    } else {
      throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error."); // Throw an error if verification fails
    }
  };

  return (
    <header className="py-10">
      <Modal title={'Request Loan'} isOpen={modal} closeModal={closeModal}>
        <RequestModal />
      </ Modal>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-8">
            <Logo />
            <div className="hidden md:flex md:gap-x-6">
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/"
              >
                About
              </Link>
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                href="/loans"
              >
                Loans
              </Link>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                onClick={openModal}
              >
                Request Loan
              </a>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:flex items-center gap-4">
              <SismoButton />
              <span>|</span>
              {proof ? <button
                className="flex items-center gap-3 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 "
              >
                <WorldCoin />
                <span className='text-green-700'>Verified!</span>
              </button> : <IDKitWidget
                action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
                app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
                onSuccess={onSuccess}
                handleVerify={handleProof}
                credential_types={[CredentialType.Orb, CredentialType.Phone]}
                autoClose
              >
                {({ open }) =>
                  <button
                    className="flex items-center gap-3 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 "
                    onClick={open}
                  >
                    <WorldCoin />
                    Sign in
                  </button>
                }
              </IDKitWidget>}

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
                          <Link className="block w-full p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/about">
                            About
                          </Link>
                          <Link className="block w-full p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/dashboard">
                            Dashboard
                          </Link>
                          <Link className="block w-full p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900" href="/loans">
                            Loans
                          </Link>
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
