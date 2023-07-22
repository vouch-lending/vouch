export type Loans = {
    id: number,
    borrower: string,
    twitter: string,
    telegram: string,
    apr: string,
    term: string,
    meritScore: string,
    loanAmount: string,
    totalCommitted: string,
    description: string,
}

export type LoansExtended = {
    id: number,
    borrower: string,
    twitter: string,
    telegram: string,
    apr: string,
    term: string,
    meritScore: string,
    loanAmount: string,
    totalCommitted: string,
    description: string,
    repaymentTime: string,
    repaymentAmount: string,
    isLoanApproved: boolean,
    isLoanRepaid: boolean,
}