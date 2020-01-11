const traversal = require('../../traversal');
const getBlockName = require('../../utils/getBlockName');
const sizes = require('../../const/sizes');

class WarningValidator {
  constructor(jsonAst, errors = []) {
    this.children = jsonAst.children;
    this.location =  jsonAst.loc;
    this.content = this.children.find(child => child.key.value === 'content');

    this.errors = errors;

    this.sizeStandard = undefined;
    this.recheck = [];
  }

  validate() {
    const _this = this;
    if (this.content) {
      this.content.value.children.forEach(function (nestedChild) {
        traversal(nestedChild, _this.resolver);
      });
      _this.recheck.forEach(function (func) {
        func();
      });
    }
  }

  resolver = (obj) => {
    const block = getBlockName(obj);
    switch (block) {
      case 'text':
        this.checkSameTextSize(obj);
        break;
      case 'button':
        this.checkButtonSize(obj);
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
  };

  checkButtonSize = (obj) => {
    if (!this.sizeStandard) {
      this.recheck.push(() => {
        this.checkButtonSize(obj);
      });
      return;
    }

    const { children = [] } = obj;
    const mods = children.find(function(child) {
      return child.key.value === 'mods';
    });
    let size = mods && mods.value.children.find(function(child) {
      return child.key.value === 'size';
    });
    size = size.value.value;

    if (!size) return;

    const index = sizes.indexOf(this.sizeStandard);
    if (index === -1 && index === sizes.length - 1) return;
    if (size !== sizes[index + 1]) {
      const { start, end } = obj.loc;
      const error = {
        code: 'WARNING.INVALID_BUTTON_SIZE',
        error: `Размер кнопки блока warning должен быть '${sizes[index + 1]}', что на 1 шаг больше эталонного размера текста '${sizes[index]}'`,
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.errors.push(error);
    }
  };
}

module.exports = WarningValidator;
