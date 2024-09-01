import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';

import { GetParams } from '../utils/onboard.js';
import { ABI, ADDRESS, wormHoleAssetabi, WORMHOLEASSETADDRESSBASE, WORMHOLEASSETADDRESSARBITRUM } from '../contract';
import { createEventListeners } from './createEventListeners';

const GlobalContext = createContext();
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
export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [battleGround, setBattleGround] = useState('bg-panight');
  const [contract, setContract] = useState(null);
  const [wormholeAssetContractGetter, setWormholeAssetContractGetter] = useState(null);
  const [wormholeAssetContract, setWormholeAssetContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [step, setStep] = useState(1);
  const [gameData, setGameData] = useState({ players: [], pendingBattles: [], activeBattle: null });
  const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' });
  const [battleName, setBattleName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [updateGameData, setUpdateGameData] = useState(0);

  const player1Ref = useRef();
  const player2Ref = useRef();

  const navigate = useNavigate();

  //* Set battleground to local storage
  useEffect(() => {
    const isBattleground = localStorage.getItem('battleground');

    if (isBattleground) {
      setBattleGround(isBattleground);
    } else {
      localStorage.setItem('battleground', battleGround);
    }
  }, []);

  //* Reset web3 onboarding modal params
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();

      setStep(currentStep.step);
    };

    resetParams();

    window?.ethereum?.on('chainChanged', () => resetParams());
    window?.ethereum?.on('accountsChanged', () => resetParams());
  }, []);

  //* Set the wallet address to the state
  const updateCurrentWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({ method: 'eth_requestAccounts' });

    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress);
  }, []);

  //* Set the smart contract and provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);
      const conAddress = getChainID() == 84532 ? WORMHOLEASSETADDRESSBASE : WORMHOLEASSETADDRESSARBITRUM
      const wormholeAssetContract = new ethers.Contract(conAddress, wormHoleAssetabi, signer);
      const wormholeAssetContractGetter = new ethers.Contract(conAddress, wormHoleAssetabi, newProvider);

      setProvider(newProvider);
      setContract(newContract);
      setWormholeAssetContract(wormholeAssetContract)
      setWormholeAssetContractGetter(wormholeAssetContractGetter)
    };

    setSmartContractAndProvider();
  }, []);

  //* Activate event listeners for the smart contract
  useEffect(() => {
    if (step === -1 && contract) {
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setShowAlert,
        player1Ref,
        player2Ref,
        setUpdateGameData,
      });
    }
  }, [step]);

  //* Set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      if (contract) {
        const fetchedBattles = await contract.getAllBattles();
        const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0);
        let activeBattle = null;

        fetchedBattles.forEach((battle) => {
          if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())) {
            if (battle.winner.startsWith('0x00')) {
              activeBattle = battle;
            }
          }
        });

        setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
      }
    };

    fetchGameData();
  }, [contract, updateGameData]);

  //* Handle alerts
  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length).slice(0, -1);

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: 'failure',
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  return (
    <GlobalContext.Provider
      value={{
        player1Ref,
        player2Ref,
        battleGround,
        setBattleGround,
        contract,
        gameData,
        walletAddress,
        updateCurrentWalletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        errorMessage,
        setErrorMessage,
        wormholeAssetContract,
        wormholeAssetContractGetter
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
