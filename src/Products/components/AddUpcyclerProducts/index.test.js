import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from './index';

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
});
afterAll(() => {
  if (global.URL.createObjectURL?.mockRestore) {
    global.URL.createObjectURL.mockRestore();
  }
});

describe('ProductForm component', () => {
  
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn(e => e.preventDefault());
  const mockOnCancel = jest.fn();

  const defaultForm = {
    upcycled_clothes: 'T-shirt',
    type: 'cotton',
    quantity: 10,
    price: 25.5,
    image: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form inputs with correct initial values', () => {
    render(
      <ProductForm
        form={defaultForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        editing={false}
      />
    );

    expect(screen.getByLabelText(/Upcycled Clothes/i).value).toBe('T-shirt');
    expect(screen.getByLabelText(/Type/i).value).toBe('cotton');
    expect(screen.getByLabelText(/Quantity/i).value).toBe('10');
    expect(screen.getByLabelText(/Price/i).value).toBe('25.5');
    expect(screen.getByLabelText(/Image/i).value).toBe('');
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  test('renders "Update" text on submit button when editing is true', () => {
    render(
      <ProductForm
        form={defaultForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        editing={true}
      />
    );
    expect(screen.getByRole('button', { name: /Update/i })).toBeInTheDocument();
  });

  test('calls onChange handler when inputs are changed', () => {
    render(
      <ProductForm
        form={defaultForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        editing={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/Upcycled Clothes/i), {
      target: { value: 'Jacket', name: 'upcycled_clothes' },
    });
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    const imageFile = new File(['dummy content'], 'cool.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Image/i), {
      target: { files: [imageFile], name: 'image' },
    });
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  test('calls onSubmit handler when form is submitted', () => {
    render(
      <ProductForm
        form={defaultForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        editing={false}
      />
    );

    fireEvent.submit(screen.getByTestId('product-form'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('calls onCancel handler when cancel button is clicked', () => {
    render(
      <ProductForm
        form={defaultForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        editing={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

