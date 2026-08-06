import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductList from "./index"; 
import * as useProductsHook from "../hooks/useFetchProducts";

jest.mock("../hooks/useFetchProducts");

describe("ProductList component", () => {
  const mockProducts = [
    { id: 1, upcycled_clothes: "Dress", type: "cotton", quantity: 10, price: 20, image: null, updated_at: "2025-08-08T10:00:00Z" },
    { id: 2, upcycled_clothes: "Jeans", type: "denim", quantity: 5, price: 50, image: null, updated_at: "2025-08-07T10:00:00Z" },
    { id: 3, upcycled_clothes: "Jacket", type: "leather", quantity: 3, price: 100, image: null, updated_at: "2025-08-06T10:00:00Z" },
    { id: 4, upcycled_clothes: "Skirt", type: "silk", quantity: 6, price: 30, image: null, updated_at: "2025-08-05T10:00:00Z" },
    { id: 5, upcycled_clothes: "Shirt", type: "linen", quantity: 12, price: 15, image: null, updated_at: "2025-08-04T10:00:00Z" },
    { id: 6, upcycled_clothes: "Hat", type: "wool", quantity: 7, price: 12, image: null, updated_at: "2025-08-03T10:00:00Z" },
  ];

  let mockAdd, mockUpdate, mockRemove, mockSetPage;

  beforeEach(() => {
    mockAdd = jest.fn().mockResolvedValue({});
    mockUpdate = jest.fn().mockResolvedValue({});
    mockRemove = jest.fn().mockResolvedValue({});
    mockSetPage = jest.fn();

    useProductsHook.useProducts.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      page: 1,
      setPage: mockSetPage,
      add: mockAdd,
      update: mockUpdate,
      remove: mockRemove,
    });
  });

  test("renders products and paginates correctly", () => {
    render(<ProductList />);
    expect(screen.getByText("Dress")).toBeInTheDocument();
    expect(screen.getByText("Shirt")).toBeInTheDocument();
    expect(screen.queryByText("Hat")).not.toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();

    expect(screen.getByText("Prev")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();

    fireEvent.click(screen.getByText("Next"));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  test("shows loading indicator", () => {
    useProductsHook.useProducts.mockReturnValue({ ...useProductsHook.useProducts(), loading: true });
    render(<ProductList />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("shows error message", () => {
    useProductsHook.useProducts.mockReturnValue({ ...useProductsHook.useProducts(), error: "Error loading products" });
    render(<ProductList />);
    expect(screen.getByText(/Error loading products/i)).toBeInTheDocument();
  });

  test("shows no products message when empty list", () => {
    useProductsHook.useProducts.mockReturnValue({ ...useProductsHook.useProducts(), products: [] });
    render(<ProductList />);
    expect(screen.getByText(/No products available/i)).toBeInTheDocument();
  });

  test("opens add product modal and closes on cancel", () => {
    render(<ProductList />);
    fireEvent.click(screen.getByText(/Add Product/i));
    expect(screen.getByTestId("product-form")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
  });

  test("opens edit product modal with form pre-filled", () => {
    render(<ProductList />);
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(screen.getByDisplayValue("Dress")).toBeInTheDocument();
  });

  test("submits add product form successfully", async () => {
    render(<ProductList />);
    fireEvent.click(screen.getByText(/Add Product/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter product name/i), { target: { value: "New Dress" } });
    fireEvent.submit(screen.getByTestId("product-form"));

    await waitFor(() => expect(mockAdd).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByTestId("product-form")).not.toBeInTheDocument());
  });

  test("submits edit product form successfully", async () => {
    render(<ProductList />);
    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.change(screen.getByDisplayValue("Dress"), { target: { value: "Updated Dress" } });
    fireEvent.submit(screen.getByTestId("product-form"));

    await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByTestId("product-form")).not.toBeInTheDocument());
  });

  test("deletes product after confirmation", async () => {
    window.confirm = jest.fn(() => true);
    render(<ProductList />);
    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalledWith(mockProducts[0].id);
    });
  });

  test("does not delete product if confirmation cancelled", () => {
    window.confirm = jest.fn(() => false);
    render(<ProductList />);
    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockRemove).not.toHaveBeenCalled();
  });
});
