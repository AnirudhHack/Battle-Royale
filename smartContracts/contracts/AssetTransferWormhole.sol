// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./wormhole/IWormholeRelayer.sol";
import "./wormhole/IWormholeReceiver.sol";

contract AssetTransferWormhole is IWormholeReceiver {

    event AssetsTransfer(address sender, uint16 targetChain, address targetAddress, uint[] assetIds);

    IWormholeRelayer public immutable wormholeRelayer;
    address public owner;

    struct BattleAsset{
        uint id;
        string name;
        uint AssetType;
        uint price; // Price in wei
    }
    uint public assetCounter;
    mapping(uint => BattleAsset) public assets; // Mapping from asset ID to BattleAsset
    mapping(address=>uint[]) public playerAssetIds;
    mapping(address=>mapping(uint=> bool)) public playerAssetExist;

    function getAllAssetsOfPlayer(address _player)external view returns(uint[] memory){
        return playerAssetIds[_player];
    }

    constructor(address _wormholeRelayer, address _owner) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        owner = _owner;
    }

    function quoteCrossChainAsset(
        uint16 targetChain,
        uint256 gasLimit
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            gasLimit
        );
    }

    function syncCrossChainAsset(
        uint16 targetChain,
        address targetAddress,
        uint[] calldata _assetsIds,
        uint256 gasLimit
    ) public payable {
        uint256 cost = quoteCrossChainAsset(targetChain, gasLimit);
        require(msg.value == cost);
        for(uint i=0; i<_assetsIds.length; i++){
            if(!playerAssetExist[msg.sender][_assetsIds[i]]) revert("asset not found");
        }

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(encodeAssetIds(_assetsIds), msg.sender), 
            0, 
            gasLimit,
            targetChain,
            msg.sender
        );

        emit AssetsTransfer(msg.sender, targetChain, targetAddress, _assetsIds);
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32, // address that called 'sendPayloadToEvm'
        uint16 sourceChain,
        bytes32 // unique identifier of delivery
    ) public payable override {
        require(msg.sender == address(wormholeRelayer), "Only relayer allowed");

        // Parse the payload and do the corresponding actions!
        (bytes memory assetData, address sender) = abi.decode(
            payload,
            (bytes, address)
        );
        uint[] memory assets = _decodeAssetsIds(assetData);

        // sync the assets from source chain to current contract
        for(uint i = 0; i < assets.length; i++){
            if(!playerAssetExist[sender][assets[i]]){
                playerAssetExist[sender][assets[i]] = true;
                playerAssetIds[sender].push(assets[i]);
            }
        }

    }

    // Function for the owner to add a new asset
    function addAsset(string memory _name, uint _assetType, uint _price) public onlyOwner {
        require(_price > 0, "_price > 0");
        assets[assetCounter] = BattleAsset(assetCounter, _name, _assetType, _price);
        assetCounter++;
    }

    // Function to buy an asset
    function buyAsset(uint _assetId) public payable {
        require(_assetId < assetCounter, "Invalid AssetId");
        require(playerAssetExist[msg.sender][_assetId] == false, "player already have the Asset");
        BattleAsset memory asset = assets[_assetId];
        require(msg.value == asset.price, "Incorrect ETH amount sent");

        payable(owner).transfer(msg.value);
        
        // Register the asset to the buyer
        playerAssetExist[msg.sender][_assetId] = true;
        playerAssetIds[msg.sender].push(_assetId);

    }


    // Encode a dynamic-size array of uint256 with packed format
    function encodeAssetIds(uint256[] memory inputArray) private pure returns (bytes memory) {
        return abi.encodePacked(inputArray);
    }

    // Decode a packed dynamic-size array of uint256
    function _decodeAssetsIds(bytes memory encodedData) private pure returns (uint256[] memory) {
        uint256 length = encodedData.length / 32; // 32 bytes per uint256
        uint256[] memory decodedArray = new uint256[](length);
        for (uint i = 0; i < length; i++) {
            uint256 value;
            assembly {
                value := mload(add(encodedData, add(32, mul(i, 32))))
            }
            decodedArray[i] = value;
        }
        return decodedArray;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
}
