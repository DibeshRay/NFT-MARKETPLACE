// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//importing openzeppelin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract  NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //Counters will allow to keep track of tokenId

    address contractAddress;

    //contructor will set address of marketplace 
    constructor(address _marketPlaceAddress) ERC721("KryptoBirdz" , "KBIRDZ"){
        contractAddress = _marketPlaceAddress;
    }

    //Function that will mint the token  and it will return id of token
    function mintToken(string memory tokenURI) public returns(uint){
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        //Setting the token URI
        _setTokenURI(newItemId, tokenURI);
        //giving approvement to marketplace to transact between user
        setApprovalForAll(contractAddress , true);
        return newItemId;

    }
}