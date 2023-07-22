import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from 'hardhat'

describe("Vouch", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Vouch = await ethers.getContractFactory("Vouch");
    const contract = await Vouch.deploy();

    return { contract, owner, otherAccount };
  }

  describe("Request a Loan", function () {
    it("Should request a loan and take my ETH", async function () {
      const { contract } = await loadFixture(deployContract);

      const loanAmount = ethers.utils.parseEther('10')
      const loanDuration = 30
      const twitter = 'https://twitter.com'
      const desc = 'This is a test'
      const telegram = 'https://telegram.com'
      await contract.requestLoan(loanAmount, loanDuration, twitter, desc, telegram, {value: loanAmount.div(2) })

      const loan = await contract.loans(0)
      console.log(loan)
    });

  });

  describe("Vouch for a loan", function () {
    it("Should request a loan and update the correct states", async function () {
      const { contract, otherAccount } = await loadFixture(deployContract);

      const loanAmount = ethers.utils.parseEther('10')
      const loanDuration = 30
      const twitter = 'https://twitter.com'
      const desc = 'This is a test'
      const telegram = 'https://telegram.com'
      await contract.requestLoan(loanAmount, loanDuration, twitter, desc, telegram, { value: loanAmount.div(2) })

      await contract.vouch(0, loanAmount.div(5), { value: loanAmount.div(5) })

      const loan = await contract.loans(0)
      const loanStrings = await contract.loanstrings(0)
      console.log(loan)
      console.log(loanStrings)
    });

  });

  describe("Vouch for a loan and check your vouched list", function () {
    it("Should request a loan, vouch for it and ", async function () {
      const { contract, owner } = await loadFixture(deployContract);

      const loanAmount = ethers.utils.parseEther('10')
      const loanDuration = 30
      const twitter = 'https://twitter.com'
      const desc = 'This is a test'
      const telegram = 'https://telegram.com'
      await contract.requestLoan(loanAmount, loanDuration, twitter, desc, telegram, { value: loanAmount.div(2) })

      await contract.vouch(0, loanAmount.div(5), { value: loanAmount.div(5) })

      const loan = await contract.loans(0)
      const vouched = await contract.getVouchedLoans(owner.address)
      console.log(loan)
      console.log(vouched)
    });

  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

    // describe("Events", function () {
    //   it("Should emit an event on withdrawals", async function () {
    //     const { lock, unlockTime, lockedAmount } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     await time.increaseTo(unlockTime);

    //     await expect(lock.withdraw())
    //       .to.emit(lock, "Withdrawal")
    //       .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //   });
    // });

    // describe("Transfers", function () {
    //   it("Should transfer the funds to the owner", async function () {
    //     const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //       deployOneYearLockFixture
    //     );

    //     await time.increaseTo(unlockTime);

    //     await expect(lock.withdraw()).to.changeEtherBalances(
    //       [owner, lock],
    //       [lockedAmount, -lockedAmount]
    //     );
    //   });
    // });
  // });
});
