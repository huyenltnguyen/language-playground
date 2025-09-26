import React, { useState, useMemo } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import { marked } from "marked";
import styles from "./MarkdownToRuby.module.css";

// Create a regex to detect Chinese characters and pinyin pattern
const chinesePinyinPattern = /^([^\s()]+)\s*\(([^)]+)\)$/;
const chineseCharPattern = /[\u4e00-\u9fff]/;

function MarkdownToRuby() {
  const [markdown, setMarkdown] = useState(
    `# Markdown to Ruby Demo

Try typing some markdown with Chinese and Pinyin:

Regular text with \`你好 (nǐ hǎo)\` - this should become a ruby element.

Just Chinese: \`你好\` - this stays as regular text.

Just Pinyin: \`nǐ hǎo\` - this also stays as regular text.

Single words: \`你 (nǐ)\` \`好 (hǎo)\`.`
  );

  // Configure marked with custom renderer for codespan
  const configuredMarked = useMemo(() => {
    marked.use({
      renderer: {
        codespan(token: any) {
          const text = token.text;

          // Check if the text matches the Chinese + pinyin pattern
          const match = text.match(chinesePinyinPattern);
          if (match) {
            const chinese = match[1].trim();
            const pinyin = match[2].trim();

            // Verify that the first part contains Chinese characters
            if (chineseCharPattern.test(chinese)) {
              // Return a ruby element wrapped in a span for styling
              return `<span class="${styles.rubyWrapper}"><ruby>${chinese}<rt>${pinyin}</rt></ruby></span>`;
            }
          }

          return `<span class="${styles.plainText}">${text}</span>`;
        },
      },
    });

    return marked;
  }, []);

  const htmlOutput = useMemo(() => {
    try {
      return configuredMarked.parse(markdown);
    } catch (error) {
      return `<p>Error parsing markdown: ${
        error instanceof Error ? error.message : "Unknown error"
      }</p>`;
    }
  }, [markdown, configuredMarked]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Typography variant="h4" component="h1" gutterBottom>
          Markdown to Ruby 💎
        </Typography>
        <div className={styles.descriptionWrapper}>
          <Typography
            variant="body1"
            color="text.secondary"
            component="p"
            gutterBottom
          >
            Ruby annotations show how to pronounce Chinese characters, making
            reading easier for everyone.
          </Typography>
          <Typography variant="body1" color="text.secondary" component="p">
            This tool converts markdown to HTML and displays Chinese text with
            Pinyin using the ruby element.
          </Typography>
        </div>
      </header>

      <Box className={styles.content}>
        <Box className={styles.inputSection}>
          <Typography variant="h6" component="h2" gutterBottom>
            Markdown Input
          </Typography>
          <TextField
            multiline
            fullWidth
            rows={12}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            variant="outlined"
            placeholder="Type your markdown here..."
            className={styles.textArea}
            slotProps={{
              htmlInput: {
                "aria-label": "Markdown input",
              },
            }}
          />
        </Box>

        <Box className={styles.outputSection}>
          <Typography variant="h6" component="h2" gutterBottom>
            HTML Output
          </Typography>
          <Paper
            className={styles.preview}
            variant="outlined"
            component="section"
            aria-label="HTML preview"
          >
            <div
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
              className={styles.htmlContent}
              role="document"
              aria-live="polite"
              aria-label="Rendered HTML output"
            />
          </Paper>
        </Box>
      </Box>
    </div>
  );
}

export default MarkdownToRuby;
