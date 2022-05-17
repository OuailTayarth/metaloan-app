const {expectRevert, constants, time} = require("@openzeppelin/test-helpers");
const {expect} = require('chai');
const { ethers } = require("hardhat");

// const MetaPayment = artifacts.require("MetaPayment.sol");
// const Token = artifacts.require("USDTPayment.sol");

const THIRTY_DAYS = time.duration.days(30);

describe("metaPayment contract", () => {
    let metaPayment, MetaPayment, Token, token, lender, borrower, owner;

    // @ will be deployed each time we run the test
    beforeEach(async() => {

        MetaPayment = await ethers.getContractFactory("MetaPayment");
        metaPayment = await MetaPayment.deploy();
        await metaPayment.deployed();

        Token = await ethers.getContractFactory("USDTPayment");
        token = await Token.deploy();
        await token.deployed();

        [owner ,lender, borrower, _] = await ethers.getSigners();

        await token.transfer(borrower.address, 1000);
        await token.connect(borrower).approve(metaPayment.address, 1000);
    });

    describe("Deployment", ()=> {
        it("should set the right owner", async()=> {
            expect(await metaPayment.owner()).to.equal(owner.address);
            expect(await token.owner()).to.equal(owner.address);
        });

        it("the borrower should have a 1000", async ()=> {
            expect(await token.balanceOf(borrower.address)).to.equal(1000);
        });

        it("paymentLoan should bet approved", async()=> {
            await token.connect(borrower).approve(metaPayment.address, 1000);
        });
    })

    it("it should create a plan", async()=> {
       await metaPayment.connect(owner).createPlan(lender.address, token.address, 20, 20);
       const plan1 = await metaPayment.idToPlan(0);
       expect(await plan1.tokenPayment).to.equal(token.address);
       expect(await plan1.lender).to.equal(lender.address);
       expect(await plan1.upfrontPayment).to.equal(20);
       expect(await plan1.monthlyPayment).to.equal(20);
    });
    
    describe("Get Loan function", ()=> {
        // Borrower should get a loan x
        // should check lender.address received 20 x
        // Check if the borrower balance is less 20x
        // borrower plan x
        it("Borrower should get a loan / Transfer funds", async()=> {
            await metaPayment.connect(owner).createPlan(lender.address, token.address, 20, 20);
            await metaPayment.connect(borrower).getLoan(0, {value:20});
            expect(await token.balanceOf(lender.address)).to.equal(20);
            expect(await token.balanceOf(borrower.address)).to.equal(980);
            // check if the submit loan has been created.
        });



    })

    
});


// struct Plan {
//     address lender;
//     address tokenPayment;
//     uint256 upfrontPayment;
//     uint256 monthlyPayment;
// }