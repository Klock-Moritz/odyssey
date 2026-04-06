import { MIMEType } from "whatwg-mimetype";

/**
 * Extends {@link MIMEType} with parsed subtype components used by structured media types.
 */
export class MediaType extends MIMEType {
  /**
   * Registration tree prefix from the subtype (e.g. `vnd` in `vnd.api+json`).
   * Is `null` when no registration tree is present.
   */
  registrationTree: string | null;

  /**
   * Subtype without registration tree and structured syntax suffix.
   * Example: `api` in `vnd.api+json`.
   */
  innerSubtype: string;

  /**
   * Structured syntax suffix from the subtype (e.g. `json` in `problem+json`).
   * Is `null` when no structured syntax suffix is present.
   */
  structuredSyntaxSuffix: string | null;

  /**
   * Creates a parsed media type instance and derives commonly used subtype fragments.
   *
   * @param mediaType Full media type string, e.g. `application/vnd.api+json`.
   */
  constructor(mediaType: string) {
    super(mediaType);

    this.registrationTree = this.subtype.includes(".")
      ? this.subtype.split(".")[0] : null;
    this.structuredSyntaxSuffix = this.subtype.includes("+")
      ? this.subtype.split("+").slice(-1)[0] : null;

    this.innerSubtype = this.subtype.slice(
      this.registrationTree ? this.registrationTree.length + 1 : 0,
      this.structuredSyntaxSuffix ? -this.structuredSyntaxSuffix.length - 1 : undefined);
  }
}

/**
 * Creates a predicate that matches a media type by top-level type and structured syntax.
 *
 * A media type is considered a match when:
 * - its top-level type equals `type`, and
 * - either its structured syntax suffix equals `suffix`, or
 * - it has no structured syntax suffix and its inner subtype equals `suffix`.
 *
 * @param type Expected top-level media type (e.g. `application`).
 * @param suffix Expected structured suffix or fallback inner subtype (e.g. `json`).
 * @returns Predicate function for filtering or matching parsed media types.
 */
export function getStructuredMediaTypePredicate(type: string, suffix: string) {
  return (mediaType: MediaType) => mediaType.type === type && (
    mediaType.structuredSyntaxSuffix === suffix ||
    (mediaType.structuredSyntaxSuffix === null && mediaType.innerSubtype === suffix)
  );
}