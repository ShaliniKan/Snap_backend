import { renderHook, waitFor } from "@testing-library/react";
import useProducts from "./useProducts";
import { getProducts } from "../services/productService";

jest.mock("../services/productService", () => ({
    getProducts: jest.fn(),
}));

describe("useProducts", () => {
    it("extracts an array of products from the API response payload", async () => {
        getProducts.mockResolvedValue({ products: [{ _id: "1", name: "Test Product" }] });

        const { result } = renderHook(() => useProducts());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.products).toEqual([{ _id: "1", name: "Test Product" }]);
        expect(result.current.error).toBe("");
    });
});
