
Drafting... 



# Promises in ES2015/ES6

JavaScript uses an event-driven architecture to support its single thread event loop. The single thread event loop
  requires that long running tasks be preformed asynchronously to prevent blocking the event loop. Asynchronous calls
  allow for events on the queue to be handled, instead of being blocked. Callbacks are passed into asynchronous events to 
  handle the results (success or failure) of an asynchronous operateion.

The ES2015 language specification has introduced promises as a first-class feature. The API is based on the 
 [Promises/A+](https://promisesaplus.com) proposal. The following examples cover how to turn hard to read callbacks in
 easy to ready promises.

  
## Callbacks
Callbacks are used to support asynchronous methods in JavaScript. The following example creates an asynchronous method
 by using _window.setTimeout(func, [delay, param1, param2, ...])_. The _generateGreeting_ method takes a _name_ for the
 greeting and a _callback_ function to handle the generated greeting. 

```javascript
function generateGreeting (name, callback) {
  const delay = 1000;
  setTimeout(() => callback(`Hello ${name}!`), delay);
};

function printGreetingCallback(greeting) {
    console.log(greeting);
};

generateGreeting('World', printGreetingCallback); // prints 'Hello World!'
```

## Promises
As defined by MDN, "A Promise represents a operation that hasn't complete, but is expected to in the future." 

A promise can be in three states:
* Pending: the asynchronous operations hasn't completed yet
* Fulfilled: the asynchronous operation has completed and the promise has a value 
* Rejected: the asynchronous operation has failed and the promise has a reason the operation has failed
    
### Define Promise
The _generateGreeting_ method below is similar to the previous callback example but wraps it in a promise. A promise
  takes a resolve and reject parameter. The _resolve_ method should be called on fulfillment of the asynchronous call. 
  The _reject_ method should be called with a reason for any failures.
  
```javascript
function generateGreeting(name, delay = 1000) {
  return new Promise((resolve, reject) => {
    if (delay > 1500) {
      reject(new Error('Invalid delay!'));
    }

    setTimeout(() => resolve(`Hello ${name}!`), delay);
  });
}
```
     
### Fulfilled Promise
A fulfilled promise means the operation has been completed successfully. The results of the operation will be passed to 
the promise's _then_ method. 

In the following example, the _generateGreeting_ method is called with 'Foo'. After a delay, the promise is fulfilled 
    and the greeting is passed to the promise's _then_ method. 

```javascript
generateGreeting('Foo')
  .then((greeting) => console.log(greeting)); // prints 'Hello Foo!'
```

### Rejected Promise
A rejected promise means the operation has failed. The reason for failure will be passed to the promise's catch method.

In the following example, the _generateGreeting_ method is called an invalid delay. The invalid delay will cause the 
 operation to fail and the promise's _catch_ method be called with a reason. 
 
```javascript
const invalidDelay = 1501;

generateGreeting('Foo', invalidDelay)
  .catch((error) => console.log(error.message)); //prints 'Invalid Delay!'
```

### Handling Multiple Promises
_Promise.all(iterable)_ will provide a promise for all the iterable promises. The promise will be resolved once all the
 arguments have been resolved or one of the arguments have been rejected. The resolved promise will be passed an array 
 of results.

In the following example, multiple promises are passed to _Promise.all_. Once all the greeting promises are resolved, 
 the generated greeting are passed as an array to the promise's _then_ method. 

```javascript
const promise1 = generateGreeting('Foo');
const promise2 = generateGreeting('Bar');

Promise.all([promise1, promise2])
  .then((greetings) => {
    greetings.forEach((g) => console.log(g)); // prints 'Hello Foo!' and 'Hello Bar!'
  });
```

### Testing Promises
Testing asynchronous methods is often complicated. Not only can they be hard to write, but they can also be difficult to
    read. However, thanks to [Mocha](https://mochajs.org), [Chai](http://chaijs.com), and [Chai Assertions for Promises](https://github.com/domenic/chai-as-promised) testing promises are easy.
  
Chai-as-promise extends the Chai fluent language to support testing promises. This is important  
   
#### Setup
The following commands can be used to install the mocha, chai, and chai-as-promissed 
```
npm install mocha --save-dev
npm install chai --save-dev
npm install chai-as-promised --save-dev
```

Introduce a mocha test and import the following requirements.  Update chai to use the chai-as-promised plugin. This
plugin will simply the testing of promises. 

```javascript
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('ES2015 Promises', () => {
...
});

```

#### Fulfilled Promise
The following example verifies the promise resolves with a 'Hello Foo!' greeting. 

```javascript
it('should provide a greeting', () => {
  // When
  const promise = generateGreeting('Foo');

  // Then
  return expect(promise).to.eventually.equal('Hello Foo!');
});
```

#### Rejected Promise
The following example verifies the promise was rejected because of an invalid delay. 

```javascript
it('should handle invalid delay', () => {
  // Given
  const invalidDelay = 1501;

  // When
  const promise = generateGreeting('Foo', invalidDelay);

  // Then
  return expect(promise).to.eventually.rejectedWith('Invalid delay!');
});
```

## Conclusion