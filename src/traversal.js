const resolver = require('./resolver');

const traversal = function(jsonAst) {
  const { type } = jsonAst;
  switch (type) {
    case 'Object':
      const isBlock = jsonAst.children.reduce(function(acc, child) {
        return acc && child.key.value !== 'elem';
      }, true);
      if (isBlock) {
        // TODO: resolver(jsonAst);
      }
      jsonAst.children.forEach(traversal);
      break;
    case 'Property':
      if (jsonAst.key.value === 'mix' || jsonAst.key.value === 'content') {
        traversal(jsonAst.value);
      }
      break;
    case 'Array':
      jsonAst.children.forEach(traversal);
      break;
    case 'Identifier':
    case 'Literal':
    default:
      break;
  }
};

module.exports = traversal;
