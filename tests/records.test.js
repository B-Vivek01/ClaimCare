import test from 'node:test';
import assert from 'node:assert/strict';
import { changesBetween } from '../src/data/records.js';
import { requiredRoles, homeForRole } from '../src/auth/access.js';
test('customer routes require login and staff routes require matching roles', () => {
  assert.deepEqual(requiredRoles('/reports/customer'), ['customer', 'operations', 'admin']);
  for (const path of ['/', '/login', '/register', '/contact']) assert.equal(requiredRoles(path), null);
  for (const path of ['/claims', '/documents/upload', '/profile/password']) assert.deepEqual(requiredRoles(path), ['customer', 'operations', 'admin']);
  for (const path of ['/ops', '/ops/claims', '/workflow/rules', '/reports']) assert.deepEqual(requiredRoles(path), ['operations', 'admin']);
  assert.deepEqual(requiredRoles('/admin/users'), ['admin']);
  assert.deepEqual(requiredRoles('/administrator'), ['customer', 'operations', 'admin']);
  assert.equal(homeForRole('admin'), '/admin');
  assert.equal(homeForRole('operations'), '/ops');
  assert.equal(homeForRole('customer'), '/dashboard');
});
test('record mutations persist only changed records and explicit removals', () => {
  const previous = [{ id: 'one', value: 1 }, { id: 'two', value: 2 }];
  assert.deepEqual(changesBetween(previous, previous), { writes: [], deletes: [] });
  assert.deepEqual(changesBetween(previous, [{ id: 'one', value: 3 }, { id: 'three', value: 4 }]), {
    writes: [{ id: 'one', value: 3 }, { id: 'three', value: 4 }], deletes: [{ id: 'two', value: 2 }],
  });
  assert.deepEqual(previous, [{ id: 'one', value: 1 }, { id: 'two', value: 2 }]);
});
test('invalid identifiers cannot overwrite unrelated records', () => {
  assert.throws(() => changesBetween([], [{ value: 1 }]));
  assert.throws(() => changesBetween([], [{ id: 'one' }, { id: 'one' }]));
  assert.throws(() => changesBetween([], null));
});
