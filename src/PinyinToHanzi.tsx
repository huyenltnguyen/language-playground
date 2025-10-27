import React, { useMemo, useState, useEffect } from "react";
import { Box, Paper, TextField, Typography } from "@mui/material";
import toPinyinTones from "pinyin-tone";
import styles from "./PinyinToHanzi.module.css";

type ParsedBlank = {
  id: string;
  hanzi: string;
  characters: string[];
  pinyinParts: string[];
};

type ParsedMarkdown = {
  title: string;
  description: string;
  instructions: string;
  sentence: string;
  blanks: ParsedBlank[];
};

type BlankInputState = {
  raw: string;
  value: string;
  matched: boolean;
};

const defaultMarkdown = `---
id: 68fe153a6494282327edcb3a
title: Task 4
challengeType: 22
dashedName: task-4
inputType: pinyin-to-hanzi
---

<!-- (Audio) Wang Hua: 请问 (qǐng wèn) -->

# --description--

Wang Hua wants to politely ask someone's name. She uses a word before asking a question to show respect.

# --instructions--

Listen to the audio and complete the sentence below.

# --fillInTheBlank--

## --sentence--

\`BLANK\`

## --blanks--

\`请问 (qǐng wèn)\`
`;

const blankPattern = /^(.+?)\s*\(([^)]+)\)\s*$/;

const convertPinyinToHanzi = (input: string, blank: ParsedBlank) => {
  if (!input.trim()) return "";

  // Check each expected character/pinyin pair
  let remaining = input.trim();
  const result: string[] = [];

  for (let i = 0; i < blank.characters.length; i++) {
    const expectedChar = blank.characters[i];
    const expectedPinyin = blank.pinyinParts[i];

    // Check if remaining starts with the expected hanzi
    if (remaining.startsWith(expectedChar)) {
      result.push(expectedChar);
      remaining = remaining.slice(expectedChar.length).trim();
      continue;
    }

    // Convert remaining to toned pinyin and check for match
    const toned = toPinyinTones(remaining.toLowerCase());
    const tonedSegments = toned.split(/\s+/).filter(Boolean);

    if (tonedSegments[0] === expectedPinyin) {
      result.push(expectedChar);
      // Remove the first segment from remaining
      const firstSegment = remaining.split(/\s+/)[0];
      remaining = remaining.slice(firstSegment.length).trim();
    } else {
      // No match - stop here and return what we have plus remaining
      break;
    }
  }

  // Add any remaining input
  if (remaining) {
    const tonedRemaining = toPinyinTones(remaining.toLowerCase());
    result.push(tonedRemaining);
  }

  return result.join("");
};

const convertPinyinToHanziFullMatch = (input: string, blank: ParsedBlank) => {
  if (!input.trim()) return "";

  // Convert entire input to toned pinyin
  const toned = toPinyinTones(input.toLowerCase().trim());

  // Build all possible expected pinyin variations
  const expectedWithSpaces = blank.pinyinParts.join(" ");
  const expectedNoSpaces = blank.pinyinParts.join("");

  // Check for match
  if (toned === expectedWithSpaces || toned === expectedNoSpaces) {
    return blank.hanzi;
  }

  // No match - return the toned pinyin
  return toned;
};

const extractFrontMatterValue = (markdown: string, key: string) => {
  const frontMatterMatch = markdown.match(/^---([\s\S]*?)---/);
  if (!frontMatterMatch) return "";

  const regex = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const match = frontMatterMatch[1].match(regex);
  return match ? match[1].trim() : "";
};

const extractSection = (
  markdown: string,
  startMarker: string,
  endMarkers: string[]
) => {
  const startIndex = markdown.indexOf(startMarker);
  if (startIndex === -1) {
    return "";
  }

  const contentStart = startIndex + startMarker.length;
  const rest = markdown.slice(contentStart);

  let endIndex = rest.length;
  endMarkers.forEach((marker) => {
    const markerIndex = rest.indexOf(marker);
    if (markerIndex !== -1 && markerIndex < endIndex) {
      endIndex = markerIndex;
    }
  });

  return rest.slice(0, endIndex).trim();
};

const extractCodeBlocks = (input: string) => {
  const matches = Array.from(input.matchAll(/`([^`]+)`/g));
  return matches.map((match) => match[1].trim());
};

const parseMarkdown = (markdown: string): ParsedMarkdown => {
  const title =
    extractFrontMatterValue(markdown, "title") || "Pinyin to Chinese";
  const description = extractSection(markdown, "# --description--", [
    "# --instructions--",
  ]);
  const instructions = extractSection(markdown, "# --instructions--", [
    "# --fillInTheBlank--",
  ]);
  const sentenceSection = extractSection(markdown, "## --sentence--", [
    "## --blanks--",
  ]);
  const blanksSection = extractSection(markdown, "## --blanks--", [
    "### --feedback--",
    "# --explanation--",
  ]);

  const sentenceCodes = extractCodeBlocks(sentenceSection);
  const sentence = sentenceCodes[0] || sentenceSection.replace(/`/g, "").trim();

  const blankCodes = extractCodeBlocks(blanksSection);
  const blanks = blankCodes
    .map((code, index) => {
      const match = code.match(blankPattern);
      if (!match) return null;

      const hanzi = match[1].trim();
      const rawPinyin = match[2].trim();
      const characters = Array.from(hanzi);
      const segments = rawPinyin.split(/\s+/).filter(Boolean);
      const pinyinParts = segments.map((part) => toPinyinTones(part));
      return {
        id: `blank-${index}`,
        hanzi,
        characters,
        pinyinParts,
      };
    })
    .filter((entry): entry is ParsedBlank => entry !== null);

  return {
    title,
    description,
    instructions,
    sentence,
    blanks,
  };
};

