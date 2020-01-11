const getBlockName = require('./utils/getBlockName');
const WarningValidator = require('./validators/warning');

/**
 * Matches validator to block type
 * @param jsonAst is BEM block JSON that's represented as AST
 * @param state contains linting errors and common state
 */
function resolver(jsonAst, state) {
  const block = getBlockName(jsonAst);
  switch (block) {
    case 'warning':
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      break;
    case 'text':
      break;
    case 'grid':
      break;
    default:
      break;
  }
}

module.exports = resolver;
