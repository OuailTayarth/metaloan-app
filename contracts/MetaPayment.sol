// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


// 
/*  Inside the monthly payement we include the percentage!!
    take a look at oracle
    TODOS:
    add managers and owner
    // Keep track of unpaid loans and paid loans
    // return all the subscription of all addresses
    // after 3 month missed payement we should add a late fee
    //update upfront pyement and downpayment
    // fix lint error with currentIme function
    // check tx-origin
    // add diffetent addres token inside each plan. tokenAddress to get paid with. x 
    // create a function to withraw funds from the smart contract to onwer wallet. x
    // transfering the funds from wallet to another is succufful x
    // I have to approve the smart contract 
    // ask omar who is going to delete the loan/user or the plan/owner
    // if should I give the right to the user to have only one loan per address.
*/ 


// contract last address 0x46d143c0E594775ecfEBAD12355d68ca9d1C6293

import "openzeppelin-contracts/token/ERC20/IERC20.sol";

contract ERC20MetaLoan  {

    // Events
    event PlanCreated(address indexed creator,
                      uint256 indexed upfrontPayment,
                      uint256 indexed planIndex,
                      uint256 monthlyPayment);

    event PaymentSent(address indexed from,
                      address indexed to,
                      uint256 indexed payment,
                      uint256 _planId,
                      uint256 date);

    event LoanCreated(address indexed borrower,
                              uint256 indexed _planId,
                              uint256 indexed date,
                              bool status);

    event LoanDeleted(address indexed borrower,
                        uint indexed _planId,
                        uint indexed date);


    event PlanDeleted(address indexed borrower,
                        uint indexed _planId,
                        uint indexed date);



    uint256 public totalPlans;
    uint256 public totalLoans;
    bool public deleteTime;
    address public owner;
    address[] public allBorrowers;
    uint[] public allPlansId; 
    address[] public managers;


    /* Allows owner to create a Loan for each borrower */
    struct Plan {
        address lender;
        address tokenPayment;
        uint256 upfrontPayment;
        uint256 monthlyPayment;
    }

    /* Mapping from an ID to Plan structed */
    mapping(uint => Plan) public idToPlan;
    /* Keep track of the total payment of each borrowers in Tokens. */
    mapping(address => uint256) public totalPaymentTracker;
    /* Add new manager */
    mapping(address => bool) public isManager;

    /* SubmittedLoan created when a new user submit a request for a loan*/
    struct SubmittedLoan {
        address payable borrower;
        uint start;
        uint nextPayment;
        bool activated;
    }

    /* From address to ID to Address to Submitted Loan */ 
    mapping(address => mapping(uint => SubmittedLoan)) public activeLoans;

    /* To only get loan once*/ 
    mapping(address => bool) public engaged;

    /* keep track of numbers of payment for each address*/ 
    mapping(address => uint256) public totalPaymentsPerWallet;

    /* Constructor of the smart contract*/
    constructor() {
        owner = payable(msg.sender);
    }


    /* Modifiers */
    modifier onlyOwner() {
        require(owner == msg.sender, "MetaLoan :: Access only by owner");
        _;
    }

    modifier onlyManager() {
        require(isManager[msg.sender], "Metaloan:: Access only by Manager");
        _;
    }

    modifier alreadyEngaged() {
        require(!engaged[msg.sender], "MetaLoan :: You already have Loan");
        _;
    }

    modifier LoanExists(uint _planId) {
        require(activeLoans[msg.sender][_planId].borrower != address(0), "MetaLoan :: Loan does not exist");
        _;
    }

    modifier PlanExists(uint _planId) {
        require(idToPlan[_planId].lender != address(0), "MetaLoan :: Plan does not exist");
        _;
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, " MetaLoan :: Connot be called by contract");
        _;
    }


    /**
    * @notice Create a Plan for a Loan
    *
    * @param _lender The lender
      @param _tokenPayment The ERC20 token used for payment
      @param _upfrontPayment The Amount of token to pay as an upFront payment
      @param _monthlyPayment The Amount of token to pay each month
    **/  
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

    /**
    * @notice The User can submit loan 
    *
    * @param _planId The planId for a specific loan
    * 
    **/
    function requestLoan(uint _planId) external
    payable
    alreadyEngaged()
    PlanExists(_planId)
    callerIsUser()
    {   
        IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
        Plan storage plan = idToPlan[_planId];

        tokenPayment.transferFrom(msg.sender, plan.lender, plan.upfrontPayment);

        emit PaymentSent(
            payable(msg.sender),
            payable(plan.lender),
            plan.upfrontPayment,
            _planId,
            block.timestamp);
        
        engaged[msg.sender] = true;

        activeLoans[msg.sender][_planId] = SubmittedLoan(
            payable(msg.sender),
            block.timestamp,
            block.timestamp + 1 minutes,
            true
        );

        allBorrowers.push(msg.sender);
        allPlansId.push(_planId); 
        totalPaymentTracker[msg.sender] += plan.upfrontPayment;
        emit LoanCreated(msg.sender, _planId, block.timestamp, true);
        totalLoans++;
    }




    /**
    * @notice To make a monthly payement 
    *
    * @param _planId The planId for a specific loan
    * 
    **/
    function payLoan(uint256 _planId) 
        external payable
        LoanExists(_planId)
        callerIsUser()
        {
        SubmittedLoan storage submittedLoan = activeLoans[msg.sender][_planId];

        require(block.timestamp > submittedLoan.nextPayment, "MetaLoan :: Payement not due yet");

        IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
        Plan storage plan = idToPlan[_planId];

        // check how the recommended method
        tokenPayment.transferFrom(msg.sender, plan.lender, plan.monthlyPayment);

        totalPaymentTracker[msg.sender] += plan.monthlyPayment; 
        totalPaymentsPerWallet[msg.sender] += 1; 
        submittedLoan.nextPayment = submittedLoan.nextPayment +  1 minutes;
        emit PaymentSent(
            payable(msg.sender),
            payable(plan.lender),
            plan.monthlyPayment,
            _planId,
            block.timestamp);
    }

    /**
    * @notice Cancel Loan when user finish Loan payment 
    *
    * @param _planId The planId for a specific loan
    * 
    **/
    function deleteLoan(uint256 _planId)
     external 
     LoanExists(_planId)
    {   
        require(deleteTime, "MetaLoan :: deleteTime loan is not activated yet");
        totalPaymentTracker[msg.sender] = 0;
        delete activeLoans[msg.sender][_planId];
        emit LoanDeleted(msg.sender, _planId, block.timestamp);
    }

    /**
    * @notice Delete a Plan Loan when the borrower finishes the payment. 
    * @param _planId The planId for a specific loan
    **/ 
    function deletePlan(uint256 _planId) 
    external 
    PlanExists(_planId)
    onlyManager()
    onlyOwner() {  
        require(deleteTime, "MetaLoan :: deleteTime loan is not activated yet");
        delete idToPlan[_planId];
        emit PlanDeleted(msg.sender, _planId, block.timestamp);
    }


    /**
    * @notice Withraw money from the contract to the Owner. 
    * @param _planId The planId for a specific loan
    **/
    function withdraw (uint256 _planId) external payable
    onlyOwner()  { 
        IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
        tokenPayment.transfer(msg.sender, tokenPayment.balanceOf(address(this)));
    }

    /**
    * @notice Activate Delete loan Function to delete loan. 
    **/
    function toggleDelete() external onlyOwner() {
        deleteTime = !deleteTime;
    }

    /**
    * @notice Add a new manager only by the owner. 
    * @param _manager the Adress address
    **/
    function addManager(address _manager) external onlyOwner() {
        require(!isManager[_manager], "Metaloan :: Manager is not unique");
        managers.push(_manager);
        isManager[_manager] = true;
    }

    
    /**
    * @notice To get the balance of the contract. 
    **/
    function getBalance () external view returns (uint256) {
        return address(this).balance;
    }


    /**
    * @notice to Get a loan of the borrower 
    **/
    function fetchMyLoan(address user, uint256 _planId) external view returns(SubmittedLoan memory) {
        return activeLoans[user][_planId];
    }

    /**
    * @notice to Get a Loan plan
    **/
    function fetchPlan(uint256 _planId) external view returns(Plan memory) {
        return idToPlan[_planId];
    }

    /**
    * @notice Fetch all borrowers loans
    **/
    function fetchAllBorrowers() external view returns(SubmittedLoan[] memory) {

            SubmittedLoan[] memory items = new SubmittedLoan[](totalLoans);
            for(uint256 i = 0; i < allBorrowers.length; i++) {
                address currentAddress = allBorrowers[i];
                uint256 currentId = allPlansId[i];

                SubmittedLoan storage currentLoan = activeLoans[currentAddress][currentId];
                items[i] = currentLoan;
            }

            return items;
    }

    /**
    * @notice Fetch all Plans Loans
    **/
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
