import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpcyclerRequests from "../UpcyclerRequests/index"
import * as hooks from "../hooks/useFetchUpcyclerRequest";

global.alert = jest.fn();

const mockRequests = [
  {
    request: 1,
    type: "Cotton",
    quantity: 10,
    image: "",
    requested_at: "2025-08-15T09:00:00Z",
  }
];

const mockAdd = jest.fn();
const mockUpdate = jest.fn();
const mockRemove = jest.fn();

beforeEach(() => {
  jest.spyOn(hooks, "useUpcyclerRequests").mockReturnValue({
    requests: mockRequests,
    loading: false,
    error: null,
    add: mockAdd,
    update: mockUpdate,
    remove: mockRemove,
    page: 1,
    setPage: jest.fn(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders product table with correct columns and data", () => {
  render(<UpcyclerRequests />);
  expect(screen.getByText("PRODUCTS")).toBeInTheDocument();
  expect(screen.getByText("Cotton")).toBeInTheDocument();
  expect(screen.getByText("10")).toBeInTheDocument();
  expect(screen.getByText("Edit")).toBeInTheDocument();
  expect(screen.getByText("Delete")).toBeInTheDocument();
});

test("opens and closes the add product modal", async () => {
  render(<UpcyclerRequests />);
  fireEvent.click(screen.getByText("Add Product"));
  expect(await screen.findByTestId("product-form")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Cancel"));
  await waitFor(() => {
    expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
  });
});

test("calls add when saving a new product", async () => {
  render(<UpcyclerRequests />);
  fireEvent.click(screen.getByText("Add Product"));
  fireEvent.change(screen.getByPlaceholderText("Enter product type"), { target: { value: "Denim" } });
  fireEvent.change(screen.getByPlaceholderText("Enter quantity"), { target: { value: "5" } });
  fireEvent.click(screen.getByText("Save"));
  await waitFor(() => {
    expect(mockAdd).toHaveBeenCalled();
  });
});

test("calls update when editing a product", async () => {
  render(<UpcyclerRequests />);
  fireEvent.click(screen.getByText("Edit"));
  fireEvent.change(screen.getByPlaceholderText("Enter product type"), { target: { value: "Silk" } });
  fireEvent.click(screen.getByText("Save"));
  await waitFor(() => {
    expect(mockUpdate).toHaveBeenCalled();
  });
});

test("shows an error message if error exists", () => {
  jest.spyOn(hooks, "useUpcyclerRequests").mockReturnValue({
    requests: [],
    loading: false,
    error: "Error!",
    add: mockAdd,
    update: mockUpdate,
    remove: mockRemove,
    page: 1,
    setPage: jest.fn(),
  });
  render(<UpcyclerRequests />);
  expect(screen.getByText("Error!")).toBeInTheDocument();
});
