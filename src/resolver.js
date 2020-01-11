const getBlockName = require('./utils/getBlockName');
const WarningValidator = require('./validators/warning');

/**
 * Matches validator to block type
 * @param jsonAst is BEM block JSON that's represented as AST
 * @param errors is an array of linting errors
 */
function resolver(jsonAst, errors = []) {
  const block = getBlockName(jsonAst);
  switch (block) {
    case 'warning':
      const validator = new WarningValidator(jsonAst, errors);
      validator.validate();
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
