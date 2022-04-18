// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {MetaLoan} from "../../src/contracts/MetaLoan.sol";

contract ContractTest is Test {
  ERC20 ERC20USDT;
  MetaLoan metaloan;

  address public constant ALICE = address(1);
  address public constant BOB = address(2);
  address public constant OWNER = address(3);
  address public constant LENDER = address(4);

  function setUp() public {
    vm.startPrank(OWNER);
    metaloan = new MetaLoan();
    metaloan.addManager(address(OWNER));
    metaloan.addManager(address(ALICE));

    ERC20USDT = new ERC20();
    ERC20USDT.mint(100000000);

    console2.log(
      "Balance if the owner when minting",
      ERC20USDT.balanceOf(OWNER)
    );

    ERC20USDT.transfer(ALICE, 1000000);
    ERC20USDT.transfer(BOB, 1000000);
    ERC20USDT.transfer(address(metaloan), 1000);

    vm.label(address(ALICE), "Alice");
    vm.label(address(BOB), "Bob");
    vm.label(address(OWNER), "Owner");
    vm.label(address(LENDER), "Lender");

    console2.log("Alice balance", ERC20USDT.balanceOf(ALICE));
    console2.log("Alice balance", ERC20USDT.balanceOf(BOB));
    vm.stopPrank();
  }

  /// @dev This test is for checking the creation of a new loan plan.
  function test_createPlan() public {
    vm.startPrank(OWNER);
    uint256 _upfrontPayment = 10000;
    uint256 _monthlyPayment = 1000;
    metaloan.createPlan(
      address(LENDER),
      address(ERC20USDT),
      _upfrontPayment,
      _monthlyPayment
    );
    // Check if the loan plan is created based on the currentPlan number
    uint256 currentPlan = metaloan.totalPlanCount();
    assertEq(currentPlan, 1);

    // Check if the loan plan is created based on the recorded values in the struct for a specific id
    (
      address lender,
      ,
      uint256 upfrontPayment,
      uint256 monthlyPayment
    ) = metaloan.idToPlan(0);
    console2.log("lender", lender);
    assertEq(lender, address(LENDER));
    assertEq(upfrontPayment, 10000);
    assertEq(monthlyPayment, 1000);

    vm.stopPrank();
  }

  /// @dev This test is to ensure that only authorized users (Managers) can create a new loan plan.
  function test_Revert_unAuthorizedCaller() public {
    vm.startPrank(BOB);
    uint256 _upfrontPayment = 10000;
    uint256 _monthlyPayment = 1000;
    metaloan.createPlan(
      address(LENDER),
      address(ERC20USDT),
      _upfrontPayment,
      _monthlyPayment
    );
    vm.expectRevert("Metaloan:: Access only by Manager");
    vm.stopPrank();
  }

  /// @dev This test is for checking if a loan can be successfully requested and the related balances are updated.
  function test_requestLoan() public {
    test_createPlan();
    vm.startPrank(BOB);

    // Approve Metaloan contract to spend tokens on the Bob behalf
    uint256 _upfrontPayment = 10000;
    ERC20USDT.approve(address(metaloan), _upfrontPayment);

    // Check the lender balance before Bob down payment
    (address lender, address tokenPayment, , ) = metaloan.idToPlan(0);

    console2.log("TokenPayment", tokenPayment);
    uint256 lenderBalanceBefore = IERC20(tokenPayment).balanceOf(
      address(lender)
    );
    console2.log("lender balance before", lenderBalanceBefore);

    // Pay the upfront payment
    uint256 bobBalanceBefore = ERC20USDT.balanceOf(address(BOB));
    console2.log("bob Balance Before", bobBalanceBefore);

    metaloan.requestLoan(0);
    uint256 bobBalanceAfter = ERC20USDT.balanceOf(address(BOB));

    console2.log("bob Balance After", bobBalanceAfter);
    // Check if Bob's balance before & after = 10 000;
    assertEq(bobBalanceBefore - bobBalanceAfter, _upfrontPayment);

    // Check if the loan has been activated
    MetaLoan.SubmittedLoan memory loan = metaloan.fetchMyLoan(address(BOB), 0);
    assertTrue(loan.activated);

    uint256 lenderBalanceAfter = IERC20(tokenPayment).balanceOf(
      address(lender)
    );
    console2.log("lender balance After", lenderBalanceAfter);
    assertEq(lenderBalanceAfter, _upfrontPayment);

    vm.stopPrank();
  }

  /// @dev This test checks if monthly payments for an activated loan can be successfully processed.
  function test_payLoan() public {
    test_requestLoan();
    vm.startPrank(BOB);

    // Approve Metaloan contract to spend tokens on the Bob behalf
    uint256 _monthlyPayment = 1000;
    ERC20USDT.approve(address(metaloan), _monthlyPayment);

    // Check the lender balance before Bob down payment
    (address lender, address tokenPayment, , ) = metaloan.idToPlan(0);

    console2.log("TokenPayment", tokenPayment);
    uint256 lenderBalanceBefore = IERC20(tokenPayment).balanceOf(
      address(lender)
    );
    console2.log("lender balance before", lenderBalanceBefore);

    // Pay the upfront payment
    uint256 bobBalanceBefore = ERC20USDT.balanceOf(address(BOB));
    console2.log("bob Balance Before", bobBalanceBefore);

    // Block.timestamp + 40 days
    skip(3456000);

    metaloan.payLoan(0);
    uint256 bobBalanceAfter = ERC20USDT.balanceOf(address(BOB));

    console2.log("bob Balance After", bobBalanceAfter);
    assertEq(bobBalanceBefore - bobBalanceAfter, _monthlyPayment);

    uint256 lenderBalanceAfter = IERC20(tokenPayment).balanceOf(
      address(lender)
    );
    console2.log("lender balance After", lenderBalanceAfter);
    assertEq(lenderBalanceAfter, 11000);
    vm.stopPrank();
  }

  /// @dev This test checks if a user who does not have sufficient tokens will be prevented from requesting a loan.
  function test_revert_Not_Enough_Tokens() public {
    // test_createPlan();
    // vm.startPrank(BOB);
    // // Approve Metaloan contract to spend tokens on the Bob's behalf
    // uint256 _upfrontPayment = 10000;
    // ERC20USDT.approve(address(metaloan), _upfrontPayment);
    // metaloan.requestLoan(0);

    // vm.expectRevert("MetaLoan :: Not enough balance");
    // vm.stopPrank();

    test_requestLoan();

    // Reduce BOB allowance for this to revert
    vm.startPrank(BOB);
    // Approve Metaloan contract to spend tokens on the Bob's behalf
    uint256 _monthlyPayment = 1000;
    ERC20USDT.approve(address(metaloan), _monthlyPayment);
    metaloan.payLoan(0);

    vm.expectRevert("MetaLoan :: Not enough balance");
    vm.stopPrank();
  }

  /// @dev This test checks that only the borrower can make payments against their loan.
  function test_revert_Caller_Not_Borrower() public {
    test_payLoan();

    vm.startPrank(ALICE);
    // Approve Metaloan contract to spend tokens on the Bob behalf
    uint256 _monthlyPayment = 1000;
    ERC20USDT.approve(address(metaloan), _monthlyPayment);

    // Block.timestamp + 40 days
    skip(3456000);
    metaloan.payLoan(0);
    vm.expectRevert("MetaLoan: Unauthorized caller");
    vm.stopPrank();
  }

  /// @dev This test checks if the contract prevents payments before they are due.
  function test_revert_payment_not_due() public {
    test_payLoan();

    vm.startPrank(BOB);
    // Approve Metaloan contract to spend tokens on behalf of Bob
    uint256 _monthlyPayment = 1000;
    ERC20USDT.approve(address(metaloan), _monthlyPayment);

    metaloan.payLoan(0);
    vm.expectRevert("MetaLoan :: Payment not due yet");
    vm.stopPrank();
  }

  /// @dev This test checks if a loan plan can be successfully deleted.
  function test_delete_Plan() public {
    test_createPlan();

    vm.startPrank(ALICE);
    metaloan.deletePlan(0);
    MetaLoan.Plan memory deletedPlan = metaloan.fetchPlan(0);
    delete deletedPlan;
    assertEq(deletedPlan.lender, address(0));
    assertEq(deletedPlan.monthlyPayment, 0);
    assertEq(deletedPlan.upfrontPayment, 0);
    assertEq(deletedPlan.tokenPayment, address(0));
    vm.stopPrank();
  }

  /// @dev This test checks to ensure that only authorized users (Managers) can delete a loan plan.
  function test_revert_deletePlan_unauthorizedCaller() public {
    test_createPlan();
    vm.startPrank(BOB);
    metaloan.deletePlan(0);
    MetaLoan.Plan memory deletedPlan = metaloan.fetchPlan(0);
    delete deletedPlan;
    vm.expectRevert("Metaloan:: Access only by Manager");
    vm.stopPrank();
  }

  /// @dev This test checks if tokens can be successfully withdrawn from the contract by the owner.
  function test_WithdrawTokens() public {
    test_requestLoan();

    vm.startPrank(OWNER);

    (address lender, address tokenPayment, , ) = metaloan.idToPlan(0);

    // Contract Balance Before
    uint256 contractBalanceBefore = ERC20USDT.balanceOf(address(metaloan));
    console2.log(" Balance of contract Before", contractBalanceBefore);

    // Owner Balance Before
    uint256 ownerBalanceBefore = ERC20USDT.balanceOf(OWNER);
    console2.log(" Balance of owner Before", ownerBalanceBefore);

    // Withdraw Tokens
    metaloan.withdrawTokens(0);

    // Contract Balance After
    uint256 contractBalanceAfter = ERC20USDT.balanceOf(address(metaloan));
    console2.log(" Balance of contract After", contractBalanceAfter);

    // Owner Balance After
    uint256 ownerBalanceAfter = ERC20USDT.balanceOf(OWNER);
    console2.log(" Balance of owner After", ownerBalanceAfter);

    assertEq(contractBalanceAfter, 0);

    // Owner balance should increase with 10000
    assertEq(ownerBalanceAfter, 98000000);
    vm.stopPrank();
  }

  /// @dev This test checks if a new manager can be successfully added to the list of managers.
  function test_addManager() public {
    vm.startPrank(OWNER);

    metaloan.addManager(BOB);
    bool ManagerExist = metaloan.isManager(BOB);
    assertTrue(ManagerExist);

    vm.stopPrank();
  }
}

