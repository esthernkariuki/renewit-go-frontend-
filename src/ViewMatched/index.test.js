import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewMatched from ".";
import * as useMaterialsHook from "../hooks/useMaterials";

jest.mock("../utils/api/fetchMaterial", () => ({
  clothTypes: ["cotton", "denim", "leather", "silk", "linen", "wool"],
  navigationData: {
    cotton: { image: "cotton.png" },
    denim: { image: "denim.png" },
    leather: { image: "leather.png" },
    silk: { image: "silk.png" },
    linen: { image: "linen.png" },
    wool: { image: "wool.png" },
  },
}));

describe("ViewMatched Component", () => {
  const defaultMock = {
    selectedCloth: null,
    selectCloth: jest.fn(),
    clearSelection: jest.fn(),
    materials: [],
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setupHook(mockOverrides = {}) {
    jest.spyOn(useMaterialsHook, "useMaterials").mockReturnValue({
      ...defaultMock,
      ...mockOverrides,
    });
  }

  test("renders cloth types grid and pagination buttons correctly", () => {
    setupHook();
    render(<ViewMatched />);
    expect(screen.getByText("cotton")).toBeInTheDocument();
    expect(screen.getByText("denim")).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /Previous page/i });
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByRole("button", { name: /Next page/i });
    expect(nextButton).toBeDisabled();
  });

  test("clicking cloth type calls selectCloth", () => {
    const selectCloth = jest.fn();
    setupHook({ selectCloth });
    render(<ViewMatched />);
    fireEvent.click(screen.getByText("cotton"));
    expect(selectCloth).toHaveBeenCalledWith("cotton");
  });

  test("renders loading indicator", () => {
    setupHook({ loading: true, selectedCloth: "cotton" });
    render(<ViewMatched />);
    expect(screen.getByText(/Loading materials/i)).toBeInTheDocument();
  });

  test("renders error message", () => {
    setupHook({ error: "Failed to load materials", selectedCloth: "cotton" });
    render(<ViewMatched />);
    expect(screen.getByText(/Failed to load materials/i)).toBeInTheDocument();
  });

  test("renders no materials found message", () => {
    setupHook({ selectedCloth: "cotton", materials: [], loading: false, error: null });
    render(<ViewMatched />);
    expect(screen.getByText(/No materials found for this cloth type yet/i)).toBeInTheDocument();
  });

  test("renders grouped materials when materials are present", () => {
    const materials = [
      {
        material: "Cotton A",
        quantity: 10,
        condition: "new",
        listed_at: "2025-01-01",
        trader: "Trader Joe",
        type: "cotton",
      },
      {
        material: "Denim B",
        quantity: 5,
        condition: "used",
        listed_at: "2025-02-01",
        trader: "Trader Jane",
        type: "denim",
      },
      {
        material: "Cotton C",
        quantity: 7,
        condition: "used",
        listed_at: "2025-03-01",
        trader: "Trader Jack",
        type: "cotton",
      },
    ];
    setupHook({ selectedCloth: "cotton", materials, loading: false, error: null });
    render(<ViewMatched />);
    expect(screen.getByText("Materials for cotton")).toBeInTheDocument();
    expect(screen.getByText("Cotton A")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("new")).toBeInTheDocument();
    expect(screen.getByText("Trader Joe")).toBeInTheDocument();

    expect(screen.getByText("Cotton C")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    const usedElements = screen.getAllByText("used");
    expect(usedElements.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText("Trader Jack")).toBeInTheDocument();
  });

  test("calls clearSelection when back icon is clicked", () => {
    const clearSelection = jest.fn();
    setupHook({ selectedCloth: "cotton", clearSelection });
    render(<ViewMatched />);
    const backIcon = screen.getByLabelText(/Go back/i);
    fireEvent.click(backIcon);
    expect(clearSelection).toHaveBeenCalled();
  });
});
