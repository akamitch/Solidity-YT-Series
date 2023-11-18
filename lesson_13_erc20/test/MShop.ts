import { loadFixture, ethers, expect } from "./setup";

describe("MShop", function() {

  async function deploy() {
    const [owner, buyer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("MShop", owner);
    const shop = await Factory.deploy();
    await shop.waitForDeployment();
    const erc20 = new ethers.Contract(await shop.token(), tokenJSON.abi, owner)
    return { owner, buyer, shop }
  }

  it("should be deployed", async function() {
    const { MShop } = await loadFixture(deploy);

    expect(MShop.target).to.be.properAddress;
  });

 /*  it("should have 0 ethers by default", async function() {
    const { frontRunnerDemo } = await loadFixture(deploy);

    // const balance = await frontRunnerDemo.currentBalance();
    const balance = await ethers.provider.getBalance(frontRunnerDemo.target);
    expect(balance).to.eq(0);
  });

  it("should be possible to deposit funds", async function() {
    const { user1, user2, frontRunnerDemo } = await loadFixture(deploy);

    const sum = 100; // wei

    const tx = await frontRunnerDemo.connect(user2).depositFunds({value: sum});
    const receipt = await tx.wait(1);
    //console.log(receipt);
    const balance = await ethers.provider.getBalance(frontRunnerDemo.target);
    expect(balance).to.eq(sum);
    //console.log("balance is:", balance);

  });


  it("should withdraw funds with correct secret", async function () {
    const { user1, user2, frontRunnerDemo } = await loadFixture(deploy);
    const sum = 200; // wei
    const txDeposit = await frontRunnerDemo.connect(user2).depositFunds({value: sum});
    
    const txWithdraw = await frontRunnerDemo.withdrawFunds("Front_runner_demo");
    const balance = await ethers.provider.getBalance(frontRunnerDemo.target);
    expect(balance).to.eq(0);
  });

  it("should not withdraw funds with wrong secret", async function () {
    // не понятно как заставить работать, тк транза падает как и должна но это выдает ошибку
    const { user1, user2, frontRunnerDemo } = await loadFixture(deploy);
    const sum = 200; // wei
    const txDeposit = await frontRunnerDemo.connect(user2).depositFunds({value: sum});
    
    const txWithdraw = await frontRunnerDemo.withdrawFunds("Wrong_secret");
    const balance = await ethers.provider.getBalance(frontRunnerDemo.target);
    console.log("balance is:", balance); 
    //expect(balance).to.eq(sum);
     await expect(
      frontRunnerDemo.withdrawFunds("Wrong_secret")
    ).to.be.revertedWith("Incorrect secret string")
  }); */

});