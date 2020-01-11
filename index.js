const traversal = require('./src/traversal');
const resolver = require('./src/resolver');
const parse = require('json-to-ast');

globalThis.lint = function(string) {
  if (typeof string !== 'string') return;
  try {
    const ast = parse(string);
    const state = {
      h1Count: 0,
      errors: [],
    };
    traversal(ast, resolver, state);
  } catch {
    console.log('Something went wrong');
  }
};

// globalThis.lint();
