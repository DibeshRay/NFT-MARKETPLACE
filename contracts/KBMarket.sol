// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//importing openzeppelin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KBMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _tokenSold;

    address payable owner;

    uint listingPrice = 0.045 ether;

    event MarketTokenMinted(
        uint indexed ItemId,
        address indexed nftContract,
        uint  tokenId,
        address owner,
        address seller,
        uint price,
        bool sold
    );

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketToken{
        uint itemId;
        address nftContract;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    //it will map MarketToken by tokenId
    mapping(uint => MarketToken) private idToTokenItem;

    //get Listing Price
    function getListingPrice() public view returns(uint){
        return listingPrice;
    }

    //Function that will put item on seller

    function mintMarketItem(address nftContract, uint price, uint tokenId) public payable nonReentrant{
        require(price >0 , "price should be atleast one wei");
        require(msg.value == listingPrice, "Price must be equal to listingprice");

        _tokenIds.increment();
        uint newItemId = _tokenIds.current();

        idToTokenItem[newItemId] = MarketToken(
            newItemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        //NFT Transaction
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketTokenMinted( 
            newItemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false            
        );
    }


    function createMarketSale(address nftContract, uint itemId) public payable nonReentrant{
        uint price = idToTokenItem[itemId].price;
        uint tokenId = idToTokenItem[itemId].tokenId;
        require(msg.value == price, "Please submit price in order to continue.");

        //transfer the amout to sellers
        idToTokenItem[itemId].seller.transfer(msg.value);

        //transfer the token from contract to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToTokenItem[itemId].owner = payable(msg.sender);
        idToTokenItem[itemId].sold = true;
        _tokenSold.increment();
        payable(owner).transfer(listingPrice);

    }

    //Fetching the MarketToken
    function fetchMarketToken() public view returns(MarketToken[] memory){
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount  = _tokenIds.current() - _tokenSold.current();
        uint currentIndex = 0;

        MarketToken[] memory item  = new MarketToken[](unsoldItemCount);
        for(uint i =0; i<itemCount; i++){
            if(idToTokenItem[i+1].owner == address(0)){
                uint currentId = i+1;
                MarketToken storage currentItem = idToTokenItem[currentId];
                item[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return item;
    }

    function MyNFTS () public view returns (MarketToken[] memory){
        uint totalItem = _tokenIds.current();
        uint  itemCount = 0;
        uint currentIndex = 0;
        
        for(uint i =0; i<totalItem; i++){
            if(idToTokenItem[i+1].owner ==msg.sender){
                itemCount++;
            }
        }

        MarketToken[] memory items = new MarketToken[](itemCount);
        for(uint i =0; i<totalItem; i++){

            if(idToTokenItem[i+1].owner ==msg.sender){
                uint currentId = i+1;
                MarketToken storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function fetchItemCreated() public view returns(MarketToken[] memory){
        uint totalItem = _tokenIds.current();
        uint  itemCount = 0;
        uint currentIndex = 0;
        
        for(uint i =0; i<totalItem; i++){
            if(idToTokenItem[i+1].seller ==msg.sender){
                itemCount++;
            }
        }

        MarketToken[] memory items = new MarketToken[](itemCount);
        for(uint i =0; i<totalItem; i++){

            if(idToTokenItem[i+1].seller ==msg.sender){
                uint currentId = i+1;
                MarketToken storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;      
    }



}