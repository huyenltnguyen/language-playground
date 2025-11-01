import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinyinToHanziInput } from "./PinyinToHanziInput";

describe("PinyinToHanziInput", () => {
  test("renders the component", () => {
    render(<PinyinToHanziInput />);
    const heading = screen.getByRole("heading", {
      name: /pinyin to hanzi input/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test("incremental conversion waits for tone 5 before converting", async () => {
    const user = userEvent.setup();
    render(<PinyinToHanziInput />);

    // Get the incremental conversion input
    const incrementalSection = screen.getByRole("region", {
      name: /incremental conversion/i,
    });
    const input = incrementalSection.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // Type "ma1" - should convert immediately (has tone mark)
    await user.type(input, "ma1");
    expect(input.value).toBe("妈");

    // Clear and type "ma1 ma" - second "ma" should NOT convert yet (neutral tone, no tone number)
    await user.clear(input);
    await user.type(input, "ma1 ma");
    expect(input.value).toBe("妈ma");

    // Now add "5" - should convert
    await user.type(input, "5");
    expect(input.value).toBe("妈妈");
  });

  test("full match conversion waits for tone 5 before converting", async () => {
    const user = userEvent.setup();
    render(<PinyinToHanziInput />);

    // Get the full match conversion input
    const fullMatchSection = screen.getByRole("region", {
      name: /full match conversion/i,
    });
    const input = fullMatchSection.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // Type "ma1 ma" - should NOT convert (waiting for tone 5)
    await user.type(input, "ma1 ma");
    expect(input.value).toBe("mā ma");

    // Clear and type "ma1 ma5" - should convert
    await user.clear(input);
    await user.type(input, "ma1 ma5");
    expect(input.value).toBe("妈妈");
  });

  test("handles pinyin with tone marks normally", async () => {
    const user = userEvent.setup();
    render(<PinyinToHanziInput />);

    // Change markdown to use pinyin with tone marks
    const markdownInput = screen.getByRole("textbox", {
      name: /markdown input/i,
    });
    await user.clear(markdownInput);
    await user.type(
      markdownInput,
      `---
# --fillInTheBlank--
## --sentence--
\`BLANK\`
## --blanks--
\`你好 (ni3 hao3)\`
`
    );

    // Get the incremental conversion input
    const incrementalSection = screen.getByRole("region", {
      name: /incremental conversion/i,
    });
    const input = incrementalSection.querySelector("input") as HTMLInputElement;

    // Type "ni3" - should convert immediately (has tone mark)
    await user.type(input, "ni3");
    expect(input.value).toBe("你");

    // Add " hao3" - should convert
    await user.type(input, " hao3");
    expect(input.value).toBe("你好");
  });
});
