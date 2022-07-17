import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

import { initializeAll, startGame } from "../../utils";

export const Contest = () => {
  const [isContestCreated, setContestCreated] = useState(false);
  const [balanceP1, setBalanceP1] = useState(null);
  const [balanceP2, setBalanceP2] = useState(null);

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    effect;
    return () => {
      cleanup;
    };
  }, [window?.ethereum?.selectedAddress]);

  const getBalance = async () => {
    window?.ethereum?.enable();
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const balance = await provider.getBalance(
      window?.ethereum?.selectedAddress
    );
    setBalanceP1(ethers.utils.formatEther(balance));
  };

  const handleSet = async (e) => {
    e.preventDefault();
    const accounts = await window?.ethereum.enable();
    const account = accounts[0];
    const gas = await SimpleContract.methods.set(number).estimateGas();
    const result = await SimpleContract.methods.set(number).send({
      from: account,
      gas,
    });
    console.log(result);
  };

  const activateSecond = async () => {
    window?.ethereum?.enable();
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const balance = await provider.getBalance(
      window?.ethereum?.selectedAddress
    );
    setBalanceP2(ethers.utils.formatEther(balance));
  };

  const createContest = () => {
    if (betAmount > firstPlayerBalance) {
      return "BetAmount should be less than or equal to Balance Amount";
    }

    // call-API to create contest & show this contest to player2
    startGame(window?.ethereum?.selectedAddress, 5);
    setContestCreated(true);
  };

  const joinContest = () => {
    if (betAmount >= balanceAmount) {
      return "You don't have adequate balance to join this contest";
    }
    // call-API to join contest & activate the Board/Game and don't allow the user to change these
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex" }} className="player-1">
        <p>{balanceP1}</p>
        <input type="number" name="player1-bet" />
        <button className="square" onClick={createContest}>
          Start Contest
        </button>
      </div>

      {isContestCreated && (
        <div className="player-2">
          <p>{balanceP2}</p>
          <input type="number" name="player1-bet" />
          <button className="square" onClick={joinContest}>
            Join Contest
          </button>
        </div>
      )}
    </div>
  );
};
