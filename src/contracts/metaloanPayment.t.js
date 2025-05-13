const { expect } = require("chai");
const { ethers } = require("hardhat");
const provider = ethers.provider;

describe("metaPayment contract", () => {
  let metaPayment, MetaPayment, Token, token, lender, borrower, owner, addr1;

  // @ will be deployed each time we run the test
  beforeEach(async () => {
    MetaPayment = await ethers.getContractFactory("MetaPayment");
    metaPayment = await MetaPayment.deploy();
    await metaPayment.deployed();

    Token = await ethers.getContractFactory("USDTPayment");
    token = await Token.deploy();
    await token.deployed();

    [owner, lender, borrower, addr1, _] = await ethers.getSigners();

    await token.transfer(borrower.address, 1000);
    await token.connect(borrower).approve(metaPayment.address, 1000);
  });

  describe("Deployment", () => {
    it("should set the right owner", async () => {
      expect(await metaPayment.owner()).to.equal(owner.address);
      expect(await token.owner()).to.equal(owner.address);
    });

    it("the borrower should have a 1000", async () => {
      expect(await token.balanceOf(borrower.address)).to.equal(1000);
    });

    it("paymentLoan should bet approved", async () => {
      await token.connect(borrower).approve(metaPayment.address, 1000);
    });
  });

  describe("Create plan", () => {
    it("it should create a plan", async () => {
      await metaPayment
        .connect(owner)
        .createPlan(lender.address, token.address, 20, 20);
      const plan1 = await metaPayment.idToPlan(0);
      expect(await plan1.tokenPayment).to.equal(token.address);
      expect(await plan1.lender).to.equal(lender.address);
      expect(await plan1.upfrontPayment).to.equal(20);
      expect(await plan1.monthlyPayment).to.equal(20);
    });
  });

  describe("Get & pay a Loan function", () => {
    it("borrower should get a loan / Transfer funds / downPayment", async () => {
      await metaPayment
        .connect(owner)
        .createPlan(lender.address, token.address, 20, 30);
      await metaPayment.connect(borrower).getLoan(0, { value: 20 });
      // Tokens has been transferred successfully
      expect(await token.balanceOf(lender.address)).to.equal(20);
      expect(await token.balanceOf(borrower.address)).to.equal(980);
      const submitLoan = await metaPayment.activeLoans(borrower.address, 0);
      const getTimeStampBlock = (await provider.getBlock()).timestamp;

      expect(await submitLoan.borrower).to.equal(borrower.address);
      expect(await submitLoan.start.toString()).to.equal(
        getTimeStampBlock.toString()
      );
      expect(await submitLoan.activated).to.equal(true);
    });

    it("should pay monthly / Transfer funds", async () => {
      await metaPayment
        .connect(owner)
        .createPlan(lender.address, token.address, 20, 30);
      // Get a loan
      await metaPayment.connect(borrower).getLoan(0, { value: 20 });
      // Tokens has been transferred successfully
      expect(await token.balanceOf(lender.address)).to.equal(20);
      expect(await token.balanceOf(borrower.address)).to.equal(980);
      // Pay a loan
      await metaPayment.connect(borrower).pay(0, { value: 30 });
      expect(await token.balanceOf(borrower.address)).to.equal(950);
      expect(await token.balanceOf(lender.address)).to.equal(50);
    });
  });

  describe("Owner should withdraw funds form the smart contract", () => {
    it("should withdraw funds", async () => {
      await metaPayment
        .connect(owner)
        .createPlan(metaPayment.address, token.address, 20, 20);
      await metaPayment.connect(borrower).getLoan(0, { value: 20 });
      expect(await token.balanceOf(metaPayment.address)).to.equal(20);
      await metaPayment.connect(owner).withdraw(0);
    });
  });

  it("Should add manager", async () => {
    await metaPayment.connect(owner).addManager(addr1.address);
    expect(await metaPayment.connect(owner).isManager(addr1.address)).to.equal(
      true
    );
  });
});
