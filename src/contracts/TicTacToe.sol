// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract TicTacToe {
    address owner;

    address payable thisContract = payable(address(this));

    enum states {NOTINITIATED, INITIATED, STARTED, FINISHED}

    uint256 gameCounter = 0;

    struct game {
        uint256 gameId;
        states state;
        address player1;
        address player2;
        uint256 betAmount;
    }

    mapping(uint256 => game) games;

    event gameStarted(uint256 gameId);
    event gameCreated(uint256 gameId, address player, uint256 value);
    event gameDrawn(uint256 gameId);
    event gameWon(uint256 gameId, address player, uint256 value);

    constructor() {
        owner = msg.sender;
    }

    function startGame() public payable {
        address player = msg.sender;
        uint256 amount = msg.value;

        games[gameCounter] = game(
            gameCounter + 1,
            states.INITIATED,
            player,
            address(0),
            amount
        );

        gameCounter++;

        thisContract.transfer(amount);

        emit gameCreated(gameCounter, player, amount);
    }

    function acceptGame(uint256 gameId) public payable {
        game memory g = games[gameId];

        address player = msg.sender;
        uint256 amount = msg.value;

        require(g.state == states.INITIATED, "Not initiated");
        require(g.player2 == address(0), "Not zero address");
        require(g.player1 != player, "Equal");
        require(g.betAmount == amount, "Not equal");

        games[gameId].state = states.STARTED;
        games[gameId].player2 = player;

        thisContract.transfer(amount);

        emit gameStarted(gameId);
    }

    function gameEndedAsDraw(uint256 gameId) public payable {
        game memory g = games[gameId];

        require(msg.sender == owner, "Not an Owner");
        require(g.state == states.STARTED, "Game not Started");
        require(g.player2 != address(0), "Invalid Player1");
        require(g.player1 != address(0), "Invalid Player2");

        // transfer money to both the accounts
        payable(address(g.player1)).transfer(g.betAmount);
        payable(address(g.player2)).transfer(g.betAmount);

        games[gameId].state = states.FINISHED;

        emit gameDrawn(gameId);
    }

    function gameEndedAsWinner(uint256 gameId, address player) public payable {
        game memory g = games[gameId];

        require(msg.sender == owner, "Not an Owner");
        require(g.state == states.STARTED, "Game not Started");
        require(g.player2 != address(0), "Invalid Player1");
        require(g.player1 != address(0), "Invalid Player2");
        require(
            player != address(0) &&
                (player == g.player1 || player == g.player2),
            "Invalid User"
        );

        // transfer money to the winner
        payable(address(player)).transfer(g.betAmount * 2);

        games[gameId].state = states.FINISHED;

        emit gameWon(gameId, player, g.betAmount);
    }
}
