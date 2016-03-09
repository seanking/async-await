'use strict';

import * as chai from 'chai';
const expect = chai.expect;

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('ES2015 Promises', () => {
  it('should provide a greeting', () => {
    // When
    const promise = generateGreeting('Sean');

    // Then
    return expect(promise).to.eventually.equal('Hello Sean!');
  });

  it('should handle invalid delay', () => {
    // Given
    const invalidDelay = 1501;

    // When
    const promise = generateGreeting('Sean', invalidDelay);

    // Then
    return expect(promise).to.eventually.rejectedWith('Invalid delay!');
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
    const delay = 100;
    const promise1 = generateGreeting('Sean', delay);
    const promise2 = generateGreeting('Beth', delay + 1000);

    // When
    const promises = Promise.race([promise1, promise2]);

    // Then
    return expect(promises).to.eventually.equal('Hello Sean!');
  });

  it('should resolve a promise with a synchronous value', () => {
    // Given
    const message = 'Say Hello!';

    // When
    const promise = Promise.resolve(message);

    // Then
    return expect(promise).to.eventually.equal(message);
  });

  it('should reject a promise with a message', () => {
    // Given
    const errorMessage = 'Help! Error!';

    // When
    const promise = Promise.reject(new Error(errorMessage));

    // Then
    return expect(promise).to.eventually.rejectedWith(errorMessage);
  });

  function generateGreeting(name, delay = 1000) {
    return new Promise((resolve, reject) => {
      if (delay > 1500) {
        reject(new Error('Invalid delay!'));
      }

      setTimeout(() => resolve(`Hello ${name}!`), delay);
    });
  }
});
