export const pool = [
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "_paymentToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20Extended",
        "name": "_coverToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20Extended",
        "name": "_premToken",
        "type": "address"
      },
      {
        "internalType": "contract ISampleMapleLoanContract",
        "name": "_sampleMapleLoanContract",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_expiryTimestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "claimer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      }
    ],
    "name": "CoverageClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      }
    ],
    "name": "CoverageWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_premiumAmount",
        "type": "uint256"
      }
    ],
    "name": "PremiumWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_premiumAmount",
        "type": "uint256"
      }
    ],
    "name": "buyCoverage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "calculatePremium",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_coverTokenAmount",
        "type": "uint256"
      }
    ],
    "name": "claimCoverage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "coverToken",
    "outputs": [
      {
        "internalType": "contract IERC20Extended",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "coveragePool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "expirationTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMaxLoss",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paymentToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "premToken",
    "outputs": [
      {
        "internalType": "contract IERC20Extended",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "premiumPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sampleMapleLoanContract",
    "outputs": [
      {
        "internalType": "contract ISampleMapleLoanContract",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      }
    ],
    "name": "sellCoverage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "setIsExpiredTrue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "setIsExpiredTrueForTesting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      }
    ],
    "name": "withdrawCoverage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_premTokenAmount",
        "type": "uint256"
      }
    ],
    "name": "withdrawPremium",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_premTokenAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      }
    ],
    "name": "withdrawPremiumAndCoverage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]