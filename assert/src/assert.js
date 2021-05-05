import { Operator } from './utils.js';
import eq from 'fast-deep-equal';

const aliasMethodHook = (methodName) =>
  function (...args) {
    return this[methodName](...args);
  };

export const equal = (
  actual,
  expected,
  description = 'should be equivalent'
) => ({
  pass: eq(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.EQUAL,
});

export const notEqual = (
  actual,
  expected,
  description = 'should not be equivalent'
) => ({
  pass: !eq(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.NOT_EQUAL,
});

export const is = (actual, expected, description = 'should be the same') => ({
  pass: Object.is(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.IS,
});

export const isNot = (
  actual,
  expected,
  description = 'should not be the same'
) => ({
  pass: !Object.is(actual, expected),
  actual,
  expected,
  description,
  operator: Operator.IS_NOT,
});

export const ok = (actual, description = 'should be truthy') => ({
  pass: Boolean(actual),
  actual,
  expected: 'truthy value',
  description,
  operator: Operator.OK,
});

export const notOk = (actual, description = 'should be falsy') => ({
  pass: !Boolean(actual),
  actual,
  expected: 'falsy value',
  description,
  operator: Operator.NOT_OK,
});

export const fail = (description = 'fail called') => ({
  pass: false,
  actual: 'fail called',
  expected: 'fail not called',
  description,
  operator: Operator.FAIL,
});

export const throws = (func, expected, description = 'should throw') => {
  let caught;
  let pass;
  let actual;
  if (typeof expected === 'string') {
    [expected, description] = [description, expected];
  }
  try {
    func();
  } catch (err) {
    caught = { error: err };
  }
  pass = caught !== undefined;
  actual = caught?.error;

  if (expected instanceof RegExp) {
    pass = expected.test(actual) || expected.test(actual && actual.message);
    actual = actual?.message ?? actual;
    expected = String(expected);
  } else if (typeof expected === 'function' && caught) {
    pass = actual instanceof expected;
    actual = actual.constructor;
  }
  return {
    pass,
    actual,
    expected,
    description: description,
    operator: Operator.THROWS,
  };
};

export const Assert = {
  equal,
  equals: aliasMethodHook('equal'),
  eq: aliasMethodHook('equal'),
  deepEqual: aliasMethodHook('equal'),
  same: aliasMethodHook('equal'),
  notEqual,
  notEquals: aliasMethodHook('notEqual'),
  notEq: aliasMethodHook('notEqual'),
  notDeepEqual: aliasMethodHook('notEqual'),
  notSame: aliasMethodHook('notEqual'),
  is,
  isNot,
  ok,
  truthy: aliasMethodHook('ok'),
  notOk,
  falsy: aliasMethodHook('notOk'),
  fail,
  throws,
};
