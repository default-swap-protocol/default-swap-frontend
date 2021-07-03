export const sampleMapleLoanContract = [
  {
    "inputs": [],
    "name": "loanDefaulted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_hasDefaulted",
        "type": "bool"
      }
    ],
    "name": "setLoanState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]