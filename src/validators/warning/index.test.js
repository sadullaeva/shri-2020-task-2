const parse = require('json-to-ast');
const WarningValidator = require('./index');

describe('WarningValidator', () => {
  let state;

  beforeEach(() => {
    state = { errors: [], recheck: [] };
  });

  afterEach(() => {
    state = null;
  });

  describe('checkSameTextSize', () => {
    test('all texts have the same size', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "text", "mods": { "size": "m" } },
              { "block": "text", "mods": { "size": "m" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(0);
    });

    test('texts have different sizes on the same nesting level', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "text", "mods": { "size": "m" } },
              { "block": "text", "mods": { "size": "l" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
          location: { start: { column: 1, line: 1 }, end: { column: 8, line: 12 } }
        }
      ]);
    });

    test('texts have different sizes on different nesting levels', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "text", "mods": { "size": "m" } },
              { "block": "section", "content": { "block": "text", "mods": { "size": "l" } }}
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
          location: { start: { column: 1, line: 1 }, end: { column: 8, line: 12 } }
        }
      ]);
    });

    test('texts have different sizes and different placement (in the content and in the mix)', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "text", "mods": { "size": "m" } },
              { "block": "section", "mix": { "block": "text", "mods": { "size": "l" } }}
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
          location: { start: { column: 1, line: 1 }, end: { column: 8, line: 12 } }
        }
      ]);
    });
  });

  describe('checkButtonSize', () => {
    test('button size one step larger than standard text size (button after text)', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "text", "mods": { "size": "l" } },
              { "block": "button", "mods": { "size": "xl" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(0);
    });

    test('button size one step larger than standard text size (button before text)', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "button", "mods": { "size": "xl" } },
              { "block": "text", "mods": { "size": "l" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(0);
    });

    test('button size does not depend on standard text size (button after text)', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "text", "mods": { "size": "l" } },
              { "block": "button", "mods": { "size": "xxl" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.INVALID_BUTTON_SIZE',
          location: { start: { column: 15, line: 8 }, end: { column: 63, line: 8 } }
        }
      ]);
    });

    test('button size does not depend on standard text size (button before text)', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "button", "mods": { "size": "xxl" } },
              { "block": "text", "mods": { "size": "l" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.sizeStandard = 'l';
      warningValidator.validate();
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.INVALID_BUTTON_SIZE',
          location: { start: { column: 15, line: 7 }, end: { column: 63, line: 7 } }
        }
      ]);
    });

    test('standard text size is not defined', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "button", "mods": { "size": "xxl" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(0);
    });
  });

  describe('checkButtonPlace', () => {
    test('button after placeholder', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "placeholder", "mods": { "size": "m" } },
              { "block": "button", "mods": { "size": "xxl" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      expect(state.errors).toHaveLength(0);
    });

    test('button before placeholder', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "button", "mods": { "size": "xxl" } },
              { "block": "placeholder", "mods": { "size": "m" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.INVALID_BUTTON_POSITION',
          location: { start: { column: 15, line: 7 }, end: { column: 63, line: 7 } }
        }
      ]);
    });

    test('button between 2 placeholders', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "placeholder", "mods": { "size": "m" } },
              { "block": "button", "mods": { "size": "xxl" } },
              { "block": "placeholder", "mods": { "size": "m" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.INVALID_BUTTON_POSITION',
          location: { start: { column: 15, line: 8 }, end: { column: 63, line: 8 } }
        }
      ]);
    });

    test('button before placeholder but deeper', () => {
      const jsonAst = parse(`{
        "block": "warning",
        "content": [
          {
            "elem": "content",
            "content": [
              { "block": "section", "content": [
                { "block": "button", "mods": { "size": "xxl" } }
              ]},
              { "block": "placeholder", "mods": { "size": "m" } }
            ]
          }
        ]
      }`);
      const warningValidator = new WarningValidator(jsonAst, state);
      warningValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'WARNING.INVALID_BUTTON_POSITION',
          location: { start: { column: 17, line: 8 }, end: { column: 65, line: 8 } }
        }
      ]);
    });
  });

  describe('checkPlaceholderSize', () => {

  });
});
