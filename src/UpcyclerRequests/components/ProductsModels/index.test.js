import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ProductModal from ".";

const mockOnSave = jest.fn();
const mockOnClose = jest.fn();
global.alert = jest.fn();

test("renders modal with empty form", () => {
  render(<ProductModal open={true} onClose={mockOnClose} onSave={mockOnSave} initialData={null} />);
  expect(screen.getByTestId("product-form")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter product type")).toHaveValue("");
  expect(screen.getByPlaceholderText("Enter quantity")).toHaveValue(null);
});

test("renders modal with initial data", () => {
  render(<ProductModal
    open={true}
    onClose={mockOnClose}
    onSave={mockOnSave}
    initialData={{ type: "Cotton", quantity: 10 }}
  />);
  expect(screen.getByPlaceholderText("Enter product type")).toHaveValue("Cotton");
  expect(screen.getByPlaceholderText("Enter quantity")).toHaveValue(10);
});

test("calls onSave with form data", async () => {
  render(<ProductModal open={true} onClose={mockOnClose} onSave={mockOnSave} initialData={null} />);
  
  fireEvent.change(screen.getByPlaceholderText("Enter product type"), { target: { value: "Denim" } });
  fireEvent.change(screen.getByPlaceholderText("Enter quantity"), { target: { value: "5" } });

  await act(async () => {
    fireEvent.submit(screen.getByTestId("product-form"));
  });

  expect(mockOnSave).toHaveBeenCalled();
});

test("calls onClose when cancel is clicked", () => {
  render(<ProductModal open={true} onClose={mockOnClose} onSave={mockOnSave} initialData={null} />);
  fireEvent.click(screen.getByText("Cancel"));
  expect(mockOnClose).toHaveBeenCalled();
});
