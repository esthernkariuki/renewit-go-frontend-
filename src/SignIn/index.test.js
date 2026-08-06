import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./index";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...rest }) => <a href={to} {...rest}>{children}</a>,
  };
});
jest.mock("react-icons/fa", () => ({
  FaEye: () => <span data-testid="eye-icon">eye</span>,
  FaEyeSlash: () => <span data-testid="eye-slash-icon">eye-slash</span>,
}));

const mockLoginUser = jest.fn();
jest.mock("../utils/api/fetchLogin", () => ({
  loginUser: (...args) => mockLoginUser(...args),
}));

function renderWithRouter(ui, route = "/") {
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  const router = createMemoryRouter(
    [{ path: "/*", element: ui }],
    {
      initialEntries: [route],
      future: futureFlags,
    }
  );

  return render(<RouterProvider router={router} future={futureFlags} />);
}

describe("SignIn", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLoginUser.mockReset();
    window.localStorage.clear();
  });

  test("renders all fields and labels", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign Up/i })).toHaveAttribute("href", "/signup");
  });

  test("can type in input fields", () => {
    renderWithRouter(<SignIn />);
    const emailInput = screen.getByLabelText(/Email or Username/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);

    fireEvent.change(emailInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  test("toggles password visibility", () => {
    renderWithRouter(<SignIn />);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const toggle = screen.getByRole("button", { name: /Show password/i });

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggle);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggle);
    expect(passwordInput.type).toBe("password");
  });

  test("shows loading state when submitting", async () => {
    mockLoginUser.mockImplementation(() => new Promise(() => {})); 

    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "bar" } });

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    const form = submitButton.closest("form");

    expect(form).toBeInTheDocument();

    fireEvent.submit(form);

    expect(screen.getByRole("button", { name: /Signing In/i })).toBeDisabled();
  });

  test("calls loginUser and navigates on success", async () => {
    mockLoginUser.mockResolvedValue({ token: "abc", username: "foo" });
    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "bar" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({ username: "foo", password: "bar" });
      expect(window.localStorage.getItem("token")).toBe("abc");
      expect(window.localStorage.getItem("username")).toBe("foo");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows error if loginUser throws", async () => {
    mockLoginUser.mockRejectedValue(new Error("Invalid credentials"));
    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "bar" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows custom error for failed fetch", async () => {
    mockLoginUser.mockRejectedValue(new Error("Failed to fetch"));
    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "bar" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to connect to server");
  });

  test("shows error if no token in response", async () => {
    mockLoginUser.mockResolvedValue({ username: "foow" });
    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByLabelText(/Email or Username/i), { target: { value: "foo" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "bar" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Token missing or invalid/i);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
