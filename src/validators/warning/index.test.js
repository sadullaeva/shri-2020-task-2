const parse = require('json-to-ast');
const WarningValidator = require('./index');

describe('WarningValidator', () => {
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
      const state = { errors: [], recheck: [] };
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
      const state = { errors: [], recheck: [] };
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
      const state = { errors: [], recheck: [] };
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
      const state = { errors: [], recheck: [] };
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

  });

  describe('checkButtonPlace', () => {

  });

  describe('checkPlaceholderSize', () => {

  });
});
