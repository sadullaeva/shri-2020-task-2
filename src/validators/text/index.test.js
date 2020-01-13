const parse = require('json-to-ast');
const traversal = require('../../traversal');
const resolver = require('../../resolver');

describe('TextValidator', () => {
  let state;

  beforeEach(() => {
    state = {
      h1: undefined,
      h2: undefined,
      errors: [],
      recheck: [],
    };
  });

  afterEach(() => {
    state = null;
  });

  describe('checkNumberOfH1', () => {
    test('number of H1 is 1', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h1" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      expect(state.errors).toHaveLength(0);
    });

    test('number of H1 is larger than 1', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h1" } },
          { "block": "text", "mods": { "type": "h1" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.SEVERAL_H1',
          location: { start: { column: 11, line: 5 }, end: { column: 56, line: 5 } }
        }
      ]);
    });
  });

  describe('checkPositionOfH2', () => {
    test('H1 before H2', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h1" } },
          { "block": "text", "mods": { "type": "h2" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(0);
    });

    test('H1 after H2', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h2" } },
          { "block": "text", "mods": { "type": "h1" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.INVALID_H2_POSITION',
          location: { start: { column: 11, line: 4 }, end: { column: 56, line: 4 } }
        }
      ]);
    });

    test('H2 between two H1', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h1" } },
          { "block": "text", "mods": { "type": "h2" } },
          { "block": "text", "mods": { "type": "h1" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(2);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.SEVERAL_H1',
          location: { start: { column: 11, line: 6 }, end: { column: 56, line: 6 } }
        },
        {
          code: 'TEXT.INVALID_H2_POSITION',
          location: { start: { column: 11, line: 5 }, end: { column: 56, line: 5 } }
        }
      ]);
    });

    test('H2 before H1 but deeper', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "section", "content": [
            { "block": "text", "mods": { "type": "h2" } }
          ]},
          { "block": "text", "mods": { "type": "h1" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.INVALID_H2_POSITION',
          location: { start: { column: 13, line: 5 }, end: { column: 58, line: 5 } }
        }
      ]);
    });
  });

  describe('checkPositionOfH3', () => {
    test('H2 before H3', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h2" } },
          { "block": "text", "mods": { "type": "h3" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(0);
    });

    test('H2 after H3', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h3" } },
          { "block": "text", "mods": { "type": "h2" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.INVALID_H3_POSITION',
          location: { start: { column: 11, line: 4 }, end: { column: 56, line: 4 } }
        }
      ]);
    });

    test('H3 between two H2', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h2" } },
          { "block": "text", "mods": { "type": "h3" } },
          { "block": "text", "mods": { "type": "h2" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.INVALID_H3_POSITION',
          location: { start: { column: 11, line: 5 }, end: { column: 56, line: 5 } }
        }
      ]);
    });

    test('H3 before H2 but deeper', () => {
      const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "section", "content": [
            { "block": "text", "mods": { "type": "h3" } }
          ]},
          { "block": "text", "mods": { "type": "h2" } }
        ]
      }`);
      traversal(jsonAst, resolver, state);
      state.recheck.forEach(func => func());
      expect(state.errors).toHaveLength(1);
      expect(state.errors).toMatchObject([
        {
          code: 'TEXT.INVALID_H3_POSITION',
          location: { start: { column: 13, line: 5 }, end: { column: 58, line: 5 } }
        }
      ]);
    });
  });

  test('H3 before H2 and H2 before H1', () => {
    const jsonAst = parse(`{
        "block": "page",
        "content": [
          { "block": "text", "mods": { "type": "h3" } },
          { "block": "text", "mods": { "type": "h2" } },
          { "block": "text", "mods": { "type": "h1" } }
        ]
      }`);
    traversal(jsonAst, resolver, state);
    state.recheck.forEach(func => func());
    expect(state.errors).toHaveLength(2);
    expect(state.errors).toMatchObject([
      {
        code: 'TEXT.INVALID_H3_POSITION',
        location: { start: { column: 11, line: 4 }, end: { column: 56, line: 4 } }
      },
      {
        code: 'TEXT.INVALID_H2_POSITION',
        location: { start: { column: 11, line: 5 }, end: { column: 56, line: 5 } }
      }
    ]);
  });
});
