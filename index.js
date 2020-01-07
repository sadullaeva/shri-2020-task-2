const traversal = require('./src/traversal');
const parse = require('json-to-ast');

globalThis.lint = function(string) {
  if (typeof string !== 'string') return;
  try {
    const ast = parse(string);
    traversal(ast);
  } catch {
    console.log('Something went wrong');
  }
};

// globalThis.lint();
