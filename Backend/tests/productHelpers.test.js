const test = require("node:test");
const assert = require("node:assert/strict");
const { resolveSellingPrice, DEFAULT_SELLING_PRICE } = require("../utils/productHelpers");

test("resolveSellingPrice prefers variant discount price", () => {
    const price = resolveSellingPrice(
        { price: 1000, discount_price: 900 },
        { price: 1200, discount_price: 799 }
    );

    assert.equal(price, 799);
});

test("resolveSellingPrice falls back to product discount price", () => {
    const price = resolveSellingPrice({ price: 1000, discount_price: 850 }, null);
    assert.equal(price, 850);
});

test("resolveSellingPrice uses default when stored prices are zero", () => {
    const price = resolveSellingPrice({ price: 0 }, { price: 0 });
    assert.equal(price, DEFAULT_SELLING_PRICE);
});