interface IERC20 {
  function totalSupply() external view returns (uint);

  function balanceOf(address account) external view returns (uint);

  function transfer(address recipient, uint amount) external returns (bool);

  function allowance(
    address owner,
    address spender
  ) external view returns (uint);

  function approve(address spender, uint amount) external returns (bool);

  function transferFrom(
    address sender,
    address recipient,
    uint amount
  ) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}

contract ERC20 is IERC20 {
  uint public totalSupply;
  mapping(address => uint) public balanceOf;
  mapping(address => mapping(address => uint)) public allowance;
  string public name = "Test example";
  string public symbol = "Test";
  uint8 public decimals = 18;

  function transfer(address recipient, uint amount) external returns (bool) {
    balanceOf[msg.sender] -= amount;
    balanceOf[recipient] += amount;
    emit Transfer(msg.sender, recipient, amount);
    return true;
  }

  function approve(address spender, uint amount) external returns (bool) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(
    address sender,
    address recipient,
    uint amount
  ) external returns (bool) {
    allowance[sender][msg.sender] -= amount;
    balanceOf[sender] -= amount;
    balanceOf[recipient] += amount;
    emit Transfer(sender, recipient, amount);
    return true;
  }

  function mint(uint amount) external {
    balanceOf[msg.sender] += amount;
    totalSupply += amount;
    emit Transfer(address(0), msg.sender, amount);
  }

  function burn(uint amount) external {
    balanceOf[msg.sender] -= amount;
    totalSupply -= amount;
    emit Transfer(msg.sender, address(0), amount);
  }
}
