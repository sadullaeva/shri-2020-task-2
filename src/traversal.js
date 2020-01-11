/**
 * Makes a recursive traversal of jsonAst object and calls resolver
 * function for BEM blocks
 * @param jsonAst is JSON that's represented as AST (Abstract Syntax Tree)
 * @param resolver is a function that matches validator to block type
 * @param errors is an array of linting errors
 */

function traversal(jsonAst, resolver, errors = []) {
  const { type } = jsonAst;
  switch (type) {
    case 'Object':
      const isBlock = jsonAst.children.reduce(function(acc, child) {
        return acc && child.key.value !== 'elem';
      }, true);
      if (isBlock) {
        resolver(jsonAst, errors);
      }
      jsonAst.children.forEach(function(child) {
        traversal(child, resolver);
      });
      break;
    case 'Property':
      if (jsonAst.key.value === 'content') {
        traversal(jsonAst.value, resolver);
      }
      break;
    case 'Array':
      jsonAst.children.forEach(function(child) {
        traversal(child, resolver);
      });
      break;
    case 'Identifier':
    case 'Literal':
    default:
      break;
  }
}

module.exports = traversal;
