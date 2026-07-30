/**
 * How a comma-or-newline free-text field becomes the list the backend wants
 * (`tools[]`, `other_links[]`).
 *
 * Shared between the Zod schema that validates such a field and the payload
 * mapper that sends it, because the two disagreeing is exactly the bug this
 * replaces: "Other Links" was mapped as a list but validated as a single URL,
 * so entering the second link the field asks for failed validation.
 */

/** Commas and newlines both separate entries, in any run and any mix. */
const SEPARATOR = /[\n,]+/;

/** `"Figma, Photoshop\nNotion"` → `["Figma", "Photoshop", "Notion"]`. */
export function splitList(value: string | undefined | null): string[] {
  return (value ?? "")
    .split(SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean);
}
