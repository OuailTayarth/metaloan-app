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
    
*/ 


contract MetaPayment  {

    // The number of plan created
    uint256 public planCount;
    uint256 public totalLoans;
    
    address[] public owners;
    mapping(address => bool) public isOwner;

    // event 
    event PlanCreated(address indexed creator,
                      uint256 indexed upfrontPayment,
                      uint256 indexed planIndex,
                      uint256 monthlyPayment,
                      uint256 loanDuration);

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
                        uint indexed date,
                        bool status);


    // Plan loan 
    struct Plan {
        address payable lender;
        uint256 upfrontPayment;
        uint256 monthlyPayment;
        uint256 loanDuration;
        uint256 interestRate;
    }

    mapping(uint => Plan) private idToPlan;

    // Subscription if the user pay we turn the excuted to true
    struct LoanRequest {
        address payable borrower;
        uint start;
        uint nextPayment;
        bool activated;
    }
    
    // nested mapping from address to id to Subcription
    mapping(address => mapping(uint => LoanRequest)) private onGoingLoans;

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

    modifier AlreadyEngaged() {
        require(!engaged[msg.sender], "You already have Loan");
        _;
    }

    modifier LoanExists(uint planId) {
        require(onGoingLoans[msg.sender][planId].borrower != address(0), "Loan does not exist");
        _;
    }

    modifier onlyUsers() {
        require(tx.origin == msg.sender, " MetaLoan :: Connot be called by contract");
        _;
    }

    modifier onlyContract(uint planId) {
        require(onGoingLoans[msg.sender][planId].activated, "MetaLoan :: your loan has been canceled");
        _;
    }

    
    // function to create a plan 
    function createPlan(uint256 _upfrontPayment,
                        uint256 _loanDuration,
                        uint256 _interestRate,
                        uint256 _monthlyPayment) external onlyOwners  {

    idToPlan[planCount] = Plan (
        payable(msg.sender),
        _upfrontPayment,
        _loanDuration,
        _interestRate,
        _monthlyPayment
    );

    
    emit PlanCreated(msg.sender, planCount, _upfrontPayment,_loanDuration, _monthlyPayment); 
      planCount++;
    }


    // subscription for Loan + pay
    function getLoan(uint planId) external
    payable
    AlreadyEngaged()
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
        onGoingLoans[msg.sender][planId] = LoanRequest(
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
        {
        LoanRequest storage loanRequest = onGoingLoans[msg.sender][planId];

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
     onlyContract(planId)
     
    {   
        onGoingLoans[msg.sender][planId] = LoanRequest(
            payable(address(this)),
            block.timestamp,
            block.timestamp,
            false
        );

        emit LoanCanceled(address(this), planId, block.timestamp, false);
    }


    // return the plan
    function getPlan(uint256 _planId) 
    external view returns(
        address lender,
        uint256 upfrontPayment,
        uint256 monthlyPayment,
        uint256 loanDuration,
        uint256 interestRate
    ) 
    
    {

    Plan storage plan = idToPlan[_planId];

    return (
        plan.lender,
        plan.upfrontPayment,
        plan.monthlyPayment,
        plan.loanDuration,
        interestRate
        );
    }


    // get all Plans
    function getAllPlans() public view returns(Plan[] memory) {
        // to define the lengh 
        uint itemCount = 0;
        // to store the struct Plan inside the struct array Plan[]
        uint currentIndex = 0;

        // count the itemCount
        for(uint i =0; i < planCount; i++) {
            itemCount = itemCount + 1;
        }

        // create a new array type struct with a length of itemCount
        Plan[] memory items = new Plan[](itemCount);

        for(uint i = 0; i < planCount; i++) {
        uint currentId = 1 + i;
        // get a struct that has currentId
        Plan storage currentItem = idToPlan[currentId];
        // storage Plan in the Plan[] struct
        items[currentIndex] = currentItem;
        currentIndex += 1;
        
        } 
        return items;
    }


    // Get All on going Loans
    function getAllLoans() public view returns (LoanRequest[] memory) {

        // to get the length
        uint itemCount = 0;
        // currentIndex to store the array inside the struct array;
        uint currentIndex = 0;

        for(uint i = 0; i < totalLoans; i++) {
            itemCount += 1;
        }

        // create a new array from LoanRequest array
        LoanRequest[] memory items = new LoanRequest[](itemCount);

        for(uint i = 0; i < totalLoans; i++) {
            uint currentId = i + 1;
            // pointer 
            LoanRequest storage currentItem = onGoingLoans[msg.sender][currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return items;
    }


    // return the ongoing loans list
    function fetchMyLoan() external view returns(LoanRequest[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i = 0; i <totalLoans; i++) {
            itemCount += 1;
        }

        LoanRequest[] memory items = new LoanRequest[](itemCount);
        for(uint i = 0; i < totalLoans; i++) {
            if(onGoingLoans[msg.sender][i + 1].borrower == msg.sender) {
                uint256 currentId = i + 1;
                LoanRequest memory currentItem = onGoingLoans[msg.sender][currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
            return items;
    } 

}
