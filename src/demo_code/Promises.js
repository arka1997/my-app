import { useState,React } from 'react';
// Promise is an empty Object.
// Initially the object will have {data: undefined value}. But after execution of the method inside Promise, the data will be returned, and this Promise object will be filled with the data returned from method.
// In Prmoises we have a method which will be executed. Then with Promise we are attaching another method to it using .then().
// Also Promises keeps the control to JS itself, and not to external 3rd party apis like createOrder(). 
const Promises = () => {
    // But in callbacks we use to pass the methods as ArgumentList. And the first method used to decide whether and to execute the next methods send to it. But Promises is a secutiry officer, checking and executing each series of methods. 
    const GITHUB_API = "https://api.github.com/users/arka1997";
    const GITHUB_API2 = "https://api.github.com/repos/arka1997/my-app/";
    const promise = fetch(GITHUB_API);
    // When we call fetch() it starts the API call and returns a promise immediately.
    // While the API call is in progress, the promise is in a pending state, and the console logs "Promise Status: [Pending]".
    // After the API call is complete, the promise is resolved, then its status changes to "Promise Status: [fulfilled]".
    //This happens becasue of JS's async nature. It prints first, while the api is till fetching.
    console.log(promise);
    //Now this Promise inconsistent data can be corrected, by using then, until th first fetching is not complete, the second step wont be executed.
    promise.then(console.log(promise));
}


export default Promises;