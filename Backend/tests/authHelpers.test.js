const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveRegistrationRole, validateRegistrationPayload } = require('../utils/authHelpers');

test('maps customer registration to customer role', () => {
  const result = resolveRegistrationRole({ accountType: 'customer' });
  assert.equal(result.role, 'customer');
});

test('maps vendor registration to vendor role', () => {
  const result = resolveRegistrationRole({ accountType: 'vendor' });
  assert.equal(result.role, 'vendor');
});

test('rejects admin role assignment from public registration', () => {
  assert.throws(() => validateRegistrationPayload({ accountType: 'admin' }), /admin/i);
});

test('defaults to customer when no vendor role is provided', () => {
  const result = resolveRegistrationRole({ email: 'test@example.com' });
  assert.equal(result.role, 'customer');
});

test('vendor role wins when role field is vendor even without accountType', () => {
  const result = resolveRegistrationRole({ role: 'vendor' });
  assert.equal(result.role, 'vendor');
});
