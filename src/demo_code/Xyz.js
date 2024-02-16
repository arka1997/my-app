import { useState,React } from 'react';
const Xyz = () => {
    sumCalc(1,2, sum);
    sumCalc(3,4, (a,b) => {console.log(b - a)});
    setTimeout(mult, 2000);
}
const parentCall = (dataId) => {
    setTimeout(() => {console.log(dataId)}, 2000);
}
const sum = (a,b) => {
    console.log(a+b);
}
const mult = () => {
    console.log(10*10);
}
const sumCalc = (a,b,sumCallback) => {
    // Here "sumCallback" is initialized by passing a method to "sumCalc" method.
    //Then we simply call the callBackmethod with 2 parameters passed to us. 
    sumCallback(a,b);
}
//Synchronous way of Calling, where each method will be called at same time with timer of 2 sec
// parentCall(12);
// parentCall(23);
// parentCall(45);
export default Xyz;