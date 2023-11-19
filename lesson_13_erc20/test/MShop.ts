import { loadFixture, ethers, expect } from "./setup";
import tokenJSON from "../artifacts/contracts/Erc.sol/MCSToken.json";

describe("MShop", function() {

  async function deploy() {
    const [owner, buyer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("MShop");
    const shop = await Factory.deploy();
    await shop.waitForDeployment();
    const erc20 = new ethers.Contract(await shop.token(), tokenJSON.abi, owner)
    
    return { owner, buyer, shop, erc20 }
  }

  it("should be deployed", async function() {
    const { owner, buyer, shop } = await loadFixture(deploy);

    expect(shop.target).to.be.properAddress;
  });

  it("should have an owner and a token", async function() {
    const { owner, buyer, shop } = await loadFixture(deploy);
    expect(await shop.owner()).to.eq(owner.address)

    expect(await shop.token()).to.be.properAddress
  })

  it("should have 0 ethers by default", async function() {
    const { owner, buyer, shop } = await loadFixture(deploy);
    const balance = await ethers.provider.getBalance(shop.target);
    
  });

  it("should have 20 tokens by default", async function() {
    const { owner, buyer, shop } = await loadFixture(deploy);
    const token = await shop.token;
    
    expect(await shop.tokenBalance()).to.eq(20);
   
  });

  it("Shound allow to send money directly", async function() {
    const { owner, buyer, shop } = await loadFixture(deploy);
    const sum = 5; // wei
       // Send Ether to contract directly
       await buyer.sendTransaction({
        to: shop.target,
        value: sum
      });

      // Check balance increased properly
    expect(await ethers.provider.getBalance(shop.target)).to.equal(sum); 
  });

  it("Token: allows to buy", async function() {
    const { owner, buyer, shop, erc20 } = await loadFixture(deploy);
    const tokenAmount = 3

    const txData = {
      value: tokenAmount,
      to: shop.target
    }

    const tx = await buyer.sendTransaction(txData)
    await tx.wait()

    await expect(() => tx).
      to.changeEtherBalance(shop, tokenAmount)

    await expect(tx)
      .to.emit(shop, "Bought")
      .withArgs(tokenAmount, buyer.address)
  })

  it("Token: byer receivs token", async function() {
    const { owner, buyer, shop, erc20 } = await loadFixture(deploy);
    const tokenAmount = 3

    const txData = {
      value: tokenAmount,
      to: shop.target
    }

    const tx = await buyer.sendTransaction(txData)
    await tx.wait()

    expect(await erc20.balanceOf(buyer.address)).to.eq(tokenAmount)
  })

  it("Token: allows to sell", async function() {
    const { owner, buyer, shop, erc20 } = await loadFixture(deploy);
    const tx = await buyer.sendTransaction({
      value: 3,
      to: shop.target
    })
    await tx.wait()

    const sellAmount = 2

    const approval = await erc20.connect(buyer).approve(shop.target, sellAmount)

    await approval.wait()

    const sellTx = await shop.connect(buyer).sell(sellAmount)

    expect(await erc20.balanceOf(buyer.address)).to.eq(1)

    await expect(() => sellTx).
      to.changeEtherBalance(shop, -sellAmount)

    await expect(sellTx)
      .to.emit(shop, "Sold")
      .withArgs(sellAmount, buyer.address)
  })

});