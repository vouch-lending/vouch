// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the SafeMath library
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vouch {
    using SafeMath for uint256; // Apply SafeMath to all uint256 types

    struct Loan {
        address borrower;
        mapping(address => uint256) vouchedAmounts; // Track the vouch amount for each lender
        mapping(address => uint256) repaymentShares; // Track the repayment share for each lender
        uint256 loanAmount;
        uint256 totalCommitted;
        uint256 lockedCollateral;
        uint256 loanDuration;
        uint256 interestRate;
        uint256 creationTime;
        uint256 repaymentTime;
        uint256 repaymentAmount;
        bool isLoanApproved;
        bool isLoanRepaid;
    }

    struct LoanStrings {
        address borrower;
        string twitter;
        string telegram;
        string desc;
    }

    mapping(uint256 => Loan) public loans;
    mapping(uint256 => LoanStrings) public loanstrings;
    uint256 public loanCount;

    mapping(address => uint256) public meritScores;

    mapping(address => uint256) public depositedCollateral;
    mapping(address => uint256) public loanIdOfBorrower;
    mapping(address => bool) public loanRequestCancelled;

    // Event to notify when a loan request is cancelled
    event LoanRequestCancelled(address indexed borrower, uint256 loanId);

    // Event to notify when a loan is approved
    event LoanApproved(uint256 indexed loanId);

    // Event to notify that the loan has been repaid
    event LoanRepaid(uint256 indexed loanId, uint256 amount);

    // Function to transfer collateral to the protocol
    function transferCollateral() external payable {
        // Ensure the sender has not already deposited collateral for an existing loan
        require(depositedCollateral[msg.sender] == 0, "Collateral already deposited");

        // Ensure the transferred collateral is not zero
        require(msg.value > 0, "Collateral amount should be greater than 0");

        // Update the depositedCollateral mapping for the sender
        depositedCollateral[msg.sender] = msg.value;
    }

    // Function to request a new loan (payable)
    function requestLoan(uint256 _loanAmount, uint256 _loanDuration, string calldata _twitter, string calldata _desc, string calldata _telegram) external payable {
        require(_loanAmount > 0, "Loan amount must be greater than 0");
        require(_loanAmount.div(2) == msg.value, "Loan amount and amount sent do not match"); 
        require(_loanDuration == 7 || _loanDuration == 30 || _loanDuration == 90, "Invalid loan duration");

        // Ensure the requested loan amount does not exceed 2 times the deposited collateral
        // uint256 maxLoanAmount = depositedCollateral[msg.sender].mul(2);
        // require(_loanAmount <= maxLoanAmount, "Loan amount exceeds collateral");

        // Lock up 50% of the requested loan amount as collateral
        uint256 lockedCollateral = _loanAmount.div(2);

        // Create the loan object
        Loan storage newLoan = loans[loanCount];
        newLoan.borrower = msg.sender;
        newLoan.loanAmount = _loanAmount;
        newLoan.totalCommitted = 0;
        newLoan.lockedCollateral = lockedCollateral;
        newLoan.loanDuration = _loanDuration;
        newLoan.interestRate = 5;
        newLoan.creationTime = block.timestamp;
        newLoan.repaymentTime = 0;
        newLoan.repaymentAmount = 0;
        newLoan.isLoanApproved = false;
        newLoan.isLoanRepaid = false;

        LoanStrings storage newLoanString = loanstrings[loanCount];
        newLoanString.borrower = msg.sender;
        newLoanString.desc = _desc;
        newLoanString.telegram = _telegram;
        newLoanString.twitter = _twitter;

        // Set the loanIdOfBorrower mapping to store the loan ID for the borrower
        loanIdOfBorrower[msg.sender] = loanCount;
        loanCount++;
    }

    // Function to cancel a loan request before approval
    function cancelLoanRequest() external {
        uint256 loanId = loanIdOfBorrower[msg.sender];
        require(loanId < loanCount, "No loan request found");

        Loan storage loan = loans[loanId];
        require(!loan.isLoanApproved, "Loan already approved");
        require(!loanRequestCancelled[msg.sender], "Loan request is already cancelled");

        // Mark the loan request as cancelled
        loanRequestCancelled[msg.sender] = true;

        // Emit an event to notify about the loan cancellation
        emit LoanRequestCancelled(msg.sender, loanId);
    }


    // Function for a lender to vouch for a borrower with a specific amount
    function vouch(uint256 _loanId, uint256 _amount) external payable {
        require(_loanId < loanCount, "Invalid loan ID");
        require(_amount > 0, "Vouched amount must be greater than 0");
        require(_amount == msg.value, "Amount sent doesn't match amount inputted");

        Loan storage loan = loans[_loanId];
        // require(loan.isLoanApproved, "Loan is not approved");
        require(!loan.isLoanApproved, "Loan is already repaid");

        // Transfer the vouched amount to the contract
        // require(msg.sender != loan.borrower, "Borrower cannot vouch for their own loan");
        require(loan.vouchedAmounts[msg.sender] == 0, "You have already vouched for this loan");

        // Update the loan amount with the vouched amount
        loan.totalCommitted = loan.totalCommitted.add(_amount);

        // Add the vouched amount for the lender
        loan.vouchedAmounts[msg.sender] = _amount;

        // TODO: check if total commited == loanAmount, if so, approve loan
        if (loan.totalCommitted == loan.loanAmount) {
            approveLoan(_loanId);
        }
    }

    // Function to approve a loan after successful vouches
    function approveLoan(uint256 _loanId) internal {
        require(_loanId < loanCount, "Invalid loan ID");
        Loan storage loan = loans[_loanId];
        require(!loan.isLoanApproved, "Loan is already approved");

        // Perform any logic to check if the loan is approved (e.g., based on vouches)
        loan.repaymentTime = block.timestamp + (loan.loanDuration * 1 days);
        loan.repaymentAmount = loan.loanAmount.add(loan.loanAmount.mul(loan.interestRate).div(100));

        loan.isLoanApproved = true;

        address payable receiver = payable(loan.borrower);
        receiver.transfer(loan.loanAmount);

        // Emit an event to notify about the loan approval
        emit LoanApproved(_loanId);
    }

    // Function to repay a loan
    function repayLoan(uint256 _loanId) external payable {
        require(_loanId < loanCount, "Invalid loan ID");

        Loan storage loan = loans[_loanId];
        require(loan.isLoanApproved, "Loan is not approved");
        require(!loan.isLoanRepaid, "Loan is already repaid");
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan");

        // Calculate the amount to be repaid, including accrued interest based on the APR
        uint256 repaymentAmount = loan.loanAmount.add(loan.loanAmount.mul(loan.interestRate).div(100));

        require(msg.value >= repaymentAmount, "Insufficient repayment amount");

        // Update loan status
        loan.isLoanRepaid = true;
        loan.repaymentTime = block.timestamp;
        loan.repaymentAmount = msg.value;

        // Emit an event to notify about the loan repayment
        emit LoanRepaid(_loanId, msg.value);
    }

    // Function to withdraw collateral after loan repayment
    function withdrawCollateral(uint256 _loanId) external {
        require(_loanId < loanCount, "Invalid loan ID");
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.borrower, "Only the borrower can withdraw collateral");
        require(loan.isLoanApproved && loan.isLoanRepaid, "Loan must be approved and repaid");

        // Withdraw the deposited collateral
        uint256 lockedCollateral = loan.loanAmount.div(2);
        depositedCollateral[msg.sender] = depositedCollateral[msg.sender].sub(lockedCollateral);
        payable(msg.sender).transfer(lockedCollateral);
    }

    // Function to get the borrower's merit score
    function getMeritScore(address _borrower) external view returns (uint256) {
        return meritScores[_borrower];
    }

    // Function to modify a borrower's merit score
    function modMerit(address _borrower, uint256 _modifier) external {
        require(_modifier != 0, "Modifier cannot be zero");
        meritScores[_borrower] = uint256(uint256(meritScores[_borrower]).add(_modifier));
    }
}
