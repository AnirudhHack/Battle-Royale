import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { useGlobalContext } from '../context';
import { CustomButton, CustomInput, GameLoad, PageHOC } from '../components';

const CreateBattle = () => {
  const { contract, gameData, battleName, setBattleName, setErrorMessage } = useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClick = async () => {
    if (battleName === '' || battleName.trim() === '') return null;

    try {
      await contract.createBattle(battleName);

      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}

      <div className="flex flex-col mb-5">
        <CustomInput
          label="Create Game"
          placeHolder="Enter Game name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Game"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>

        <br/>
        <label htmlFor="name" className="font-rajdhani font-semibold text-2xl text-white mb-3">Join Game</label>
        <CustomButton
          title="join Game"
          handleClick={() => navigate('/join-battle')}
          restStyles="mt-6"
        />

        <br/>
        <label htmlFor="name" className="font-rajdhani font-semibold text-2xl text-white mb-3">Game Asset powered by Wormhole</label>
        <CustomButton title="Game Asset" handleClick={() => navigate('/game-assets')} />
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>Create <br /> a new Game</>,
);
