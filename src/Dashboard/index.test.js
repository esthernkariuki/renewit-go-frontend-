global.ResizeObserver = class {
  constructor(callback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./index";

jest.mock("../hooks/useFetchUserList");
jest.mock("../hooks/useRequests");
jest.mock("../hooks/useBarChart");

import { useFetchUseList } from "../hooks/useFetchUserList";
import { useRequests } from "../hooks/useRequests";
import { useBarChart } from "../hooks/useBarChart";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => (store[key] = value.toString())),
    clear: jest.fn(() => (store = {})),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

function renderWithRouter(component, route = "/") {
  const futureFlags = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  const router = createMemoryRouter(
    [{ path: "/*", element: component }],
    {
      initialEntries: [route],
      future: futureFlags,
    }
  );
  return render(<RouterProvider router={router} future={futureFlags} />);
}

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("redirects to login if no token", () => {
    localStorage.getItem.mockReturnValueOnce(null);

    useFetchUseList.mockReturnValue({ userName: "", loading: false, error: null });
    useRequests.mockReturnValue({ data: [], loading: false, error: null });
    useBarChart.mockReturnValue({ data: [], loading: false, error: null });

    renderWithRouter(<Dashboard />);

    expect(screen.queryByText(/Dashboard Overview/i)).not.toBeInTheDocument();
  });

  test("shows loading state when hooks loading", () => {
    localStorage.getItem.mockImplementation((key) =>
      key === "token" ? "mockToken" : "mockUser"
    );

    useFetchUseList.mockReturnValue({ userName: "John", loading: true, error: null });
    useRequests.mockReturnValue({ data: null, loading: true, error: null });
    useBarChart.mockReturnValue({ data: null, loading: true, error: null });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
  });

  test("shows error if any hook returns error", () => {
    localStorage.getItem.mockImplementation((key) =>
      key === "token" ? "mockToken" : "mockUser"
    );

    useFetchUseList.mockReturnValue({ userName: "John", loading: false, error: "User fetch error" });
    useRequests.mockReturnValue({ data: [], loading: false, error: null });
    useBarChart.mockReturnValue({ data: [], loading: false, error: null });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText(/Error: User fetch error/i)).toBeInTheDocument();
  });

  test("renders summary cards with correct counts", () => {
    localStorage.getItem.mockImplementation((key) =>
      key === "token" ? "mockToken" : "mockUser"
    );

    useFetchUseList.mockReturnValue({ userName: "John", loading: false, error: null });
    useRequests.mockReturnValue({
      data: [
        { quantity: 3, type: "Type A", requested_at: "2024-08-01T09:00:00Z" },
        { quantity: 2, type: "Type B", requested_at: "2024-08-02T10:00:00Z" },
      ],
      loading: false,
      error: null,
    });
    useBarChart.mockReturnValue({
      data: [
        { quantity: 10, type: "Product A" },
        { quantity: 5, type: "Product B" },
      ],
      loading: false,
      error: null,
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText("Total Requests")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Request Types")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Total Products")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  test("search filters recent activities", async () => {
    localStorage.getItem.mockImplementation((key) =>
      key === "token" ? "mockToken" : "mockUser"
    );

    useFetchUseList.mockReturnValue({ userName: "John", loading: false, error: null });
    useRequests.mockReturnValue({
      data: [
        { quantity: 3, type: "Type A", requested_at: "2024-08-01T09:00:00Z" },
        { quantity: 2, type: "Type B", requested_at: "2024-08-02T10:00:00Z" },
      ],
      loading: false,
      error: null,
    });
    useBarChart.mockReturnValue({
      data: [{ quantity: 10, type: "Product A" }],
      loading: false,
      error: null,
    });

    renderWithRouter(<Dashboard />);

    expect(screen.getByText(/3 Type A requested/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Type B requested/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Search activities...");
    fireEvent.change(input, { target: { value: "Type A" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/3 Type A requested/i)).toBeInTheDocument();
      expect(screen.queryByText(/2 Type B requested/i)).not.toBeInTheDocument();
    });
  });

  test("pagination buttons disable and enable correctly", () => {
    localStorage.getItem.mockImplementation((key) =>
      key === "token" ? "mockToken" : "mockUser"
    );

    const mockActivities = Array.from({ length: 12 }).map((_, i) => ({
      quantity: 1,
      type: `Type ${i + 1}`,
      requested_at: `2024-08-${String(i + 1).padStart(2, "0")}T09:00:00Z`,
    }));

    useFetchUseList.mockReturnValue({ userName: "John", loading: false, error: null });
    useRequests.mockReturnValue({
      data: mockActivities,
      loading: false,
      error: null,
    });
    useBarChart.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });

    renderWithRouter(<Dashboard />);

    const prevButton = screen.getByText("Previous");
    const nextButton = screen.getByText("Next");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(prevButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
  });
});
