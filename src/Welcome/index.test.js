import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WelcomePage from './index';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

jest.mock('../Sharedcomponents/Buttons', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

function renderWithRouter(ui, route = '/') {
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  const router = createMemoryRouter(
    [
      { path: '/*', element: ui },
    ],
    {
      initialEntries: [route],
      future: futureFlags,
    }
  );

  return render(<RouterProvider router={router} future={futureFlags} />);
}

describe('WelcomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders welcome message and images', () => {
    renderWithRouter(<WelcomePage />);
    expect(screen.getByAltText(/Decorative pillow/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Logo icon/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to make a change/i)).toBeInTheDocument();
    expect(screen.getByText(/Start your recycling journey today/i)).toBeInTheDocument();
  });

  test('renders both buttons', () => {
    renderWithRouter(<WelcomePage />);
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument();
  });

  test('navigates to /signup when Get Started is clicked', () => {
    renderWithRouter(<WelcomePage />);
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('does not navigate when Learn More is clicked', () => {
    renderWithRouter(<WelcomePage />);
    fireEvent.click(screen.getByRole('button', { name: /Learn More/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
