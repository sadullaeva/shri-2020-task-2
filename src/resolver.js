const resolver = function(json) {
  const { block, elem } = json;

  if (elem) return;

  switch (block) {
    case 'warning':
      break;
    case 'text':
      break;
    case 'grid':
      break;
    default:
      break;
  }
};

module.exports = resolver;
