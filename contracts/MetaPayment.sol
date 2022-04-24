// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


// 
/*  Inside the monthly payement we include the percentage!!
    Cancel loan payment mecanism

    Verify if bytes dara is that important
    cancel problem accured because of the 0 or 1 index!!
    take a look at oracle
    TODOS:
    add managers and owner
    return loan for each borrower.
    keep track of all the on going loans
    // canceled formulate + pay formulate
    
*/ 


contract MetaPayment  {

    // The number of plan created
    uint256 public totalPlans;
    uint256 public totalLoans;
    uint256 public totalCanceledLoans;
    
    address[] public owners;
    mapping(address => bool) public isOwner;

    // event 
    event PlanCreated(address indexed creator,
                      uint256 indexed upfrontPayment,
                      uint256 indexed planIndex,
                      uint256 monthlyPayment);

    event LoanRequestCreated(address indexed borrower,
                             uint256 indexed start,
                             uint256 indexed nextPayment);

    event PaymentSent(address indexed from,
                      address indexed to,
                      uint256 indexed payment,
                      uint256 planId,
                      uint256 date);

    event LoanCreated(address indexed borrower,
                              uint256 indexed planId,
                              uint256 indexed date,
                              bool status);
    
    event LoanCanceled(address indexed borrower,
                        uint indexed planId,
                        bool status,
                        uint indexed date);


    // Plan loan 
    struct Plan {
        uint256 upfrontPayment;
        uint256 monthlyPayment;
    }

    mapping(uint => Plan) private idToPlan;

    // Subscription if the user pay we turn the excuted to true
    struct LoanRequest {
        address payable borrower;
        uint start;
        uint nextPayment;
        bool activated;
    }

    struct RemovedLoan {
        address payable borrower;
        bool activated;
        uint canceledTime;
    }

    mapping(uint => RemovedLoan) public idToRemovedLoan;
    
    // nested mapping from address to id to Subcription
    mapping(address => mapping(uint => LoanRequest)) private activeLoans;

    // only get loan once
    mapping(address => bool) public engaged;


    constructor(address[] memory _owners) {
        require(_owners.length > 0, "Owners required");
        for(uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Address not valid");
            require(!isOwner[msg.sender], "onwer not unique");
            isOwner[msg.sender] = true;
            owners.push(owner);
        }
    }


    // modifiers
    modifier onlyOwners() {
        require(isOwner[msg.sender], "Access only for owners");
        _;
    }

    // modifier PlanExists(uint planId) {
    //     require(planId < plans.length, "Plan does not exist");
    //     _;
    // }

    modifier alreadyEngaged() {
        require(!engaged[msg.sender], "You already have Loan");
        _;
    }

    modifier LoanExists(uint planId) {
        require(activeLoans[msg.sender][planId].borrower != address(0), "Loan does not exist");
        _;
    }

    modifier onlyUsers() {
        require(tx.origin == msg.sender, " MetaLoan :: Connot be called by contract");
        _;
    }

    modifier noLoanExist(uint planId) {
        require(activeLoans[msg.sender][planId].activated, "MetaLoan :: your loan has been canceled");
        _;
    }

    
    // function to create a plan 
    function createPlan(uint256 _upfrontPayment,
                        uint256 _monthlyPayment) external onlyOwners  {

    idToPlan[totalPlans] = Plan (
        _upfrontPayment,
        _monthlyPayment
    );

    
    emit PlanCreated(msg.sender, totalPlans, _upfrontPayment,_monthlyPayment); 
      totalPlans++;
    }


    // subscription for Loan + pay
    function getLoan(uint planId) external
    payable
    alreadyEngaged()
    onlyUsers()
    {   
        // create a pointer 
        Plan storage plan = idToPlan[planId];
        require(msg.value >= plan.upfrontPayment, "Please send the correct upfront payment");

        emit PaymentSent(
            payable(msg.sender),
            payable(address(this)),
            plan.upfrontPayment,
            planId,
            block.timestamp);
        
        engaged[msg.sender] = true;

        // subscriptions that takes the address owner to subscribe into a specific plan
        activeLoans[msg.sender][planId] = LoanRequest(
            payable(msg.sender),
            block.timestamp,
            block.timestamp + 4 weeks,
            true
        );

        emit LoanCreated(msg.sender, planId, block.timestamp, true);
        totalLoans++;
    }


    function pay(uint256 planId) 
        external payable
        onlyUsers()
        LoanExists(planId)
        {
        LoanRequest storage loanRequest = activeLoans[msg.sender][planId];

        require(block.timestamp > loanRequest.nextPayment, "Payement not due yet");
        Plan storage plan = idToPlan[planId];

        require(msg.value >= plan.monthlyPayment, "monthly payment not correct");

        emit PaymentSent(
            payable(msg.sender),
            payable(address(this)),
            plan.monthlyPayment,
            planId,
            block.timestamp);

        loanRequest.nextPayment = loanRequest.nextPayment + 4 weeks;

    }

    // get contract balance
    function getBalance () external view returns (uint256) {
        return address(this).balance;
    }

    // withraw money from the contract to the lender
    function withdraw (uint256 _amount) payable external
    onlyOwners() 
    onlyUsers() {
        require(_amount > 0, "_amount connot be 0");
        payable(msg.sender).transfer(_amount);
    }

    // receive eth in the contract
    receive() external payable {}

    function cancelLoan(uint256 planId)
     external 
     payable
     onlyUsers()
     noLoanExist(planId)
     
    {

    LoanRequest storage loanRequest = activeLoans[msg.sender][planId];
    require(loanRequest.borrower != address(0), "this loan doesn't exist");
  
    idToRemovedLoan[planId] = RemovedLoan(
        payable(msg.sender),
        false,
        block.timestamp);

        engaged[msg.sender] = false;
        delete activeLoans[msg.sender][planId];
        totalCanceledLoans++;
        emit LoanCanceled(msg.sender, planId, false,block.timestamp);
    }


    // return the plan
    function fetchPlan(uint256 _planId) 
    external view returns(
        uint256 upfrontPayment,
        uint256 monthlyPayment
    ) 
    
    {

    Plan storage plan = idToPlan[_planId];

    return (
        plan.upfrontPayment,
        plan.monthlyPayment
        );
    }

    // getLoan function 
    function fetchMyLoan(uint256 planId) external view returns(
            address borrower,
            uint start,
            uint nextPayment,
            bool activated
    ) {

           LoanRequest storage loanRequest = activeLoans[msg.sender][planId];

           return (
            loanRequest.borrower,
            loanRequest.start,
            loanRequest.nextPayment,
            loanRequest.activated
           );
    }





    // function fetchCancelLoans() public view returns(RemovedLoan[] memory) {

    //         // create count items;
    //         uint256 itemCount = 0;
    //         uint256 currentIndex = 0;


    //         for(uint256 i =0; i < totalCanceledLoans; i++) {
    //             itemCount +=1;
    //         }

    //         RemovedLoan[] memory items = new RemovedLoan[](itemCount);

    //         for(uint256 i = 0; i < totalCanceledLoans; i++) {
    //             uint256 currentId = i;
    //             RemovedLoan storage currentItem = idToRemovedLoan[currentId];
    //             items[currentIndex] = currentItem;
    //             currentIndex += 1;
    //         }
    //         return items;
    // }



}

/*

struct RemovedLoan {
        address payable borrower;
        bool activated;
        uint canceledTime;
    }

    mapping(uint => RemovedLoan) public idToRemovedLoan;

*/
// ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]
// 100000000000000000
/*
0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
1000000000000000000
1000000000000000
*/