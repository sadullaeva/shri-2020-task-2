const traversal = require('./src/traversal');

globalThis.lint = function(string) {
  if (typeof string !== 'string') return;
  try {
    const json = JSON.parse(string);
    traversal(json);
  } catch {
    console.log('Something went wrong');
  }
};

// globalThis.lint();
