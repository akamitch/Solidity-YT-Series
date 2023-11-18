//TS tests by the @akamitch
//For lesson7 https://youtu.be/ZzK15vkO38c?si=OJt6-X2r9_DURK-v
import { loadFixture, ethers, expect } from "./setup";

describe("Demo", function() {
  async function deploy() {
    const [user1, user2] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Demo");
    const demo = await Factory.deploy();
    await demo.waitForDeployment();

    return { user1, user2, demo }
  }

  it("Demo should be deployed and to be properAddress", async function() {
    const { demo } = await loadFixture(deploy);

    expect(demo.target).to.be.properAddress;
  });

  it("Shound allow to send money via pay()", async function() {
    const { user1, user2, demo } = await loadFixture(deploy);

    const sum = 5000000000000000; // wei

    //console.log(await ethers.provider.getBalance(user2.address));
    const tx = await demo.connect(user2).pay({ value: sum });
    //console.log(await ethers.provider.getBalance(user2.address));

    const balance = await ethers.provider.getBalance(demo.target);
    expect(balance).to.eq(sum);
  });

  it("Shound allow to send money directly", async function() {
    const { user1, user2, demo } = await loadFixture(deploy);
    const sum = 5000000000000000; // wei
       // Send Ether to contract directly
       await user2.sendTransaction({
        to: demo.target,
        value: sum
      });

      // Check balance increased properly
    expect(await ethers.provider.getBalance(demo.target)).to.equal(sum); 
  });

  it("Check Paid event was emitted", async function() {
    const { user1, user2, demo } = await loadFixture(deploy);
    //call pay()
    const sum = 5000000000000000; // wei
    const tx = await demo.connect(user2).pay({ value: sum });

    // Check Paid event was emitted
    //const timestamp = await ethers.provider.getBlock(tx.blockNumber).timestamp

    const timestampAfter = (await ethers.provider.getBlock('latest')).timestamp;

    await expect(tx)
      .to.emit(demo, "Paid")
      .withArgs(user2.address, sum, timestampAfter);
  });

  it("Shound allow owner to withdraw funds", async function() {
    const { user1, user2, demo } = await loadFixture(deploy);
    //call pay()
    const sum = 5000000000000000; // wei
    const txPay = await demo.connect(user2).pay({ value: sum });
    const txWithdraw = await demo.connect(user1).withdraw(user1.address);
    // Check balance decreaced to 0
    expect(await ethers.provider.getBalance(demo.target)).to.equal(0);
  });

  it("Shound not allow other accounts to withdraw funds", async function() {
    const { user1, user2, demo } = await loadFixture(deploy);
    //call pay()
    const sum = 5000000000000000; // wei
    const txPay = await demo.connect(user2).pay({ value: sum });
    await expect(
      demo.connect(user2).withdraw(user1.address)
    ).to.be.revertedWith("you are not an owner!")
  });


 
});