const parse = require('json-to-ast');
const GridValidator = require('./index');

describe('GridValidator', () => {
  let state;

  beforeEach(() => {
    state = { errors: [], recheck: [] };
  });

  afterEach(() => {
    state = null;
  });

  describe('checkPartOfMarketingBlocks', () => {
    test('marketing blocks take less than a half of grid columns', () => {
      const jsonAst = parse(`{
        "block": "grid",
        "mods": { "m-columns": "10" },
        "content": [
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "8" },
            "content": { "block": "payment" }
          },
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "2" },
            "content": { "block": "offer" }
          }
        ]
      }`);
      const gridValidator = new GridValidator(jsonAst, state);
      gridValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(0);
    });

    test('marketing blocks take a half of grid columns', () => {
      const jsonAst = parse(`{
        "block": "grid",
        "mods": { "m-columns": "10" },
        "content": [
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "5" },
            "content": { "block": "payment" }
          },
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "5" },
            "content": { "block": "offer" }
          }
        ]
      }`);
      const gridValidator = new GridValidator(jsonAst, state);
      gridValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(0);
    });

    test('marketing blocks take more than a half of grid columns', () => {
      const jsonAst = parse(`{
        "block": "grid",
        "mods": { "m-columns": "10" },
        "content": [
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "2" },
            "content":  { "block": "payment" }
          },
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "8" },
            "content": { "block": "offer" }
          }
        ]
      }`);
      const gridValidator = new GridValidator(jsonAst, state);
      gridValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
          location: { start: { column: 1, line: 1 }, end: { column: 8, line: 18 } }
        }
      ]);
    });

    test('marketing blocks take all grid columns', () => {
      const jsonAst = parse(`{
        "block": "grid",
        "mods": { "m-columns": "10" },
        "content": [
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "2" },
            "content": { "block": "commercial" }
          },
          {
            "block": "grid",
            "elem": "fraction",
            "elemMods": { "m-col": "8" },
            "content": { "block": "offer" }
          }
        ]
      }`);
      const gridValidator = new GridValidator(jsonAst, state);
      gridValidator.validate();
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'GRID.TOO_MUCH_MARKETING_BLOCKS',
          location: { start: { column: 1, line: 1 }, end: { column: 8, line: 18 } }
        }
      ]);
    });
  });
});
