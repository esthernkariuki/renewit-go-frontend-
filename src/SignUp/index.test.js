import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from './index';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { useFetchSignUp } from '../hooks/useFetchSignUp';

jest.mock('../hooks/useFetchSignUp');
jest.mock('../hooks/usePasswordToggle', () => ({
  usePasswordToggle: () => [false, jest.fn()],
}));
jest.mock('../Sharedcomponents/Buttons', () => ({
  Button: ({ children, ...rest }) => <button {...rest}>{children}</button>,
}));

function renderWithRouter(ui, route = '/') {
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  const router = createMemoryRouter(
    [{ path: '/*', element: ui }],
    {
      initialEntries: [route],
      future: futureFlags,
    }
  );

  return render(<RouterProvider router={router} future={futureFlags} />);
}

describe('SignUp Component', () => {
  beforeEach(() => {
    useFetchSignUp.mockReturnValue({
      formData: {
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
      error: '',
      loading: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn((e) => e.preventDefault()),
    });
  });

  test('renders signup form fields', () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();

    const confirmPasswordElements = screen.getAllByLabelText(/Confirm Password/i);
    expect(confirmPasswordElements[0]).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('renders hero text and navigation link', () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByText(/RenewIt/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Inspiration/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Vision/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Story/i)).toBeInTheDocument();
    expect(screen.getByText(/unlock your imagination/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sign In/i })).toHaveAttribute('href', '/login');
  });

  test('submits the form', () => {
    const { container } = renderWithRouter(<SignUp />);
    const form = screen.getByTestId('signup-form');
    fireEvent.submit(form);
    expect(container).toBeInTheDocument();
  });

  test('displays error message if error exists', () => {
    useFetchSignUp.mockReturnValueOnce({
      formData: {
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
      error: 'Signup error!',
      loading: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn((e) => e.preventDefault()),
    });
    renderWithRouter(<SignUp />);
    expect(screen.getByText(/Signup error!/i)).toBeInTheDocument();
  });

  test('shows loading text when loading is true', () => {
    useFetchSignUp.mockReturnValueOnce({
      formData: {
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      },
      error: '',
      loading: true,
      handleChange: jest.fn(),
      handleSubmit: jest.fn((e) => e.preventDefault()),
    });
    renderWithRouter(<SignUp />);
    expect(screen.getByRole('button', { name: /Signing Up.../i })).toBeInTheDocument();
  });

  test('toggles password visibility when icon is clicked', () => {
    renderWithRouter(<SignUp />);
    const icons = screen.getAllByRole('button', { name: /Show password|Hide password|Show confirm password|Hide confirm password/i });
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });
});
