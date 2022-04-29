// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;



contract MetaPayment  {

    /*Events*/ 
    event PlanCreated(address indexed creator,
                      uint256 indexed upfrontPayment,
                      uint256 indexed planIndex,
                      uint256 monthlyPayment);

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
                        uint indexed date);


    uint256 public totalPlans;
    uint256 public totalLoans;
    bool public cancelLoanTime;
    address public owner;
    address[] public allBorrowers;
    uint[] public allPlansId; 


    // Plan loan 
    struct Plan {
        uint256 upfrontPayment;
        uint256 monthlyPayment;
    }

    mapping(uint => Plan) private idToPlan;

    // Subscription if the user pay we turn the excuted to true
    struct SubmitLoan {
        address payable borrower;
        uint start;
        uint nextPayment;
        bool activated;
    }



    
    /* nested mapping from address to id to Submit Loan */ 
    mapping(address => mapping(uint => SubmitLoan)) private activeLoans;

    /* To only get loan once*/ 
    mapping(address => bool) public engaged;
    /* keep track of the payment for each address*/ 
    mapping(address => uint256) public totalPaymentsPerWallet;


    constructor() {
        owner = msg.sender;
    }


    // modifiers
    modifier onlyOwner() {
        require(owner == msg.sender, "MetaLoan :: Access only by owner");
        _;
    }

    modifier alreadyEngaged() {
        require(!engaged[msg.sender], "MetaLoan :: You already have Loan");
        _;
    }

    modifier LoanExists(uint planId) {
        require(activeLoans[msg.sender][planId].borrower != address(0), "MetaLoan :: Loan does not exist");
        _;
    }

    modifier onlyUsers() {
        require(tx.origin == msg.sender, " MetaLoan :: Connot be called by contract");
        _;
    }


    /* The owner can create differents Plans*/  
    function createPlan(uint256 _upfrontPayment,
                        uint256 _monthlyPayment) external onlyOwner  {

    idToPlan[totalPlans] = Plan (
        _upfrontPayment,
        _monthlyPayment
    );

    
    emit PlanCreated(msg.sender, totalPlans, _upfrontPayment,_monthlyPayment); 
      totalPlans++;
    }


    /*User Pay submit request for a loan*/
    function getLoan(uint planId) external
    payable
    alreadyEngaged()
    onlyUsers()
    {   
        
        Plan storage plan = idToPlan[planId];
        require(msg.value >= plan.upfrontPayment, "MetaLoan :: Please send the correct upfront payment");

        emit PaymentSent(
            payable(msg.sender),
            payable(address(this)),
            plan.upfrontPayment,
            planId,
            block.timestamp);
        
        engaged[msg.sender] = true;

        /* subscriptions that takes the address owner to subscribe into a specific plan*/
        activeLoans[msg.sender][planId] = SubmitLoan(
            payable(msg.sender),
            block.timestamp,
            block.timestamp + 1 minutes,
            true
        );

        allBorrowers.push(msg.sender);
        allPlansId.push(planId); 

        emit LoanCreated(msg.sender, planId, block.timestamp, true);
        totalLoans++;
    }


    /* Pay the loan every Month*/
    function pay(uint256 planId) 
        external payable
        onlyUsers()
        LoanExists(planId)
        {
        SubmitLoan storage submitLoan = activeLoans[msg.sender][planId];

        require(block.timestamp > submitLoan.nextPayment, "MetaLoan :: Payement not due yet");
        Plan storage plan = idToPlan[planId];

        require(msg.value >= plan.monthlyPayment, "MetaLoan :: monthly payment not correct");

        emit PaymentSent(
            payable(msg.sender),
            payable(address(this)),
            plan.monthlyPayment,
            planId,
            block.timestamp);
        totalPaymentsPerWallet[msg.sender] += 1; 
        submitLoan.nextPayment = submitLoan.nextPayment +  1 minutes;

    }


    /* Cancel Loan when user finish Loan payment */
    function cancelLoan(uint256 planId)
     external 
     payable
     onlyUsers()
     LoanExists(planId)
     
    {   
        require(cancelLoanTime, "MetaLoan :: Cancel loan is not activated yet");
        delete activeLoans[msg.sender][planId];
        emit LoanCanceled(msg.sender, planId, block.timestamp);
    }



    /* Get contract balance */ 
    function getBalance () external view returns (uint256) {
        return address(this).balance;
    }


    /* Withraw money from the contract to the lender*/
    function withdraw (uint256 _amount) payable external
    onlyOwner() 
    onlyUsers() {
        require(_amount > 0, "_amount connot be 0");
        payable(msg.sender).transfer(_amount);
    }


    function toggleCancelLoan() external onlyOwner() {
        cancelLoanTime = !cancelLoanTime;
    }


    /* receive eth in the contract */
    receive() external payable {}


    /* User can fetch it own Loan */ 
    function fetchMyLoan(uint256 planId) external view returns(
            address borrower,
            uint start,
            uint nextPayment,
            bool activated
    ) {

           SubmitLoan storage submitLoan = activeLoans[msg.sender][planId];

           return (
            submitLoan.borrower,
            submitLoan.start,
            submitLoan.nextPayment,
            submitLoan.activated
           );
    }


    /* Fetch all borrowers loans */
    function fetchAllBorrowers() external view returns(SubmitLoan[] memory) {

            SubmitLoan[] memory items = new SubmitLoan[](totalLoans);
            for(uint256 i = 0; i < allBorrowers.length; i++) {
                address currentAddress = allBorrowers[i];
                uint256 currentId = allPlansId[i];

                SubmitLoan storage currentLoan = activeLoans[currentAddress][currentId];
                items[i] = currentLoan;
            }

            return items;
    }

   
    
}