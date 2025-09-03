const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
    let MyToken;
    let myToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        MyToken = await ethers.getContractFactory("MyToken");
        [owner, addr1, addr2] = await ethers.getSigners();
        myToken = await MyToken.deploy("IndoBlockForge Token", "IBF", ethers.parseEther("1000"));
    });

    it("Harus memiliki nama dan simbol yang benar", async function () {
        expect(await myToken.name()).to.equal("IndoBlockForge Token");
        expect(await myToken.symbol()).to.equal("IBF");
    });

    it("Harus mengalokasikan total supply ke deployer", async function () {
        const ownerBalance = await myToken.balanceOf(owner.address);
        expect(await myToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Harus mentransfer token antar akun", async function () {
        await myToken.transfer(addr1.address, ethers.parseEther("50"));
        expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("50"));
    });
});
