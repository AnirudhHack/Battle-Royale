import { ethers } from 'hardhat';
import console from 'console';

const _metadataUri = 'https://gateway.pinata.cloud/ipfs/https://gateway.pinata.cloud/ipfs/';

async function deploy(name: string, ...params: [string]) {
  const contractFactory = await ethers.getContractFactory(name);

  return await contractFactory.deploy(...params).then((f) => f.deployed());
}

async function main() {
  const [admin] = await ethers.getSigners();

  const BattleRoyale = (await deploy('BattleRoyale', _metadataUri)).connect(admin);

  console.log({ BattleRoyale: BattleRoyale.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
