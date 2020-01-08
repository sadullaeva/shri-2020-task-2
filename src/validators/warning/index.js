const traversal = require('../../traversal');
const getBlockName = require('../../utils/getBlockName');

class WarningValidator {
  constructor(props) {
    this.children = props.children;
    this.location =  props.loc;
    this.content = this.children.find(child => child.key.value === 'content');

    this.errors = [];

    this.sizeStandard = undefined;
  }

  validate() {
    const _this = this;
    if (this.content) {
      this.content.value.children.forEach(function (nestedChild) {
        traversal(nestedChild, _this.resolver);
      });
    }
  }

  resolver = (obj) => {
    const block = getBlockName(obj);
    switch (block) {
      case 'text':
        this.checkSameTextSize(obj);
        break;
      default:
        break;
    }
  };

  checkSameTextSize = (obj) => {
    const { children = [] } = obj;
    const mods = children.find(function(child) {
      return child.key.value === 'mods';
    });
    let size = mods && mods.value.children.find(function(child) {
      return child.key.value === 'size';
    });
    size = size.value.value;

    if (!size) return;
    if (!this.sizeStandard) {
      this.sizeStandard = size;
      return;
    }
    if (size !== this.sizeStandard) {
      const { start, end } = this.location;
      const error = {
        code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
        error: 'Тексты в блоке warning должны быть одного размера',
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.errors.push(error);
    }
  }
}

module.exports = WarningValidator;