/**
 * Utility functions for Telegram message formatting
 */

/**
 * Formats a message for Telegram with proper escaping based on parse mode
 * @param text The text to format
 * @param parseMode The parse mode ('MarkdownV2', 'Markdown', or undefined for plain text)
 * @param preserveFormatting If true, preserves formatting characters like * and _ for bold and italic
 * @returns The formatted text ready for sending to Telegram
 */

const replaceAll =
  String.prototype.replaceAll ||
  function (searchValue, replaceValue) {
    return this.split(searchValue).join(replaceValue);
  };

// Characters that need escaping with double backslash
const markdownV2EscapeList = [
  '_',
  '[',
  ']',
  '(',
  ')',
  '~',
  '`',
  '>',
  '#',
  '+',
  '-',
  '=',
  '|',
  '{',
  '}',
  '.',
  '!',
];

export function formatTelegramMessage(
  text: string,
  parseMode: 'MarkdownV2' | 'Markdown' = 'MarkdownV2',
): string {
  if (!text) return '';

  if (parseMode === 'MarkdownV2') {
    // Then handle double escape characters
    return markdownV2EscapeList.reduce(
      (oldText, charToEscape) =>
        replaceAll.call(oldText, charToEscape, `\\${charToEscape}`),
      text,
    );
  }

  // For Markdown mode or plain text, no escaping needed
  return text;
}
