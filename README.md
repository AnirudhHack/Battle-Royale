# Battle Royale

![image](https://github.com/user-attachments/assets/52c1dd0e-e728-4a76-ab58-899a56a71980)


Battle Royale is a multiplayer cross-chain card game where players use powerful cards to attack and defend. Each card has unique superpowers, and players can seamlessly transfer their game assets and progress between different blockchains using Wormhole. This ensures that your cards and game achievements are preserved no matter which blockchain you’re on. Engage in strategic battles and enjoy a unified experience across multiple ecosystems with ease. With Battle Royale, we're showcasing the transformative potential of Wormhole's cross-chain solutions in the gaming world.


## Game Deployment link (Play game at below link)
https://battle-royale-game.vercel.app/

## Working

Contracts:

## AssetTransferWormhole contract:
## Overview

**AssetTransferWormhole** is a smart contract designed to manage and transfer game assets across different blockchains using Wormhole's technology. This contract enables players to seamlessly sync their assets between chains, ensuring a consistent and unified gaming experience.

## Integration with Wormhole

### How Wormhole Enhances Cross-Chain Functionality

Wormhole's relayer service facilitates the transfer of data between different blockchain networks. In AssetTransferWormhole, Wormhole is integrated to handle cross-chain asset transfers, allowing users to move/sync their game assets between different chains efficiently and securely. Note that game assets are not removed from soure chain because game assets are just synced with destination chain meaning that player can use their game asset on both source and destination chain after using `syncCrossChainAsset` function.

### Key Functions

1. **Quote Cross-Chain Cost**
   - **Function:** `quoteCrossChainAsset`
   - **Purpose:** Estimates the cost of sending assets to a target blockchain using Wormhole. This cost is based on the target chain and the gas limit required for the transaction.
   - **Usage:** Players use this function to calculate the required funds before initiating an asset transfer.

2. **Synchronize Assets**
   - **Function:** `syncCrossChainAsset`
   - **Purpose:** Facilitates the transfer of assets from the current blockchain to a specified target chain. This function validates asset ownership, calculates the transfer cost, and uses Wormhole to send the asset data.
   - **Usage:** Players can send their assets to a different blockchain, ensuring their assets and progress are preserved.

3. **Receive Cross-Chain Messages**
   - **Function:** `receiveWormholeMessages`
   - **Purpose:** Handles incoming messages from Wormhole, decoding asset data and updating asset ownership on the current chain.
   - **Usage:** This function updates the contract state based on asset transfers received from other blockchains, ensuring that assets are accurately reflected in the player's inventory.

### How It Works

1. **Initiating a Transfer**
   - A player calls `syncCrossChainAsset`, specifying the target blockchain, recipient address, and asset IDs to be transferred.
   - The contract calculates the cost of the transfer using `quoteCrossChainAsset` and sends the required amount to Wormhole.
   - Wormhole’s relayer service handles the actual data transfer between chains.

2. **Receiving Assets**
   - On the target chain, the contract implements `receiveWormholeMessages` to process incoming asset transfer messages.
   - The contract decodes the asset data, updates the player’s asset inventory, and ensures the accurate synchronization of assets across chains.

### Benefits of Integration

- **Seamless Cross-Chain Transfers:** Wormhole enables players to transfer their assets effortlessly across different blockchain networks, enhancing the game's flexibility and user experience.
- **Security and Reliability:** Wormhole provides a secure and reliable mechanism for cross-chain communication, ensuring that asset transfers are executed accurately and securely.


## Game Rules

1. Equal Power Cancel: Cards with the same attack and defense points cancel each other out.

2. Health Deduction: The attack points of the attacking card reduce the opponent's health.

3. No Defense: If a player doesn’t defend, their health decreases by the attacker’s attack points.

4. Defense Calculation: If a player defends, the attacker’s effective damage is reduced by the defender’s defense points.

5. Mana Refill: Defending refills 3 Mana.

6. Mana Cost: Attacking uses 3 Mana.

