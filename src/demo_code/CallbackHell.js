import { useState,React } from 'react';
/** Now call back hell are basically used to perform operations, we don't want to do a task parallely. Rather, we want it to execute one after another
    The purpose of using callbacks in this way is to allow you to execute code asynchronously, especially when dealing with operations that may take some time to complete, such as asynchronous I/O operations, API calls, etc. By passing a callback, you're specifying what should happen next after the current operation is finished.
    Advantages:
    Here we can pass different functional methods as arguments in some other main methods. And make it execute. one method after another.
    Disadvantages
CallBack Hell: Here we are giving contol to createOrder method, which will execute payments related things. Which is bad way, because we cannot trust some other methof, and what if it createOrder() is some 3rd party which we are using to execute our payments section. Callbacks are bad in this way. Also it creates a complex view, with mya be problems, becasue of which the rest methods will be affected.
*/
function CallbackHell() {
    createOrder(() => {
        proceedToPayment(100,() => {
            sendReceipt(() => {
                createOrder(() => {
                    // Additional logic if needed
                });
            });
        });
    });
}
function zepto(dataIds, nextCallaback) {
    setTimeout(() => {
        //First we retirve the value of first data
        console.log("datad",dataIds);
        if(nextCallaback){
            //Then we call the callback method that passed in the param 
            nextCallaback();
        }
    }, 2000);
}
function createOrder(callback){
    console.log("Order is Placed");
    callback();
}
function proceedToPayment(amount,callback){
    console.log("Payment is Done: Rs " + amount);
    callback();
}
function sendReceipt(callback){
    console.log("Bill is shown");
    callback();
}
CallbackHell(1, CallbackHell(2));// This is a wrong way to write call back by simply passing a normal function in 2nd Param, rather use arrow function
    zepto(1, () => {
        zepto(2);
    });
export default CallbackHell;