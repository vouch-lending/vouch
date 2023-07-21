import { ethers } from "hardhat";

async function main() {
    const Vouch = await ethers.getContractFactory("Vouch");
    const vouch = await Vouch.deploy();

    await vouch.waitForDeployment();

    console.log("Vouch contract deployed to:", vouch.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });