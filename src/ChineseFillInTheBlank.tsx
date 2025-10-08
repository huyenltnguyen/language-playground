import React, { useState, useMemo } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import styles from "./ChineseFillInTheBlank.module.css";

// Pattern to match Chinese characters
const chineseCharPattern = /[\u4e00-\u9fff]/;

// Type for a parsed segment
type Segment = {
  type: "blank" | "text" | "ruby";
  content?: string;
  pinyin?: string;
  id?: number;
};

export function ChineseFillInTheBlank() {
  const [markdown, setMarkdown] = useState(
    `# Fill in the Blank Exercise

Try creating fill-in-the-blank exercises:

\`BLANK BLANK，王先生。(nǐ hǎo wáng xiān shēng)\`

\`BLANK BLANK，王先生。(BLANK BLANK wáng xiān shēng)\`

\`我 BLANK 学生。(wǒ shì xué shēng)\`
`
  );

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  // Parse the markdown to extract exercises
  const exercises = useMemo(() => {
    const codeBlockRegex = /`([^`]+)`/g;
    const matches = Array.from(markdown.matchAll(codeBlockRegex));

    return matches
      .map((match, idx) => {
        const content = match[1];
        // Check if it contains BLANK and parentheses with content
        const exercisePattern = /^(.+?)\s*\(([^)]+)\)$/;
        const exerciseMatch = content.match(exercisePattern);

        if (exerciseMatch && content.includes("BLANK")) {
          const text = exerciseMatch[1];
          const pinyinFull = exerciseMatch[2];

          return {
            id: idx,
            text: text,
            pinyin: pinyinFull,
            original: content,
          };
        }
        return null;
      })
      .filter((ex) => ex !== null);
  }, [markdown]);

  // Parse a single exercise into segments
  const parseExercise = (
    text: string,
    pinyin: string,
    exerciseId: number
  ): Segment[] => {
    const segments: Segment[] = [];
    let blankCounter = 0;

    // Tokenize the text into meaningful units (BLANK, Chinese chars, punctuation)
    const tokenizeText = (str: string): string[] => {
      const tokens: string[] = [];
      let i = 0;

      while (i < str.length) {
        // Check for BLANK keyword
        if (str.substring(i, i + 5) === "BLANK") {
          tokens.push("BLANK");
          i += 5;
          // Skip whitespace after BLANK
          while (i < str.length && /\s/.test(str[i])) {
            i++;
          }
        }
        // Check for Chinese character
        else if (chineseCharPattern.test(str[i])) {
          tokens.push(str[i]);
          i++;
        }
        // Check for whitespace (skip it)
        else if (/\s/.test(str[i])) {
          i++;
        }
        // Any other character (punctuation, etc.)
        else {
          tokens.push(str[i]);
          i++;
        }
      }

      return tokens;
    };

    const textTokens = tokenizeText(text);
    const pinyinParts = pinyin.split(/\s+/);

    let pinyinIndex = 0;

    textTokens.forEach((token) => {
      if (token === "BLANK") {
        const blankId = exerciseId * 1000 + blankCounter;
        blankCounter++;

        // Get corresponding pinyin for the blank (if not "BLANK")
        const correspondingPinyin =
          pinyinIndex < pinyinParts.length &&
          pinyinParts[pinyinIndex] !== "BLANK"
            ? pinyinParts[pinyinIndex]
            : undefined;

        segments.push({
          type: "blank",
          id: blankId,
          pinyin: correspondingPinyin,
        });

        // Move pinyin index forward
        pinyinIndex++;
      } else if (chineseCharPattern.test(token)) {
        // It's a Chinese character - get corresponding pinyin
        const correspondingPinyin =
          pinyinIndex < pinyinParts.length &&
          pinyinParts[pinyinIndex] !== "BLANK"
            ? pinyinParts[pinyinIndex]
            : undefined;

        segments.push({
          type: "ruby",
          content: token,
          pinyin: correspondingPinyin,
        });
        pinyinIndex++;
      } else {
        // Punctuation or other text - no pinyin
        segments.push({
          type: "text",
          content: token,
        });
      }
    });

    return segments;
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Generate HTML output for the exercises
  const htmlOutput = useMemo(() => {
    if (exercises.length === 0) return "";

    return exercises
      .map((exercise, exIdx) => {
        const segments = parseExercise(
          exercise.text,
          exercise.pinyin,
          exercise.id
        );

        const segmentsHtml = segments
          .map((segment) => {
            if (segment.type === "blank") {
              if (segment.pinyin) {
                return `<span class="${styles.blankWithPinyin}"><span class="${styles.pinyinAnnotation}" aria-hidden="true">${segment.pinyin}</span><input type="text" class="${styles.blankInput}" aria-label="Fill in the blank, pinyin hint: ${segment.pinyin}" /></span>`;
              } else {
                return `<input type="text" class="${styles.blankInput}" aria-label="Fill in the blank" />`;
              }
            } else if (segment.type === "ruby" && segment.pinyin) {
              return `<ruby class="${styles.rubyText}">${segment.content}<rp>(</rp><rt>${segment.pinyin}</rt><rp>)</rp></ruby>`;
            } else if (segment.type === "ruby") {
              return `<span class="${styles.rubyText}">${segment.content}</span>`;
            } else {
              return `<span class="${styles.textSegment}">${segment.content}</span>`;
            }
          })
          .join("");

        return `<div class="${styles.exercise}">
  <div class="${styles.sentenceWrapper}" role="group" aria-label="Exercise ${
          exIdx + 1
        }">
    ${segmentsHtml}
  </div>
</div>`;
      })
      .join("\n\n");
  }, [exercises]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Fill in the Blank
        </Typography>
      </header>

      <Box className={styles.content}>
        <Box className={styles.inputSection}>
          <Typography variant="h6" component="h2" gutterBottom>
            Markdown Input
          </Typography>
          <TextField
            multiline
            fullWidth
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            variant="outlined"
            placeholder="Type your markdown here..."
            className={styles.textArea}
            slotProps={{
              htmlInput: {
                "aria-label": "Markdown input for fill-in-the-blank exercises",
              },
            }}
          />
        </Box>

        <Box className={styles.rightPanel}>
          <Box className={styles.previewSection}>
            <Typography variant="h6" component="h2" gutterBottom>
              Preview
            </Typography>
            <Paper
              className={styles.preview}
              variant="outlined"
              component="section"
              aria-label="Preview"
            >
              {exercises.length === 0 ? (
                <Typography color="text.secondary">
                  No exercises found. Create exercises using <code>BLANK</code>{" "}
                  with pinyin in code blocks.
                </Typography>
              ) : (
                <div className={styles.exercisesWrapper}>
                  {exercises.map((exercise, exIdx) => {
                    const segments = parseExercise(
                      exercise.text,
                      exercise.pinyin,
                      exercise.id
                    );

                    return (
                      <div key={exercise.id} className={styles.exercise}>
                        <div
                          className={styles.sentenceWrapper}
                          role="group"
                          aria-label={`Exercise ${exIdx + 1}`}
                        >
                          {segments.map((segment, segIdx) => {
                            if (segment.type === "blank") {
                              return (
                                <span
                                  key={`${exercise.id}-${segIdx}`}
                                  className={styles.blankWrapper}
                                >
                                  {segment.pinyin ? (
                                    <span className={styles.blankWithPinyin}>
                                      <span
                                        className={styles.pinyinAnnotation}
                                        aria-hidden="true"
                                      >
                                        {segment.pinyin}
                                      </span>
                                      <input
                                        type="text"
                                        className={styles.blankInput}
                                        value={answers[segment.id!] || ""}
                                        onChange={(e) =>
                                          handleAnswerChange(
                                            segment.id!,
                                            e.target.value
                                          )
                                        }
                                        aria-label={`Fill in the blank, pinyin hint: ${segment.pinyin}`}
                                      />
                                    </span>
                                  ) : (
                                    <input
                                      type="text"
                                      className={styles.blankInput}
                                      value={answers[segment.id!] || ""}
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          segment.id!,
                                          e.target.value
                                        )
                                      }
                                      aria-label="BLANK"
                                    />
                                  )}
                                </span>
                              );
                            } else if (
                              segment.type === "ruby" &&
                              segment.pinyin
                            ) {
                              return (
                                <ruby
                                  key={`${exercise.id}-${segIdx}`}
                                  className={styles.rubyText}
                                >
                                  {segment.content}
                                  <rp>(</rp>
                                  <rt>{segment.pinyin}</rt>
                                  <rp>)</rp>
                                </ruby>
                              );
                            } else if (segment.type === "ruby") {
                              return (
                                <span
                                  key={`${exercise.id}-${segIdx}`}
                                  className={styles.rubyText}
                                >
                                  {segment.content}
                                </span>
                              );
                            } else {
                              return (
                                <span
                                  key={`${exercise.id}-${segIdx}`}
                                  className={styles.textSegment}
                                >
                                  {segment.content}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Paper>
          </Box>

          <Box className={styles.htmlOutputSection}>
            <Typography variant="h6" component="h2" gutterBottom>
              HTML Output
            </Typography>
            <Paper
              className={styles.htmlCode}
              variant="outlined"
              component="section"
              aria-label="HTML code output"
            >
              <pre className={styles.htmlCodeContent}>
                <code>{htmlOutput}</code>
              </pre>
            </Paper>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
