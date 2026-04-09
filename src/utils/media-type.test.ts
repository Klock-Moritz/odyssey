import { describe, expect, it } from "vitest";

import { getStructuredMediaTypePredicate, MediaType } from "./media-type";

type MediaTypeCase = {
  mediaType: string;
  registrationTree: string | null;
  innerSubtype: string;
  structuredSyntaxSuffix: string | null;
};

type PredicateMatchCase = {
  mediaType: string;
  matches: boolean;
};

type PredicateCase = {
  type: string;
  suffix: string;
  cases: PredicateMatchCase[];
};

function createMediaTypeCase(
  mediaType: string,
  registrationTree: string | null,
  innerSubtype: string,
  structuredSyntaxSuffix: string | null,
): MediaTypeCase {
  return {
    mediaType,
    registrationTree,
    innerSubtype,
    structuredSyntaxSuffix,
  };
}

function createPredicateMatchCase(mediaType: string, matches: boolean): PredicateMatchCase {
  return {
    mediaType,
    matches,
  };
}

function createPredicateCase(type: string, suffix: string, cases: PredicateMatchCase[]): PredicateCase {
  return {
    type,
    suffix,
    cases,
  };
}

const mediaTypeCases: MediaTypeCase[] = [
  createMediaTypeCase("application/json", null, "json", null),
  createMediaTypeCase("application/vnd.github", "vnd", "github", null),
  createMediaTypeCase("application/problem+json", null, "problem", "json"),
  createMediaTypeCase("application/vnd.api+json", "vnd", "api", "json"),
  createMediaTypeCase("application/vnd.microsoft.card.adaptive+json", "vnd", "microsoft.card.adaptive", "json"),
];

const predicateCases: PredicateCase[] = [
  createPredicateCase("application", "json", [
    createPredicateMatchCase("application/json", true),
    createPredicateMatchCase("application/problem+json", true),
    createPredicateMatchCase("application/vnd.api+json", true),
    createPredicateMatchCase("application/problem+xml", false),
    createPredicateMatchCase("application/problem", false),
    createPredicateMatchCase("text/json", false),
    createPredicateMatchCase("text/problem+json", false),
    createPredicateMatchCase("application/json+xml", false),
  ]),
  createPredicateCase("application", "problem", [
    createPredicateMatchCase("application/problem", true),
    createPredicateMatchCase("application/vnd.error+problem", true),
    createPredicateMatchCase("application/problem+json", false),
    createPredicateMatchCase("application/json", false),
    createPredicateMatchCase("text/problem", false),
  ]),
  createPredicateCase("application", "xml", [
    createPredicateMatchCase("application/problem+xml", true),
    createPredicateMatchCase("application/vnd.api+xml", true),
    createPredicateMatchCase("application/problem+json", false),
    createPredicateMatchCase("application/json", false),
    createPredicateMatchCase("text/problem+xml", false),
  ]),
  createPredicateCase("text", "json", [
    createPredicateMatchCase("text/json", true),
    createPredicateMatchCase("text/problem+json", true),
    createPredicateMatchCase("application/json", false),
    createPredicateMatchCase("application/problem+json", false),
    createPredicateMatchCase("text/problem+xml", false),
  ]),
];

describe("MediaType", () => {
  for (const testCase of mediaTypeCases) {
    it(`parses ${testCase.mediaType}`, () => {
      const mediaType = new MediaType(testCase.mediaType);

      expect(mediaType.registrationTree).toBe(testCase.registrationTree);
      expect(mediaType.innerSubtype).toBe(testCase.innerSubtype);
      expect(mediaType.structuredSyntaxSuffix).toBe(testCase.structuredSyntaxSuffix);
    });
  }
});

describe("getStructuredMediaTypePredicate", () => {
  for (const predicateCase of predicateCases) {
    const { type, suffix } = predicateCase;

    describe(`type=${type}, suffix=${suffix}`, () => {
      const predicate = getStructuredMediaTypePredicate(type, suffix);

      for (const testCase of predicateCase.cases) {
        it(`returns ${testCase.matches} for ${testCase.mediaType}`, () => {
          expect(predicate(new MediaType(testCase.mediaType))).toBe(testCase.matches);
        });
      }
    });
  }
});
