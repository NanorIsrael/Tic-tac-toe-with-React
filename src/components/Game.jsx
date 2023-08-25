import React, {useCallback, useEffect, useState} from 'react';
import Board from "./Board";

function Game(props) {
    const [history, setHistory] = useState(
        [{
            squares: Array(9).fill('')
        }]);
    const [takenSquares, setTakenSquares] = useState([]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    const [winner, setWinner] = useState(null);



    const assignSpace = useCallback(function (index, owner, newSquare, newHistory ) {
        takenSquares[index]= owner
        setTakenSquares(takenSquares)

        newSquare[index] = owner === 'X' ? '/x.png' : '/circle.png'

        setHistory(history.concat([{squares: newSquare}]));
        setStepNumber(newHistory.length)
        setXIsNext(prev => !prev);

    }, [history, takenSquares])

    const minMax = useCallback(function (board, depth, isMax) {
        const winningPlayer = calculateWinner(board);
        if (winningPlayer === 'X') return { score: 1 };
        if (winningPlayer === 'O') return { score: -1 };
        if (board.every(elem => elem !== '')) return { score: 0 };
    
        let bestScore = isMax ? -Infinity : Infinity;
        let bestMove = -1;
    
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = isMax ? 'X' : 'O';
                const score = minMax(board, depth + 1, !isMax).score;
                board[i] = '';
    
                if ((isMax && score > bestScore) || (!isMax && score < bestScore)) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
    
        return { score: bestScore, move: bestMove };
    }, [])
    

    const computerChoose = useCallback(function (newSquare, newHistory) {

        const bestMove = minMax(newSquare, 0, true); // Call the Minimax function
        // console.log(newSquare)

        console.log('the best move', bestMove)

        if (!calculateWinner(newSquare)) {
            assignSpace(bestMove.move, 'O', newSquare, newHistory);
        }
    }, [assignSpace, minMax]);
    
    useEffect(() => {

        const newHistory = history.slice(0, stepNumber + 1)
        const current = newHistory[newHistory.length - 1]

        const win = calculateWinner(current.squares)
        if (win ) {
            setWinner(win)
            win === '/x.png' ? alert('You won') : alert('You lost');
        }

    }, [stepNumber, history])

    useEffect(() => {

        const newHistory = history.slice(0, stepNumber + 1)
        const current = newHistory[newHistory.length - 1]

        const newSquare = current.squares.slice();

       if (!xIsNext) {
            computerChoose(newSquare, newHistory)
        }

    }, [ xIsNext, computerChoose, history, stepNumber])

    function jumpTo(step) {
        setStepNumber(step)
        setXIsNext((step % 2) === 0)
    }

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move # '+ move:
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        )
    })

    let squares = history[stepNumber].squares;

    function handleSquareClick(i) {

        const newHistory = history.slice(0, stepNumber + 1)
        const current = newHistory[newHistory.length - 1]

        const newSquare = current.squares.slice();

        if (calculateWinner(newSquare) || newSquare[i]){
            return;
        }
            assignSpace(i, 'X', newSquare, newHistory )
            computerChoose(newSquare, newHistory)

    }


    function calculateWinner(square) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for(let i=0; i<lines.length; i++) {
            const [a, b, c] = lines[i];
            if(square[a] && square[a] === square[b] && square[a] === square[c]){
                return square[a]
            }
        }
        return null;
    }

    function RenderStatus() {
        let status
        if(winner) {
            status = `Winner: ${winner==='/x.png' ? 'X' : 'O' }`;
        } else {
            status = `Next Player: ${xIsNext ? 'X': 'O'}`
        }

        return <h1>{status}</h1>;
    }

    function handleNewGame() {
        setHistory([{squares: Array(9).fill('')}])
        setStepNumber(0)
        setWinner(null);
        setXIsNext(winner === 'O');
    }

    return (
        <>
            <RenderStatus/>
            <Board
                squares={squares}
                handleSquareClick={(i) => handleSquareClick(i)}
            />
            { winner ?
                <button onClick={handleNewGame} className={'newGame-btn'}>New Game</button>
                :
                <ol>
                {moves}
                </ol>
            }
        </>
    );
}

export default Game;