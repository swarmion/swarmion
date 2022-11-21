import { A } from 'ts-toolbelt';

import { DefinedProperties } from '../types/utils';

type ToClean = {
  key1: undefined;
  key2: 'myValue';
};

type Cleaned = DefinedProperties<ToClean>;

// check that the type is cleaned
type Expected = { key2: 'myValue' };

type CheckExpected = A.Equals<Cleaned, Expected>;

const checkExpected: CheckExpected = 1;
checkExpected;

// check no other key can be introduced
type NotExpected = { key2: 'myValue'; key3: 'someOtherValue' };
type CheckNotExpected = A.Equals<Cleaned, NotExpected>;

const checkNotExpected: CheckNotExpected = 0;
checkNotExpected;
