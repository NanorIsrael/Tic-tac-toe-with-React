import React from 'react';
import Square from "./Square";

function Board(props) {
    const {squares, handleSquareClick} = props

    function renderSquare(i) {
        return <Square key={i} value={squares[i]} handleSquareClick={() => handleSquareClick(i)}/>
    }

    return (

        <>
            <div className={'grid'}>
                {squares.map((v, i) => renderSquare(i))}
            </div>
        </>

    );
}

export default Board;