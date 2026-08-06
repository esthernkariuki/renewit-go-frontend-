import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./index.js"; 

describe("Button component", () => {
  test("renders button with children text", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  test("has default type 'button'", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveAttribute("type", "button");
  });

  test("accepts and applies custom type", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveAttribute("type", "submit");
  });

  test("applies correct variant and additional className", () => {
    render(
      <Button variant="secondary" className="custom-class">
        Button Text
      </Button>
    );
    
    const button = screen.getByRole("button", { name: /button text/i });
    expect(button).toHaveClass("shared-button");
    expect(button).toHaveClass("secondary");
    expect(button).toHaveClass("custom-class");
  });
});