const resolver = require('./resolver');

const traversal = function(json) {
  if (Array.isArray(json)) {
    for (let i = 0; i < json.length; i++) {
      traversal(json[i]);
    }
  } else {
    const { content, mix } = json;
    resolver(json);
    if (content) traversal(content);
    if (mix) traversal(mix);
  }
};

module.exports = traversal;
