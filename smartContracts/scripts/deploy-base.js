// scripts/deploy.js

const { ethers } = require("hardhat");

async function main() {
  // Get the deployer's account
  const [deployer] = await ethers.getSigners();

  // // Replace these values with your actual Wormhole Relayer and owner addresses
  // const wormholeRelayerAddress = "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE";
  // const ownerAddress = deployer.address;

  // // Compile the contract
  // const AssetTransferWormhole = await ethers.getContractFactory("AssetTransferWormhole");

  // // Deploy the contract
  // const assetTransferWormhole = await AssetTransferWormhole.deploy(wormholeRelayerAddress, ownerAddress);
  // await assetTransferWormhole.deployed();

  // console.log("AssetTransferWormhole deployed to:", assetTransferWormhole.address);

  // // Add an asset
  // const tx = await assetTransferWormhole.connect(deployer).addAsset("Water", 0, ethers.utils.parseEther("0.000001")); // Example asset
  // await tx.wait();

  // console.log("Asset added");

  const Battleroyale = await ethers.getContractFactory("BattleRoyale");
  const _metadataUri = 'https://gateway.pinata.cloud/ipfs/https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';
  const battleroyale = await Battleroyale.deploy(_metadataUri);
  await battleroyale.deployed();
  console.log("battleroyale deployed to:", battleroyale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
