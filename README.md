# Promises in ES2015/ES6

Over the years developers have used multiple libraries to introduce support for promises into their projects. Each library came with different APIs that made it hard for developers to transition their projects to a different promise library. The [ES2015 language specification](http://www.ecma-international.org/ecma-262/6.0/) has introduced Promises as a first-class feature, thereby defining a standard API and eliminating the need for external dependencies.

## Callbacks
Most JavaScript developers have experienced the [pyramid of doom](http://callbackhell.com) with callbacks. Each callback having a side effect and calling the next callback can make the source code hard to read, write, and test.

The following example is designed to show the complexity involved with callbacks. The _generateGreeting_ method uses [_window.setTimeout_](http://www.w3schools.com/js/js_timing.asp) to create an asynchronous operation. The method takes a _name_, _callback_, and an optional _delay_. In the case that an invalid _delay_ was passed to _generateGreeting_, an Error will be passed to the callback. Otherwise, a greeting will be generated using the _name_ parameter and passed to the callback.   

```javascript
function generateGreeting (name, callback, delayMillis) {
  const delay = typeof delayMillis !== 'undefined' ?  delayMillis : 1000;

  if (delay > 1500) {
    callback(new Error('Invalid delay!'));
    return;
  }

  setTimeout(() => callback(null, `Hello ${name}!`), delay);
};

function callback(error, greeting) {
    if (error) {
      console.log(error.message);
    }
    else {
     console.log(greeting);
    }
};

generateGreeting('World', callback); // prints 'Hello World!'
generateGreeting('World', callback, 1501); // prints 'Invalid Delay!'
```

## Promises
A Promise is an object that represents an operation that has not completed. The sections below will develop a promise and demonstrate how promises can help asynchronous methods behave more like synchronous methods.


### Define Promise
The _Promise_ constructor takes a _resolve_ callback and _reject_ callback as parameters. The _resolve_ callback is called after a successful completion of the asynchronous operation. The results of the operations will be passed into the callback. The _reject_ callback is called after an error and the error passed into the callback.


The _generateGreeting_ method is similar to the previous example, but returns a Promise that wraps the asynchronous operation. After a specified delay, a greeting will be generated and passed to the _resolve_ callback. If an invalid delay is provided, the reject method will be called with an error message.

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

### Successful Promise
After the asynchronous operation has successfully been completed, the promise's _then_ method will be called with the results of the asynchronous operation.

In the following example, the _generateGreeting_ method is called with 'Foo'. After a delay, a greeting will be generated ('Hello Foo!') and passed to the promise's _then_ method.

```javascript
generateGreeting('Foo')
  .then((greeting) => console.log(greeting)); // prints 'Hello Foo!'
```

### Failed Promise
A failed asynchronous operation will call the promise's _catch_ with the reason for failure.

In the following example, the _generateGreeting_ method is called an invalid _delay_. The invalid _delay_ will cause the operation to fail and the promise's _catch_ method will be called with the reason 'Invalid Delay!'.

```javascript
const invalidDelay = 1501;

generateGreeting('Foo', invalidDelay)
  .catch((error) => console.log(error.message)); //prints 'Invalid Delay!'
```

### Chain Promises
The Promise API provides the ability to chain promises. The chaining of promises removes the pyramid of doom and reintroduces language fundamentals such as _return_ and _throw_.

In the following example, two _generateGreeting_ promises are chained together. Here the result of the first promise ('Hello Foo!') is passed to the next promise to generate a new greeting ('Hello Hello World!!'). After the last promise, the results will be printed to the console.

```javascript
generateGreeting('Foo')  // generates 'Hello Foo!'
  .then((greeting) => generateGreeting(greeting)) // generates 'Hello Hello Foo!!'
  .then((greeting) => console.log(greeting)); // prints 'Hello Hello Foo!!'
```

### Handling Multiple Promises
_Promise.all(iterable)_ will provide a promise for multiple promises. This aggregate promise will be resolved once all the child promises have been resolved or one of the child promises have been rejected. The resolved promise will be passed an array of results.

In the following example, multiple promises are passed to _Promise.all_. Once all the greeting promises are resolved, the greetings are passed as an array to the promise's _then_ method and logged to the console.

```javascript
const promise1 = generateGreeting('Foo');
const promise2 = generateGreeting('Bar');

Promise.all([promise1, promise2])
  .then((greetings) => {
    greetings.forEach((g) => console.log(g)); // prints 'Hello Foo!' and 'Hello Bar!'
  });
```

### Testing Promises
Testing asynchronous methods is often difficult. The tests can be cumbersome to write and read. However, tools such as  [Mocha](https://mochajs.org), [Chai](http://chaijs.com), and [Chai Assertions for Promises](https://github.com/domenic/chai-as-promised) make testing promises easier.

#### Setup
The following commands can be used to install the Mocha, Chai, and Chai Assertions for Promises into a project.

```
npm install mocha --save-dev
npm install chai --save-dev
npm install chai-as-promised --save-dev
```

A new spec is introduced to test the _generateGreeting_ method. The chai module and chai-as-promised modules are imported to support testing. The chai module is an assertion library to help facilitate testing. The chai-as-promised module is a chai plugin that adds support for testing promises.

```javascript
import * as chai from 'chai';
const expect = chai.expect;

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('ES2015 Promises', () => {
...
});
```

#### Test a Successful Promise
The test below verifies that the _generateGreeting_ method will return the expected greeting is 'Hello Foo!''.

It is important to note that the chai assertion returns a promise. This notifies the mocha test framework to wait until the promise under test has been resolved or has been rejected in order to complete the test.

```javascript
it('should provide a greeting', () => {
  // When
  const promise = generateGreeting('Foo');

  // Then
  return expect(promise).to.eventually.equal('Hello Foo!');
});
```

#### Test a Rejected Promise
The test below verifies that the _generateGreeting_ method will throw an error for an invalid delay. It is similar the previous test, but it ensures the promise was rejected with the 'Invalid delay!'.

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
It would be hard to come up with a reason not to use promises, instead of callback. Promises are easier to read, write, and test. However, a better way is coming soon. The [Async Functions](https://tc39.github.io/ecmascript-asyncawait/) proposal for ES7 will provide the ability to write asynchronous operations as if the methods were synchronous operations.

ES2015 made promises a first-class feature of the language. [Node](https://nodejs.org/en/) and most of the modern browsers support Promises. Unsurprisingly, Internet Explorer still does not provide support for promises even though the Edge browser does support Promises. If IE or legacy browsers need to be supported, a pollyfill or transpiler such as [Babel](https://babeljs.io) can been used to add support for Promises.

### Code Examples
The code examples can be found on [GitHub](https://github.com/seanking/es2015-promises). Please feel free to fork and improve the project. Thanks.
