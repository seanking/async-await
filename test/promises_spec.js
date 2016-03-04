'use strict';

const Promise = require('promise');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('ES2015 Promises', () => {
  it('should provide a greeting', () => {
    // When
    const promise = generateGreeting('Sean');

    // Then
    return expect(promise).to.eventually.equal('Hello Sean!');
  });

  it('should provide multiple greetings', () => {
    // Given
    const promise1 = generateGreeting('Sean');
    const promise2 = generateGreeting('Beth');

    // When
    const promises = Promise.all([promise1, promise2]);

    // Then®
    const expectedGreetings = ['Hello Sean!', 'Hello Beth!'];
    return expect(promises).to.eventually.deep.equal(expectedGreetings);
  });

  it('should provide results of first promise', () => {
    // Given
    const promise1 = generateGreeting('Sean');
    const promise2 = generateGreeting('Beth');

    // When
    const promises = Promise.race([promise1, promise2]);

    // Then®
    return expect(promises).to.eventually.equal('Hello Sean!');
  });

  it('should use promise.resolve', () => {
    // Given
    const message = 'Say Hello!';

    // When
    const promise = Promise.resolve(message);

    // Then
    return expect(promise).to.eventually.equal(message);
  });

  it('should use promise.reject', () => {
    // Given
    const errorMessage = 'Help! Error!';

    // When
    const promise = Promise.reject(new Error(errorMessage));

    // Then
    return expect(promise).to.eventually.rejectedWith(errorMessage);
  });

  const generateGreeting = (name) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Hello ${name}!`);
      }, 1500);
    });
  };
});
