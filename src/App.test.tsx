import React from "react";
import { render, screen } from "@testing-library/react";
import { PinyinToneInput } from "./PinyinToneInput";

test("renders pinyin tone input page content", () => {
  render(<PinyinToneInput />);
  const heading = screen.getByRole("heading", { name: /pinyin tone input/i });
  expect(heading).toBeInTheDocument();
});

// Test basic components without router
test("pinyin tone input page has input field", () => {
  render(<PinyinToneInput />);
  const input = screen.getByPlaceholderText(/type pinyin with numbers/i);
  expect(input).toBeInTheDocument();
});
