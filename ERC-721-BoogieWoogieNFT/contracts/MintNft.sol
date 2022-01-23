// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BoogieWoogie is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
 
    uint256 public mintingCost = 0.01 ether;
    uint256 public MAX_LIMIT = 10000 ;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Boogie Woogie", "BW") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://abcd.com";
    }

    function safeMint(address to, string memory uri) public payable {
        require(totalSupply() < MAX_LIMIT,"Can't mint more");
        require(msg.value >= mintingCost,"Min gas cost is 0.01 ETH");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }


    function withdraw() public onlyOwner {
      require(address(this).balance > 0,"Insufficient balanc");
      payable(owner()).transfer(address(this).balance);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}