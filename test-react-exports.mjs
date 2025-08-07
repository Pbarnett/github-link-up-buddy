// Simple test to check what React 19 actually exports
import * as React from 'react';

console.log('React version:', React.version);
console.log('Available exports:');
console.log(Object.keys(React).sort());

// Test specific exports that are failing
console.log('\nSpecific export tests:');
console.log('forwardRef:', typeof React.forwardRef);
console.log('createContext:', typeof React.createContext);
console.log('useDeferredValue:', typeof React.useDeferredValue);
console.log('Fragment:', typeof React.Fragment);
console.log('createElement:', typeof React.createElement);
console.log('memo:', typeof React.memo);
