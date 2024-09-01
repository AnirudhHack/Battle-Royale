import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { Alert, CustomButton } from '../components';
import { f2, f3, f4 ,f5 } from '../assets';
import { useGlobalContext } from '../context';
import { WORMHOLEASSETADDRESSBASE, WORMHOLEASSETADDRESSARBITRUM } from '../contract';
import { ethers } from 'ethers';
const allAssets = [
  {
    id: 0,
    name:"Water", 
    type:0,
    price: "1000000000000",
    isOwned: false
  },
  
  {
    id: 0,
    name:"Fire", 
    type:0,
    price: "1000000000000",
    isOwned: false
  },
  
  {
    id: 0,
    name:"Thunder", 
    type:0,
    price: "1000000000000",
    isOwned: false
  },
  
  {
    id: 0,
    name:"Wind", 
    type:0,
    price: "1000000000000",
    isOwned: false
  }
]

function isEthereum() {
  if (window.ethereum) {
    return true;
  }
  return false;
}

function getChainID() {
  if (isEthereum()) {
    return parseInt(window.ethereum.chainId, 16);
  }
  return 0;
}


const BuyTransferCards = () => {
  const [myAssets, setMyAssets] = useState([
    {
      id: 0,
      name:"Water", 
      type:0,
      price: "1000000000000",
      isOwned: false,
      img: f5
    },
    {
      id: 0,
      name:"Fire", 
      type:0,
      price: "1000000000000",
      isOwned: false,
      img: f2
    },
    {
      id: 0,
      name:"Thunder", 
      type:0,
      price: "1000000000000",
      isOwned: false,
      img: f4
    },
    {
      id: 0,
      name:"Magic", 
      type:0,
      price: "1000000000000",
      isOwned: false,
      img: f3
    }
  ]);
  const navigate = useNavigate();
  const { setBattleGround, setShowAlert, showAlert, wormholeAssetContract, walletAddress, wormholeAssetContractGetter } = useGlobalContext();

  const handleBattleChoice = (ground) => {
    setBattleGround(ground.id);

    localStorage.setItem('battleground', ground.id);

    setShowAlert({ status: true, type: 'info', message: `${ground.name} is battle ready!` });

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const handleBuy = async () => {

    try {
      await wormholeAssetContract.buyAsset(0, {value: "1000000000000"});

    } catch (error) {
      // setErrorMessage(error);
    }
  };

  const handleSendVaiWormHole = async (id) => {

    try {
      let targetChain = 10004 // base sepolia
      let targetAddress = WORMHOLEASSETADDRESSBASE
      const currentChainId= getChainID()
      if(currentChainId == 84532){
        targetChain = 10003 // arbitrum sepolia
        targetAddress = WORMHOLEASSETADDRESSARBITRUM
      }

      const gasLimit = 400000
      
      const cost = await wormholeAssetContract.quoteCrossChainAsset(targetChain, gasLimit)
      console.log("chainid ", targetChain,
        targetAddress,
        [id],cost)

      

      await wormholeAssetContract.syncCrossChainAsset(
        targetChain,
        targetAddress,
        [id],
        gasLimit,
        {value: cost.toString()}
      );

    } catch (error) {
      // setErrorMessage(error);
    }
  };

  useEffect(() => {
    // Define the interval function
    const fetchAssets = () => {
      getMyAssets();
    };

    // Call it initially
    fetchAssets();

    // Set up the interval
    const intervalId = setInterval(fetchAssets, 2000); // 2000 milliseconds = 2 seconds

    // Clean up interval on component unmount or walletAddress change
    return () => clearInterval(intervalId);
  }, [walletAddress]); // Dependency array includes walletAddress

  const getMyAssets = async () => {

    try {
      
      console.log("1 ")
      let assets = await wormholeAssetContractGetter.getAllAssetsOfPlayer(walletAddress);
      console.log("2 ")
      assets = assets.map(item => item.toString())
      let newAssets = allAssets
      
      for(const item of assets){
        newAssets[parseInt(item)].isOwned = true
      }
      console.log("assets ", newAssets, assets)
      setMyAssets(newAssets)
    } catch (error) {
      // setErrorMessage(error);
      return []
    }
  };

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
      {showAlert.status && <Alert type={showAlert.type} message={showAlert.message} />}

      <h1 className={`${styles.headText} text-center`}>
        Game Assets powered by Wormhole
      </h1>

      <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
        {myAssets.map((ground, index) => (
          <div>
            <div
              key={ground.id}
              // className={`${styles.flexCenter} ${styles.battleGroundCard}`}
              style={{marginRight:"40px", }}
            >
              <img src={ground.img} alt="saiman"  />

              {/* <div className="info absolute">
                <p className={styles.battleGroundCardText}>{ground.name}</p>
              </div> */}
              
            </div>
            <div style={{display:"flex", justifyContent:'center', alignItems:'center', marginTop:'10px' }}>

            {
              myAssets[index].isOwned ? 
                (
                  getChainID() == 84532 ? 
                  
                    <CustomButton title="Transfer to Arbitrum" handleClick={()=>handleSendVaiWormHole(index)} />
                  :
                    <CustomButton title="Transfer to Base" handleClick={()=>handleSendVaiWormHole(index)} />
  
                )
              :
              <div >
                <label  style={{ marginTop:'10px', marginRight:"5px" }}htmlFor="name" className="font-rajdhani font-semibold text-2xl text-white mb-3">{ethers.utils.formatEther(myAssets[index].price)} {" ETH"}</label>
                <CustomButton title="Buy" handleClick={handleBuy} />
              </div>
            }
            </div>
            {/* <CustomButton title="Buy"  /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyTransferCards;