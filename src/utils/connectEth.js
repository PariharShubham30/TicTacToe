import { ethers } from "ethers";

// JSON interfaces of Solidity contracts
import TicTacToeJSON from "../abis/TicTacToe.json";

const SMART_CONTRACT_ADDRESS = "0x38101190E32620D20BdD0F7F132F3c17BcA752F2";
const OWNER_ADDRESS = "0x1507954F9e6a6ca6D0592859A749a77c978aE948"; // Yet to be determined

export const initializeAll = () => {
  // initialize web3
  window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  new ethers.Contract(address, abi, provider)

  // abi and contract address from the JSON interface of the contract
  const { abi } = TicTacToeJSON;
  const address = SMART_CONTRACT_ADDRESS;
  console.log("contract address", address, " and abi\n", abi);

  // initialize the contract
  const signer = new ethers.VoidSigner(address, provider);

  const contract = new ethers.Contract(address, abi, signer);

  contract.connect(signer)

  const result = contract.startGame().send({ from: window.ethereum.selectedAddress, to: SMART_CONTRACT_ADDRESS, value: 5 })
  console.log(result)

  contract.connect(provider)

  let currentValue = await contract.getValue();
  console.log(currentValue)
  console.log("contract", contract, contract.provider, contract.signer);
  
  return contract;
};

const contract = initializeAll();

console.log('contract: ', contract.startGame())

export const startGame = (playerAddress, amount) => {
  try {
    console.log(contract);
    const result = contract
      .startGame()
      .send({ to: SMART_CONTRACT_ADDRESS, value: amount });
    console.log("Game Initiated", result);
    return result?.gameId;
  } catch (err) {
    console.log("Unable to initiate the game", err);
  }
};

export const acceptGame = async (gameId, playerAddress, amount) => {
  try {
    const result = await contract.methods
      .acceptGame(gameId)
      .send({ from: playerAddress, to: SMART_CONTRACT_ADDRESS }, [
        { value: amount },
      ]);
    console.log("Game Started");
    return result?.gameId;
  } catch (err) {
    console.log("Unable to start the game", err);
  }
};

export const gameEndedAsDraw = async (gameId) => {
  try {

    // Listener
    
    // Send Signed Transaction

    // create raw transaction
    // transction signing process
    // trans serialize
    // send transaction (different method)
    const result = await contract.methods
      .gameEndedAsDraw(gameId)
      .send({ from: OWNER_ADDRESS, to: SMART_CONTRACT_ADDRESS });
    console.log("Game Ended in a Draw");
    return result?.gameId;
  } catch (err) {
    console.log("Error", err);
  }
};

export const gameEndedAsWinner = async (gameId, winnerAddress) => {
  try {
    const result = await contract.methods
      .gameEndedAsWinner(gameId, winnerAddress)
      .send({ from: OWNER_ADDRESS, to: SMART_CONTRACT_ADDRESS });
    console.log("Game Ended");
    return result?.gameId;
  } catch (err) {
    console.log("Error", err);
  }
};
