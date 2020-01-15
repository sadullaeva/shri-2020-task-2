const lint = require('./index');

describe('lint function', () => {
  test('has return value if passed parameter is a valid JSON string', () => {
    expect(lint(`{}`)).toBeTruthy();
    expect(lint(`{ "block": "page" }`)).toBeTruthy();
    expect(lint(`{ "block": "page", "content": [] }`)).toBeTruthy();
  });

  test('has no return value if passed parameter is not a string', () => {
    expect(lint()).toBeUndefined();
    expect(lint({})).toBeUndefined();
    expect(lint(123)).toBeUndefined();
    expect(lint(true)).toBeUndefined();
    expect(lint(null)).toBeUndefined();
    expect(lint(undefined)).toBeUndefined();
  });

  test('throws error if passed parameter is invalid JSON string', () => {
    expect(() => { lint(`{ "block": }`) }).toThrow();
    expect(() => { lint(`{ "block: "page" }`) }).toThrow();
    expect(() => { lint(`{ "block": "page", }`) }).toThrow();
    expect(() => { lint(`{ "block": "warning", "content": [ { "block": "button" } { "block": "placeholder" } ] }`) }).toThrow();
  });
});
