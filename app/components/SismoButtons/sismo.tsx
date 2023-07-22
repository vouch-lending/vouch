import {
    SismoConnectButton, // the Sismo Connect React button displayed below
    SismoConnectConfig,
    AuthType, 
    ClaimType
  } from "@sismo-core/sismo-connect-react";
import {encodeAbiParameters} from "viem";
import { useEffect, useState } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { ethers } from "ethers";

  const Sismo = () => {
    const [address, setAddress] = useState('')

    const [responseBytes, setResponseBytes] = useState<string>("");
    const connect = async () => {
        const options = {
          injectProvider: true,
          dappMetadata: { name: "My Dapp", url: "https://mydapp.com" },
        }
    
        const MMSDK = new MetaMaskSDK(options)
    
        const ethereum = MMSDK.getProvider() // You can also access via window.ethereum
    
        const addr = await ethereum.request({ method: 'eth_requestAccounts', params: [] })
    
        if (addr && Array.isArray(addr) && addr.length > 0) setAddress(addr[0].replace('0x', ''))
      }
    const sismoConnectConfig: SismoConnectConfig = {
        appId: "0xca946189a01488876ae4b4649e26d249",
        vault: {
          // We will impersonate those Data Sources, which will be useful later
          impersonate: [
            // EVM Data Sources
            "dhadrien.sismo.eth",
            "leo21.sismo.eth",
            "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
            "0x1b9424ed517f7700e7368e34a9743295a225d889",
            "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
            "0xc281bd4db5bf94f02a8525dca954db3895685700",
            "vitalik.eth",
            // Github Data Source
            "github:dhadrien",
            // Twitter Data Source
            "twitter:dhadrien_",
            // Telegram Data Source
            "telegram:dhadrien",
          ],
        },
      };
      
    return (
        <SismoConnectButton
            // the Sismo Connect config created
            config={sismoConnectConfig}
            // the auth request we want to make
            // here we want to know the vaultId of our users for our application
            auths={[
                {authType: AuthType.EVM_ACCOUNT},
                {authType: AuthType.EVM_ACCOUNT,
                    userId: "0xa4c94a6091545e40fc9c3e0982aec8942e282f38",},
                { authType: AuthType.TWITTER, isOptional: true },
                { authType: AuthType.TELEGRAM, userId: "875608110", isOptional: true },
            ]}
            claims={[
                {
                    // claim ENS DAO Voters Data Group membership: https://factory.sismo.io/groups-explorer?search=0x85c7ee90829de70d0d51f52336ea4722
                    // Data Group members          = voters in ENS DAO
                    // value for each group member = number of votes in ENS DAO
                    // request user to prove membership in the group with value >= 17
                    groupId: "0x85c7ee90829de70d0d51f52336ea4722",
                    claimType: ClaimType.GTE,
                    value: 4, // impersonated dhadrien.sismo.eth has 17 votes, eligible
                },{
                    // claim Gitcoin Passport Holders Data Group membership: https://factory.sismo.io/groups-explorer?search=0x1cde61966decb8600dfd0749bd371f12
                    // Data Group members          = Gitcoin Passport Holders
                    // value for each group member = Gitcoin Passport Score
                    // request user to prove membership in the group with value > 15, user can reveal more if they want
                    groupId: "0x1cde61966decb8600dfd0749bd371f12",
                    claimType: ClaimType.GTE,
                    value: 15, // dhadrien.sismo.eth has a score of 46, eligible. Can reveal more.
                    isSelectableByUser: true, // can reveal more than 15 if they want
                },

            ]}
            // we ask the user to sign a message
            // it will be used onchain to prevent front running
            // onResponseBytes calls a 'setResponse' function 
            // with the responseBytes returned by the Sismo Vault
            onResponseBytes={(responseBytes: string) => {setResponseBytes(responseBytes)}}
            // Some text to display on the button
            text={"Sign in with Sismo"}
            />
    )
  }

export default Sismo