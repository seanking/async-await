# Promises in ES2015 

JavaScript uses a single threaded event loop. This requires that any long running processes be executed asynchronously in
 order to not block the event queue.

## Callbacks 

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
As defined by MDN, "A Promise represents a operation that hasn't complete, but is expected to in the future".
    
### Define 

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
```javascript
generateGreeting('Foo')
  .then((greeting) => console.log(greeting)); // prints 'Hello Foo!'
```

### Rejected Promise
```javascript
const invalidDelay = 1501;

generateGreeting('Foo', invalidDelay)
  .catch((error) => console.log(error.message)); //prints 'Invalid Delay!'
```

### Handling Multiple Promises
```javascript
const promise1 = generateGreeting('Foo');
const promise2 = generateGreeting('Bar');

Promise.all([promise1, promise2])
  .then((greetings) => {
    greetings.forEach((g) => console.log(g)); // prints 'Hello Foo!' and 'Hello Bar!'
  });
```

### Testing Promises
Mocha, Chai, Chai-as-Promised

```javascript
  
it('should provide a greeting', () => {
  // When
  const promise = generateGreeting('Foo');

  // Then
  return expect(promise).to.eventually.equal('Hello Foo!');
});

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