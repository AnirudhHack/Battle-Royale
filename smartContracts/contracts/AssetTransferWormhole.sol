// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./wormhole/IWormholeRelayer.sol";
import "./wormhole/IWormholeReceiver.sol";

contract AssetTransferWormhole is IWormholeReceiver {
    struct BattleAssets{
        uint id;
        string name;
        uint AssetType;
    }

    event GreetingReceived(string greeting, uint16 senderChain, address sender);

    uint256 constant GAS_LIMIT = 50_000;

    IWormholeRelayer public immutable wormholeRelayer;

    string public latestGreeting;

    constructor(address _wormholeRelayer) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    function quoteCrossChainAsset(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }

    function sendCrossChainAsset(
        uint16 targetChain,
        address targetAddress,
        uint[] calldata _assets
    ) public payable {
        uint256 cost = quoteCrossChainAsset(targetChain);
        require(msg.value == cost);
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(encodeAssetIds(_assets), msg.sender), 
            0, 
            GAS_LIMIT
        );
    }

    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory, // additionalVaas
        bytes32, // address that called 'sendPayloadToEvm' (HelloWormhole contract address)
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

        emit GreetingReceived(latestGreeting, sourceChain, sender);
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
}
