# MetaLoan: Own Your Piece of the Metaverse

Break down the cost of your metaversal assets into small, affordable payments with MetaLoan's DApp on the Polygon blockchain. This project enables users to secure their stake in the expanding universe of digital experiences by facilitating manageable financial transactions.

<a href="https://ibb.co/wwNyV0n"><img src="https://i.ibb.co/xfShWCn/metaloa.png" alt="metaloa" border="0"></a>


## Technologies

- **Front-end**: ReactJS
- **Smart Contract Language**: Solidity
- **Blockchain**: Polygon Mainnet
- **Testing**: Foundry

## Smart Contract Overview

The `MetaLoan` contract is designed to create and manage loan plans. It allows managers to create loan plans, users to apply for and pay loans, and also provides other functionalities such as the ability to delete a loan plan, withdraw tokens, and more.

## MetaLoan Contract Functions

### Modifiers
- `onlyOwner`
- `onlyManager`
- `PlanExists`
- `NotZeroAddress`
- `NotZeroValue`

### State-changing Functions
- `constructor`
- `createPlan`
- `requestLoan`
- `payLoan`
- `deletePlan`
- `withdrawTokens`
- `addManager`

### View Functions
- `fetchMyLoan`
- `fetchPlan`
- `fetchAllBorrowers`
- `fetchallPlans`

### Events
- `PlanCreated`
- `PaymentSent`
- `LoanCreated`
- `LoanDeleted`
- `PlanDeleted`
- `TransferOfTokens`

### Contract Address

[View Metaloan Smart Contract on Polygon Mainnet](https://polygonscan.com/address/0xA3b2C7cE6f2788148EBfc65BeB4Cb04cb3BDe46E)

## Local Setup

1. **Clone the Repository**:
```
git clone <repository-url>
```

3. **Install Dependencies**:
```
npm install
```

5. **Start the DApp**:
```
npm start
```

## Foundry Test
Follow the [instructions](https://book.getfoundry.sh/getting-started/installation.html) to install [Foundry](https://github.com/foundry-rs/foundry).

Clone and install dependencies:git submodule update --init --recursive  
Test Contract: ```forge test --contracts ./src/test/Metaloan.t.sol -vvvv```

Visit `http://localhost:3000/` to interact with the decentralized application. 
