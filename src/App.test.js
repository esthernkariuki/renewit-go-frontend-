import React from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./App";

jest.mock("./Sharedcomponents/Sidebar", () => ({
  Sidebar: () => <nav data-testid="sidebar">Sidebar</nav>,
}));

jest.mock("./Welcome", () => () => <div>WelcomePage</div>);
jest.mock("./SignUp", () => () => <div>SignupPage</div>);
jest.mock("./SignIn", () => () => <div>SigninPage</div>);
jest.mock("./Dashboard", () => () => <div>DashboardPage</div>);
jest.mock("./Products", () => () => <div>ProductListPage</div>);
jest.mock("./UpcyclerRequests", () => () => <div>UpcyclerRequestsPage</div>);
jest.mock("./ViewMatched", () => () => <div>ViewMatchedPage</div>);

describe("Layout Component Routing and Sidebar", () => {
  function renderWithRoute(route) {
    const futureFlags = {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    };

    const router = createMemoryRouter(
      [
        { path: "/*", element: <Layout /> },
      ],
      {
        initialEntries: [route],
        future: futureFlags,
      }
    );

    return render(<RouterProvider router={router} future={futureFlags} />);
  }

  test("renders WelcomePage and no sidebar at /", () => {
    renderWithRoute("/");
    expect(screen.getByText("WelcomePage")).toBeInTheDocument();
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  test("renders SignupPage and no sidebar at /signup", () => {
    renderWithRoute("/signup");
    expect(screen.getByText("SignupPage")).toBeInTheDocument();
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  test("renders SigninPage and no sidebar at /login", () => {
    renderWithRoute("/login");
    expect(screen.getByText("SigninPage")).toBeInTheDocument();
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  test("renders Dashboard and sidebar at /dashboard", () => {
    renderWithRoute("/dashboard");
    expect(screen.getByText("DashboardPage")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("renders ProductList and sidebar at /products", () => {
    renderWithRoute("/products");
    expect(screen.getByText("ProductListPage")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("renders UpcyclerRequests and sidebar at /requests", () => {
    renderWithRoute("/requests");
    expect(screen.getByText("UpcyclerRequestsPage")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("renders ViewMatched and sidebar at /matched", () => {
    renderWithRoute("/matched");
    expect(screen.getByText("ViewMatchedPage")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });
});
