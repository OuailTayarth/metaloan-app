// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MetaLoan is ReentrancyGuard {
  // Events
  event PlanCreated(
    address indexed creator,
    uint256 indexed upfrontPayment,
    uint256 indexed planIndex,
    uint256 monthlyPayment
  );

  event PaymentSent(
    address indexed from,
    address indexed to,
    uint256 indexed payment,
    uint256 _planId,
    uint256 date
  );

  event LoanCreated(
    address indexed borrower,
    uint256 indexed _planId,
    uint256 indexed date,
    bool status
  );

  event LoanDeleted(
    address indexed borrower,
    uint indexed _planId,
    uint indexed date
  );

  event PlanDeleted(
    address indexed borrower,
    uint indexed _planId,
    uint indexed date
  );

  uint256 public totalPlans;
  uint256 public totalLoans;
  bool public deleteTime;
  address public owner;
  address[] public allBorrowers;
  uint[] public allPlansId;
  address[] public managers;
  using SafeERC20 for IERC20;

  /* Allows owner to create a Loan plan for each borrower */
  struct Plan {
    address lender;
    address tokenPayment;
    uint256 upfrontPayment;
    uint256 monthlyPayment;
  }

  /* Mapping from ID to Plan structed */
  mapping(uint => Plan) public idToPlan;

  /* Keep track of the total payment of each borrowers in Tokens. */
  mapping(address => uint256) public totalPaymentPerWallet;

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

  /* keep track of numbers of payment for each address*/
  mapping(address => uint256) public paymentCounterPerWallet;

  /* Constructor of the smart contract*/
  constructor() {
    owner = payable(msg.sender);
  }

  //@dev Modifiers for sanity checks
  modifier onlyOwner() {
    require(owner == msg.sender, "MetaLoan :: Access only by owner");
    _;
  }

  modifier onlyManager() {
    require(isManager[msg.sender], "Metaloan:: Access only by Manager");
    _;
  }

  modifier LoanExists(uint _planId) {
    require(
      activeLoans[msg.sender][_planId].borrower != address(0),
      "MetaLoan :: Loan does not exist"
    );
    _;
  }

  modifier PlanExists(uint _planId) {
    require(
      idToPlan[_planId].lender != address(0),
      "MetaLoan :: Plan does not exist"
    );
    _;
  }

  modifier callerIsUser() {
    require(
      tx.origin == msg.sender,
      " MetaLoan :: Connot be called by contract"
    );
    _;
  }

  /**
    * @dev An external function allows the admin of the contract to create a new loan plan    
    *
    * @param _lender The address of lender
      @param _tokenPayment The address of the ERC20 token used for payment
      @param _upfrontPayment The amount of tokens to pay as upfront payment
      @param _monthlyPayment The amount of tokens to pay each month
    **/
  function createPlan(
    address _lender,
    address _tokenPayment,
    uint256 _upfrontPayment,
    uint256 _monthlyPayment
  ) external onlyManager {
    idToPlan[totalPlans] = Plan(
      payable(_lender),
      _tokenPayment,
      _upfrontPayment,
      _monthlyPayment
    );

    emit PlanCreated(msg.sender, totalPlans, _upfrontPayment, _monthlyPayment);
    totalPlans++;
  }

  /**
   * @dev An external function allows users to apply for a loan and pay 30% as an upfront payment.
   *
   * @param _planId PlanId for a specific loan
   *
   **/
  function requestLoan(
    uint _planId
  ) external payable PlanExists(_planId) callerIsUser nonReentrant {
    IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
    Plan storage plan = idToPlan[_planId];

    paymentCounterPerWallet[msg.sender] += 1;
    totalPaymentPerWallet[msg.sender] += plan.upfrontPayment;

    emit PaymentSent(
      payable(msg.sender),
      payable(plan.lender),
      plan.upfrontPayment,
      _planId,
      block.timestamp
    );

    activeLoans[msg.sender][_planId] = SubmittedLoan(
      payable(msg.sender),
      block.timestamp,
      block.timestamp + 30 days,
      true
    );

    allBorrowers.push(msg.sender);
    allPlansId.push(_planId);
    totalLoans++;

    tokenPayment.safeTransferFrom(msg.sender, plan.lender, plan.upfrontPayment);
    emit LoanCreated(msg.sender, _planId, block.timestamp, true);
  }

  /**
   * @dev An external function allows user to make a monthly payment for a specific loan plan.
   *
   * @param _planId PlanId for a specific loan plan
   *
   **/
  function payLoan(
    uint256 _planId
  ) external payable LoanExists(_planId) callerIsUser nonReentrant {
    SubmittedLoan storage submittedLoan = activeLoans[msg.sender][_planId];
    require(
      block.timestamp > submittedLoan.nextPayment,
      "MetaLoan :: Payement not due yet"
    );

    IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
    Plan storage plan = idToPlan[_planId];

    totalPaymentPerWallet[msg.sender] += plan.monthlyPayment;
    paymentCounterPerWallet[msg.sender] += 1;
    submittedLoan.nextPayment = submittedLoan.nextPayment + 30 days;

    tokenPayment.safeTransferFrom(msg.sender, plan.lender, plan.monthlyPayment);

    emit PaymentSent(
      payable(msg.sender),
      payable(plan.lender),
      plan.monthlyPayment,
      _planId,
      block.timestamp
    );
  }

  /**
   * @dev An external function allow managers to delete a specific plan, when the borrower finishes the payment.
   *
   * @param _planId PlanId for a specific loan plan
   **/
  function deletePlan(
    uint256 _planId
  ) external PlanExists(_planId) onlyManager {
    require(deleteTime, "MetaLoan :: DeleteTime loan is not activated yet");
    delete idToPlan[_planId];
    emit PlanDeleted(msg.sender, _planId, block.timestamp);
  }

  /**
   * @dev An external function allows the admin to withdraw tokens from the contract, in case a user accidentally
   * send tokens to the contract instead of the lender's address.
   * @param _planId The planId for a specific loan
   **/
  function withdrawToken(
    uint256 _planId
  ) external payable onlyOwner nonReentrant {
    IERC20 tokenPayment = IERC20(idToPlan[_planId].tokenPayment);
    tokenPayment.safeTransfer(
      msg.sender,
      tokenPayment.balanceOf(address(this))
    );
  }

  /**
   * @dev An external function to activate or
   **/
  function toggleDelete() external onlyOwner {
    deleteTime = !deleteTime;
  }

  /**
   * @dev An external function allows the admin to add a new manager.
   * @param _manager The address of the new manager
   **/
  function addManager(address _manager) external onlyOwner {
    require(!isManager[_manager], "Metaloan :: Manager is not unique");
    managers.push(_manager);
    isManager[_manager] = true;
  }

  /**
   * @dev An external view function retrieves the balance of the contract
   **/
  function getBalance() external view returns (uint256) {
    return address(this).balance;
  }

  /**
   * @dev An external view function retrieves a user loan
   **/
  function fetchMyLoan(
    address user,
    uint256 _planId
  ) external view returns (SubmittedLoan memory) {
    return activeLoans[user][_planId];
  }

  /**
   * @dev An external view function retrieves a loan plan for a specific planID
   **/
  function fetchPlan(uint256 _planId) external view returns (Plan memory) {
    return idToPlan[_planId];
  }

  /**
   * @dev An external view function retrieves all borrower's loans
   **/
  function fetchAllBorrowers() external view returns (SubmittedLoan[] memory) {
    SubmittedLoan[] memory items = new SubmittedLoan[](totalLoans);
    for (uint256 i = 0; i < allBorrowers.length; i++) {
      address currentAddress = allBorrowers[i];
      uint256 currentId = allPlansId[i];

      SubmittedLoan storage currentLoan = activeLoans[currentAddress][
        currentId
      ];
      items[i] = currentLoan;
    }

    return items;
  }

  /**
   * @dev An external view function retrieves all loans plan
   **/
  function fetchallPlans() external view returns (Plan[] memory) {
    Plan[] memory items = new Plan[](totalPlans);
    for (uint256 i = 0; i < allPlansId.length; i++) {
      uint256 currentId = allPlansId[i];
      Plan storage currentPlan = idToPlan[currentId];
      items[i] = currentPlan;
    }
    return items;
  }
}