export function PinyinToHanzi() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  const parsed = useMemo(() => parseMarkdown(markdown), [markdown]);

  const [inputs, setInputs] = useState<BlankInputState[]>(() =>
    parsed.blanks.map(() => ({ raw: "", value: "", matched: false }))
  );

  const [fullMatchInputs, setFullMatchInputs] = useState<BlankInputState[]>(
    () => parsed.blanks.map(() => ({ raw: "", value: "", matched: false }))
  );

  useEffect(() => {
    setInputs(
      parsed.blanks.map(() => ({ raw: "", value: "", matched: false }))
    );
    setFullMatchInputs(
      parsed.blanks.map(() => ({ raw: "", value: "", matched: false }))
    );
  }, [parsed.blanks, parsed.sentence]);

  const sentenceParts = useMemo(
    () => parsed.sentence.split(/BLANK/g),
    [parsed.sentence]
  );

  const handleBlankChange = (index: number, nextValue: string) => {
    const blank = parsed.blanks[index];
    if (!blank) return;

    const displayValue = convertPinyinToHanzi(nextValue, blank);

    // Check if fully matched
    const matched = displayValue === blank.hanzi;

    setInputs((prev) =>
      prev.map((state, idx) =>
        idx === index
          ? {
              raw: nextValue,
              value: displayValue,
              matched,
            }
          : state
      )
    );
  };

  const handleFullMatchBlankChange = (index: number, nextValue: string) => {
    const blank = parsed.blanks[index];
    if (!blank) return;

    // Convert to check if it matches
    const converted = convertPinyinToHanziFullMatch(nextValue, blank);
    const matched = converted === blank.hanzi;

    // If matched, show hanzi; otherwise show raw input
    const displayValue = matched ? blank.hanzi : nextValue;

    setFullMatchInputs((prev) =>
      prev.map((state, idx) =>
        idx === index
          ? {
              raw: nextValue,
              value: displayValue,
              matched,
            }
          : state
      )
    );
  };

  const blankCountInSentence = parsed.sentence.match(/BLANK/g)?.length || 0;
  const hasMismatch = blankCountInSentence !== parsed.blanks.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Typography variant="h4" component="h1">
          {parsed.title || "Pinyin to Chinese"}
        </Typography>
        <Typography variant="body1" color="text.secondary" component="p">
          Convert numbered or toned Pinyin into Chinese characters using the
          blanks provided in the markdown.
        </Typography>
      </header>

      <Box className={styles.content}>
        <Box className={styles.leftPanel}>
          <Typography variant="h6" component="h2" gutterBottom>
            Markdown Input
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={16}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            variant="outlined"
            className={styles.textArea}
            slotProps={{
              htmlInput: {
                "aria-label": "Markdown input for pinyin to Chinese exercises",
              },
            }}
          />
        </Box>

        <Box className={styles.rightPanel}>
          <Typography variant="h6" component="h2" gutterBottom>
            Exercise Preview
          </Typography>

          <Box className={styles.exercisesGrid}>
            {/* Incremental Conversion Panel */}
            <Paper
              className={styles.preview}
              variant="outlined"
              component="section"
              aria-label="Incremental conversion exercise"
            >
              <Typography
                variant="subtitle2"
                component="h3"
                gutterBottom
                className={styles.methodTitle}
              >
                Incremental Conversion
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                gutterBottom
                className={styles.methodDescription}
              >
                Converts each pinyin syllable to hanzi as you type.
                <br />
                Try typing qing3wen4.
              </Typography>

              <div className={styles.sectionBlock}>
                {parsed.description && (
                  <Typography
                    variant="body1"
                    component="p"
                    className={styles.sectionText}
                  >
                    {parsed.description}
                  </Typography>
                )}

                {parsed.instructions && (
                  <Typography
                    variant="body2"
                    component="p"
                    className={styles.sectionText}
                  >
                    {parsed.instructions}
                  </Typography>
                )}
              </div>

              <div className={styles.sentenceWrapper}>
                {sentenceParts.map((part, partIndex) => (
                  <React.Fragment key={`inc-part-${partIndex}`}>
                    {part && (
                      <span className={styles.sentenceText}>{part}</span>
                    )}
                    {partIndex < parsed.blanks.length && (
                      <TextField
                        value={inputs[partIndex]?.value ?? ""}
                        onChange={(event) =>
                          handleBlankChange(partIndex, event.target.value)
                        }
                        className={styles.blankInput}
                        aria-label={`Enter pinyin for blank ${partIndex + 1}`}
                        variant="outlined"
                        InputProps={{
                          classes: {
                            root: inputs[partIndex]?.matched
                              ? styles.matchedInput
                              : styles.unmatchedInput,
                            input: styles.inputField,
                          },
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {hasMismatch && (
                <Typography
                  variant="body2"
                  color="error"
                  role="alert"
                  className={styles.mismatchWarning}
                >
                  The number of BLANK placeholders in the sentence does not
                  match the number of entries in the blanks list.
                </Typography>
              )}
            </Paper>

            {/* Full Match Conversion Panel */}
            <Paper
              className={styles.preview}
              variant="outlined"
              component="section"
              aria-label="Full match conversion exercise"
            >
              <Typography
                variant="subtitle2"
                component="h3"
                gutterBottom
                className={styles.methodTitle}
              >
                Full Match Conversion
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                gutterBottom
                className={styles.methodDescription}
              >
                Only converts when the full phrase matches exactly. Requires a
                space between syllables.
                <br />
                Try typing qing3 wen4.
              </Typography>

              <div className={styles.sectionBlock}>
                {parsed.description && (
                  <Typography
                    variant="body1"
                    component="p"
                    className={styles.sectionText}
                  >
                    {parsed.description}
                  </Typography>
                )}

                {parsed.instructions && (
                  <Typography
                    variant="body2"
                    component="p"
                    className={styles.sectionText}
                  >
                    {parsed.instructions}
                  </Typography>
                )}
              </div>

              <div className={styles.sentenceWrapper}>
                {sentenceParts.map((part, partIndex) => (
                  <React.Fragment key={`full-part-${partIndex}`}>
                    {part && (
                      <span className={styles.sentenceText}>{part}</span>
                    )}
                    {partIndex < parsed.blanks.length && (
                      <TextField
                        value={fullMatchInputs[partIndex]?.value ?? ""}
                        onChange={(event) =>
                          handleFullMatchBlankChange(
                            partIndex,
                            event.target.value
                          )
                        }
                        className={styles.blankInput}
                        aria-label={`Enter pinyin for blank ${partIndex + 1}`}
                        variant="outlined"
                        InputProps={{
                          classes: {
                            root: fullMatchInputs[partIndex]?.matched
                              ? styles.matchedInput
                              : styles.unmatchedInput,
                            input: styles.inputField,
                          },
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {hasMismatch && (
                <Typography
                  variant="body2"
                  color="error"
                  role="alert"
                  className={styles.mismatchWarning}
                >
                  The number of BLANK placeholders in the sentence does not
                  match the number of entries in the blanks list.
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
