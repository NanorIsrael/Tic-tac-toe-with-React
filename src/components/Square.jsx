import React from 'react';

function Square(props) {
    return (
        <button className={'square'} onClick={props.handleSquareClick}>
        <img src={props.value} alt={''}/>
        </button>
    );
}

export default Square;