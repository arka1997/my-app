import { useState,React } from 'react';

const Counter = () => {
    
    const[index, setIndex] = useState(1)

    function handleIndex(){
        setIndex(index + 1);
    }

    return (
        <div className="wrapper">
            <button onClick={handleIndex} className="btn btn-success btn-md2"> You pressed button <div className="alert alert-info">{index}</div> times</button>
        </div>
    );
};
export default Counter;