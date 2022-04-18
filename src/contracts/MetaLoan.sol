// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MetaLoan is ReentrancyGuard {

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

    event TransferOfTokens(address indexed receiver,   
                           uint256 indexed amount);


    
    uint256 public totalPlanCount;
    uint256 public numberOfLoans;
    bool public deleteTime;
    address public immutable OWNER;
    address[] public allBorrowers;
    uint[] public allPlansId; 
    address[] public managers;
    using SafeERC20 for IERC20;


    /* Allows the owner to create a Loan plan for each borrower */
    struct Plan {
        address lender;
        address tokenPayment;
        uint256 upfrontPayment;
        uint256 monthlyPayment;
    }

    /* Mapping from ID to Plan structed */
    mapping(uint => Plan) public idToPlan;

    /* Keep track of the total payment of each borrower in Tokens. */
    mapping(address => uint256) public totalPaymentPerWallet;

    /* Add new manager */
    mapping(address => bool) public isManager;

    /* SubmittedLoan created when a new user submit a request for a loan*/
    struct SubmittedLoan {
        address borrower;
        uint start;
        uint nextPayment;
        bool activated;
    }

    /* From address to ID to Address to Submitted Loan */ 
    mapping(address => mapping(uint => SubmittedLoan)) public activeLoans;


    /* keep track of numbers of payment for each address*/ 
    mapping(address => uint256) public numPaymentsPerWallet;


    /* Constructor of the smart contract*/
    constructor() {
        OWNER = msg.sender;
    }


    //@dev Modifiers for sanity checks 
    modifier onlyOwner() {
        require(OWNER == msg.sender, "MetaLoan :: Access only by owner");
        _;
    }

    modifier onlyManager() {
        require(isManager[msg.sender], "Metaloan:: Access only by Manager");
        _;
    }


    // modifier LoanExists(uint _planId) {
    //     require(activeLoans[msg.sender][_planId].activated, "MetaLoan :: Loan does not exist");
    //     _;
    // }


    modifier PlanExists(uint _planId) {
        require(idToPlan[_planId].lender != address(0), "MetaLoan :: Plan does not exist");
        _;
    }

    modifier NotZeroAddress(address _address) {
        require(_address != address(0), "Address cannot be zero");
        _;
    }

    modifier NotZeroValue(uint256 _value) {
        require(_value != 0, "Value cannot be zero");
        _;
    }



    /**
    * @dev Allows the admin of the contract to create a new loan plan.
    *
    * @param _lender The address of the lender.
    * @param _tokenPayment The address of the ERC20 token used for payment.
    * @param _upfrontPayment The amount of tokens required for the upfront payment.
    * @param _monthlyPayment The amount of tokens to be paid each month.
    */
 
    function createPlan(address _lender,
                        address _tokenPayment,
                        uint256 _upfrontPayment,
                        uint256 _monthlyPayment) external 
                        onlyManager()
                        NotZeroAddress(_lender)
                        NotZeroAddress(_tokenPayment)
                        NotZeroValue(_upfrontPayment)
                        NotZeroValue(_monthlyPayment) {

    idToPlan[totalPlanCount] = Plan (
        _lender,
        _tokenPayment,
        _upfrontPayment,
        _monthlyPayment
    );

    totalPlanCount++;

    emit PlanCreated(msg.sender, totalPlanCount, _upfrontPayment,_monthlyPayment); 
    }

    

    /**
      * @dev Allows users to apply for a loan, requiring a 30% upfront payment.
      *
      * @param _planId The identifier for a specific loan plan.
    */
    function requestLoan(uint _planId) external
    PlanExists(_planId)
    nonReentrant
    {   

        Plan storage plan = idToPlan[_planId];

        address tokenAddressPlan = idToPlan[_planId].tokenPayment;
        uint256 upfrontPayment = plan.upfrontPayment;
        address lender = plan.lender;

        IERC20 tokenPayment = IERC20(tokenAddressPlan);

        uint256 callerBalance = tokenPayment.balanceOf(msg.sender);
        require(callerBalance >= upfrontPayment, "MetaLoan :: Not enough balance");

        numPaymentsPerWallet[msg.sender] += 1;
        totalPaymentPerWallet[msg.sender] += upfrontPayment;

        activeLoans[msg.sender][_planId] = SubmittedLoan(
            msg.sender,
            block.timestamp,
            block.timestamp + 30 days,
            true
        );

        allBorrowers.push(msg.sender);
        allPlansId.push(_planId); 
        numberOfLoans++;

        tokenPayment.safeTransferFrom(msg.sender, lender, upfrontPayment);

        emit PaymentSent(msg.sender, lender, upfrontPayment, _planId, block.timestamp);
        emit LoanCreated(msg.sender, _planId, block.timestamp, true);
        
    }



    /**
      * @dev Allows a user to make a monthly payment for a specific loan plan.
      *
      * @param _planId The identifier for the specific loan plan.
    */
    function payLoan(uint256 _planId) 
        external
        nonReentrant
        {
            
        Plan storage plan = idToPlan[_planId];
        SubmittedLoan storage submittedLoan = activeLoans[msg.sender][_planId];
        uint256 nextPayment = submittedLoan.nextPayment;

        require(block.timestamp > nextPayment, "MetaLoan :: Payment not due yet");
        require(submittedLoan.borrower == msg.sender, "MetaLoan: Unauthorized caller");
        require(activeLoans[msg.sender][_planId].activated, "MetaLoan :: Loan does not exist");
        
        address tokenAddressPlan = idToPlan[_planId].tokenPayment;
        uint256 monthlyPayment = plan.monthlyPayment;
        address lender = plan.lender;

        IERC20 tokenPayment = IERC20(tokenAddressPlan);

        uint256 callerBalance = tokenPayment.balanceOf(msg.sender);
        require(callerBalance >= monthlyPayment, "MetaLoan :: Not enough balance");

        totalPaymentPerWallet[msg.sender] += monthlyPayment; 
        numPaymentsPerWallet[msg.sender] += 1;

        //Update both local variables and storage variable
        nextPayment += 30 days;
        submittedLoan.nextPayment = nextPayment;

        tokenPayment.safeTransferFrom(msg.sender, lender, monthlyPayment);

        emit PaymentSent(msg.sender, lender, monthlyPayment, _planId, block.timestamp);
    }



    /**
    * @dev Allows managers to delete a specific loan plan once the borrower has completed payments.
    *
    * @param _planId The identifier for the specific loan plan.
    */
    function deletePlan(uint256 _planId) 
    external
    PlanExists(_planId)
    onlyManager()
    {  
        delete idToPlan[_planId];
        emit PlanDeleted(msg.sender, _planId, block.timestamp);
    }



    /**
      * @dev Allows the admin to withdraw tokens from the contract, in the event that a user accidentally 
      * sends tokens to the contract instead of to the lender's address.
      *
      * @param _planId The identifier for a specific loan plan.
    */
    function withdrawTokens(uint256 _planId) external
    onlyOwner()
    PlanExists(_planId)
    nonReentrant { 
        IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
        uint256 contractBalance = tokenPayment.balanceOf(address(this));
        require(contractBalance > 0, "No tokens to withdraw");
        tokenPayment.safeTransfer(msg.sender, contractBalance);
        emit TransferOfTokens(msg.sender, contractBalance);
    }


    /**
      * @dev Allows the admin to add a new manager.
      *
      * @param _manager The address of the new manager.
    */
    function addManager(address _manager) external 
    onlyOwner()
    NotZeroAddress(_manager) {
        require(!isManager[_manager], "Metaloan :: Manager is not unique");
        managers.push(_manager);
        isManager[_manager] = true;
    }




    /**
      * @dev Retrieves loan details for a specific user and plan ID.
      *
      * @param user The address of the user.
      * @param _planId The identifier for the specific loan plan.
      * @return A SubmittedLoan struct containing the loan details.
    */
    function fetchMyLoan(address user, uint256 _planId) external view returns(SubmittedLoan memory) {
        return activeLoans[user][_planId];
    }




    /**
      * @dev Retrieves details of a loan plan using its plan ID.
      *
      * @param _planId The identifier for the specific loan plan.
      * @return A Plan struct containing the loan plan details.
    */
    function fetchPlan(uint256 _planId) external view returns(Plan memory) {
        return idToPlan[_planId];
    }


    /**
      * @dev Retrieves all loans submitted by borrowers.
      *
      * @return An array of SubmittedLoan structs containing the loans for all borrowers.
    */
    function fetchAllBorrowers() external view returns(SubmittedLoan[] memory) {

            SubmittedLoan[] memory items = new SubmittedLoan[](numberOfLoans);
            for(uint256 i = 0; i < allBorrowers.length; i++) {
                address currentAddress = allBorrowers[i];
                uint256 currentId = allPlansId[i];

                SubmittedLoan storage currentLoan = activeLoans[currentAddress][currentId];
                items[i] = currentLoan;
            }

            return items;
    }


    /**
      * @dev Retrieves all existing loan plans.
      *
      * @return An array of Plan structs containing the details for all loan plans.
    */
    function fetchallPlans() external view returns(Plan[] memory) {
            Plan[] memory items = new Plan[](totalPlanCount);
            for(uint256 i = 0; i < allPlansId.length; i++) {
                uint256 currentId = allPlansId[i];
                Plan storage currentPlan = idToPlan[currentId];
                items[i] = currentPlan;
            }
            return items;
    }

}


