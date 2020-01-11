class TextValidator {
  constructor(jsonAst, state) {
    this.children = jsonAst.children;
    this.location = jsonAst.loc;
    this.mods = this.children.find(child => child.key.value === 'mods');

    this.state = state;
  }

  validate() {
    const _this = this;
    if (this.mods) {
      this.mods.value.children.forEach(function (mod) {
        _this.resolver(mod);
      });
    }
  }

  resolver = (obj) => {
    const mod = obj.key.value;
    switch (mod) {
      case 'type':
        const type = obj.value.value;
        switch (type) {
          case 'h1':
            this.checkNumberOfH1();
            break;
          case 'h2':
            break;
          case 'h3':
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  checkNumberOfH1 = () => {
    this.state.h1Count += 1;

    if (this.state.h1Count > 1) {
      const { start, end } = this.location;
      const error = {
        code: 'TEXT.SEVERAL_H1',
        error: 'Заголовок первого уровня на странице должен быть единственным',
        location: {
          start: { column: start.column, line: start.line },
          end: { column: end.column, line: end.line }
        }
      };
      this.state.errors.push(error);
    }
  };
}

module.exports = TextValidator;
