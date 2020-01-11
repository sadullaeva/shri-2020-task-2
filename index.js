const traversal = require('./src/traversal');
const resolver = require('./src/resolver');
const parse = require('json-to-ast');

globalThis.lint = function(string) {
  if (typeof string !== 'string') return;
  try {
    const ast = parse(string);
    const state = {
      h1: undefined,
      h2: undefined,
      errors: [],
      recheck: [],
    };
    traversal(ast, resolver, state);
    state.recheck.forEach(function (func) {
      func();
    });
  } catch {
    console.log('Something went wrong');
  }
};

// globalThis.lint();
