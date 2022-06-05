const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

const { deployMockContract } = waffle;

describe("Marketplace", function () {
  this.timeout(50000);

  let marketplace, erc20;

  const product = {
    name: "Test Product",
    image: "https://example.com/image.png",
    description: "Test Product Description",
    location: "Test Product Location",
    price: 10,
  };

  async function addProduct() {
    const tx = await marketplace.writeProduct(product.name, product.image, product.description, product.location, product.price);
    await tx.wait();
  }

  async function getSoldUnits(productIndex) {
    // Read product
    const gotProduct = await marketplace.readProduct(productIndex);

    // Destructure product
    const [, , , , , , pSold] = gotProduct;

    // Return sold units
    return pSold;
  }

  this.beforeEach(async function () {
    const [deployer] = await ethers.getSigners();

    const ERC20 = require('../artifacts/contracts/Marketplace.sol/IERC20Token.json');
    erc20 = await deployMockContract(deployer, ERC20.abi);

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(erc20.address);
  });

  it("Should get count", async function () {
    expect(await marketplace.getProductsLength()).to.equal(0);
  });

  it("Should add product", async function () {
    await addProduct();

    // Check the total products
    expect(await marketplace.getProductsLength()).to.equal(1);
    
    // Check the product 'sold' field
    expect(await getSoldUnits(0)).to.equal(0);
  });

  it("Should get product", async function () {
    // Add product    
    await addProduct();

    // Read product
    const productIndex = 0;
    const gotProduct = await marketplace.readProduct(productIndex);

    // Destructure product
    const [pOwner, pName, pImage, pDesc, pLocation, pPrice] = gotProduct;

    // Check owner
    const [owner] = await ethers.getSigners();
    expect(pOwner).to.equal(owner.address);

    // Check other fields
    expect(pName).to.equal(product.name);
    expect(pImage).to.equal(product.image);
    expect(pDesc).to.equal(product.description);
    expect(pLocation).to.equal(product.location);
    expect(pPrice).to.equal(product.price);
  });

  it("Should buy product", async function () {
    // Add product
    await addProduct();

    const productIndex = 0;

    // Get initial product sold units
    const unitsSold = await getSoldUnits(productIndex);

    // Set the mock to fail all transfers
    await erc20.mock.transferFrom.returns(false);

    // Buy product and test for failure

    // Execute
    await expect(marketplace.buyProduct(productIndex)).to.be.revertedWith("Transfer failed.");

    // Check that the product was not sold
    await expect(await getSoldUnits(productIndex)).to.equal(unitsSold);

    // Set the mock to success all transfers
    await erc20.mock.transferFrom.returns(true);

    // Buy product and test for success
    const tx = await marketplace.buyProduct(productIndex);
    await tx.wait();

    // Check units sold
    expect(await getSoldUnits(productIndex)).to.equal(unitsSold + 1);
  });

  it("Should fail to buy a product if it doesn't exist", async function () {
    await expect(marketplace.buyProduct(0)).to.be.revertedWith("Product doesn't exist.");
  });
});
