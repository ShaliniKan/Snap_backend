const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCategoryResponse } = require('../utils/categoryHelpers');

test('buildCategoryResponse includes parent category and children', () => {
  const category = { _id: 'cat-1', itemName: 'Men', parentCategoryId: null };
  const subcategories = [{ _id: 'sub-1', itemName: 'Formal Wear', parentCategoryId: 'cat-1' }];

  const result = buildCategoryResponse(category, subcategories);

  assert.equal(result._id, 'cat-1');
  assert.equal(result.itemName, 'Men');
  assert.equal(result.children.length, 1);
  assert.equal(result.children[0].itemName, 'Formal Wear');
});
