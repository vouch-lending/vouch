import { ethers } from "hardhat";

async function main() {
    const Vouch = await ethers.getContractFactory("Vouch");
    const vouch = await Vouch.deploy();

    await vouch.deployed();

    console.log("Vouch contract deployed to:", vouch.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });