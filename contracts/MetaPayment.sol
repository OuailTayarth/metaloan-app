// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;


import "hardhat/console.sol";
import "openzeppelin-contracts/token/ERC20/IERC20.sol";

contract MetaPayment  {

    // event 
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

    event LoanDeleted(address indexed borrower,
                        uint indexed planId,
                        uint indexed date);


    event PlanDeleted(address indexed borrower,
                        uint indexed planId,
                        uint indexed date);



    uint256 public totalPlans;
    uint256 public totalLoans;
    bool public deleteTime;
    address public owner;
    address[] public allBorrowers;
    uint[] public allPlansId; 
    address[] public managers;
    IERC20 public USDCToken;


    // Plan loan 
    struct Plan {
        address lender;
        address tokenPayment;
        uint256 upfrontPayment;
        uint256 monthlyPayment;
    }

    mapping(uint => Plan) public idToPlan;
    mapping(address => uint256) public payementTracker;
    mapping(address => bool) public isManager;

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
        owner = payable(msg.sender);
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

    modifier PlanExists(uint planId) {
        require(idToPlan[planId].lender != address(0), "MetaLoan :: Plan does not exist");
        _;
    }

    modifier onlyUsers() {
        require(tx.origin == msg.sender, " MetaLoan :: Connot be called by contract");
        _;
    }


    /* The owner can create differents Plans*/  
    function createPlan(address _lender,
                        address _tokenPayment,
                        uint256 _upfrontPayment,
                        uint256 _monthlyPayment) external onlyOwner  {

    idToPlan[totalPlans] = Plan (
        payable(_lender),
        _tokenPayment,
        _upfrontPayment,
        _monthlyPayment
    );

    
    emit PlanCreated(msg.sender, totalPlans, _upfrontPayment,_monthlyPayment); 
      totalPlans++;
    }

    // check if the the plan
    /*User Pay submit request for a loan*/
    function getLoan(uint planId) external
    payable
    alreadyEngaged()
    PlanExists(planId)
    {   
        IERC20 tokenPayment = IERC20(idToPlan[planId].tokenPayment);
        Plan storage plan = idToPlan[planId];

        tokenPayment.transferFrom(msg.sender, plan.lender, plan.upfrontPayment);

        emit PaymentSent(
            payable(msg.sender),
            payable(plan.lender),
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
        payementTracker[msg.sender] += plan.upfrontPayment;
        emit LoanCreated(msg.sender, planId, block.timestamp, true);
        totalLoans++;
    }


    /* Pay the loan every Month*/
    function pay(uint256 planId) 
        external payable
        LoanExists(planId)
        {
        SubmitLoan storage submitLoan = activeLoans[msg.sender][planId];

        require(block.timestamp > submitLoan.nextPayment, "MetaLoan :: Payement not due yet");

        IERC20 tokenPayment = IERC20(idToPlan[planId].tokenPayment);
        Plan storage plan = idToPlan[planId];

        // check how the recommended method
        tokenPayment.transferFrom(msg.sender, plan.lender, plan.monthlyPayment);

        emit PaymentSent(
            payable(msg.sender),
            payable(plan.lender),
            plan.monthlyPayment,
            planId,
            block.timestamp);
        payementTracker[msg.sender] += plan.monthlyPayment; 
        totalPaymentsPerWallet[msg.sender] += 1; 
        submitLoan.nextPayment = submitLoan.nextPayment +  1 minutes;
    }


    /* Cancel Loan when user finish Loan payment */
    function deleteLoan(uint256 planId)
     external 
     onlyUsers()
     LoanExists(planId)
     
    {   
        require(deleteTime, "MetaLoan :: deleteTime loan is not activated yet");
        payementTracker[msg.sender] = 0;
        delete activeLoans[msg.sender][planId];
        emit LoanDeleted(msg.sender, planId, block.timestamp);
    }

    // delete plan 
    function deletePlan(uint256 planId) 
    external 
    PlanExists(planId) {  
        require(deleteTime, "MetaLoan :: deleteTime loan is not activated yet");
        delete idToPlan[planId];
        emit PlanDeleted(msg.sender, planId, block.timestamp);
    }


    /* Withraw money from the contract to the Owner*/
    function withdraw (uint256 planId) external payable
    onlyOwner()  { 
        IERC20 tokenPayment = IERC20(idToPlan[planId].tokenPayment);
        tokenPayment.transfer(msg.sender, tokenPayment.balanceOf(address(this)));
    }


    function toggleDelete() external onlyOwner() {
        deleteTime = !deleteTime;
    }

    // add Managers
    function addManager(address _manager) external onlyOwner() {
        require(!isManager[_manager], "Metaloan :: Manager is not unique");
        managers.push(_manager);
        isManager[_manager] = true;
    }


    /* receive eth in the contract */
    receive() external payable {}

    
    /* Get contract balance */ 
    function getBalance () external view returns (uint256) {
        return address(this).balance;
    }

    // fetch user accounts
    function fecthMyLoan(address user, uint256 planId) external view returns(SubmitLoan memory) {
        return activeLoans[user][planId];
    }

    // fetch one plan
    function fetchPlan(uint256 planId) external view returns(Plan memory) {
        return idToPlan[planId];
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

    // get all plan
    function fetchallPlans() external view returns(Plan[] memory) {
            Plan[] memory items = new Plan[](totalPlans);
            for(uint256 i = 0; i < allPlansId.length; i++) {
                uint256 currentId = allPlansId[i];
                Plan storage currentPlan = idToPlan[currentId];
                items[i] = currentPlan;
            }
            return items;
    }

}

