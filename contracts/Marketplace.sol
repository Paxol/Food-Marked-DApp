// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Marketplace {
    // How many products there are in the marketplace, initialiy 0
    uint internal productsLength = 0;

    // Address of the cUSD stablecoin
    address internal tokenAddress;

    // The representation of the product
    struct Product {
        address payable owner; // The owner who will recive the cUSD per each product sold
        string name;
        string image; // An image of the product
        string description;
        string location;
        uint price; // The price in cUSD
        uint sold; // How many products where sold
    }

    // Where the products will be stored
    mapping (uint => Product) internal products;

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    // Function to add a product
    function writeProduct(
        string memory _name,
        string memory _image,
        string memory _description, 
        string memory _location, 
        uint _price
    ) public {
        uint _sold = 0;

        products[productsLength] = Product(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            _sold
        );

        productsLength++;
    }

    // Function to receive the product infos
    function readProduct(uint _index) public view returns (
        address payable,
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        uint, 
        uint
    ) {
        return (
            products[_index].owner,
            products[_index].name,
            products[_index].image,
            products[_index].description,
            products[_index].location,
            products[_index].price,
            products[_index].sold
        );
    }

    // Function to buy a product
    function buyProduct(uint _index) public payable {
        require(products[_index].owner != address(0), "Product doesn't exist.");

        require(
            // Transfer the cUSD from the buyer to the seller
            IERC20Token(tokenAddress).transferFrom(
                msg.sender,
                products[_index].owner,
                products[_index].price
            ),
            "Transfer failed." // Error message, probably the sender doesn't have enougth cUSD or the allowance for the contract is too low
        );

        // If the money where transfered we increase the product sold counter
        products[_index].sold++;
    }
    
    // Function to get how many products 
    function getProductsLength() public view returns (uint) {
        return (productsLength);
    }
}