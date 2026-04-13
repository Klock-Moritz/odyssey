# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A new processing pipeline for Response objects.
- Utility functions for building the pipeline.

### Changed

- Refactoring of the ResponseViewer: now uses the new processing pipeline.
- Renamed `lib` directory to `utils`.
- HAL and schema/UI schema links now appear in the global link list.
- Schema and UI schema can be loaded from any link with the appropriate `rel`
  and `type`, not just from links in the response body.
- Global link list now supports templated links.
- Implicit `self` link is now infered from `location` header or the
  response URL if no explicit `self` link is present.
- Link for posting updates now taken from `self` links.
- Build now uses relative paths, allowing it to be served from any base URL.
- GitHub Pages build now includes storybook assets.

### Fixed

- Setting headers through the dialog caused the request to be sent.

## [0.1.0] - 2026-04-07

### Added

- Initial version of Odyssey Hypermedia Explorer.
- Supports generic response viewing and creation.
- Includes direct editing of the response and sending a subsequent PUT request.
- Displays response headers and parsed links from headers.
- Add form viewer for JSON-based responses.
- Add support for HAL-JSON media type, which displays links and embedded
  resources seperately.
- Add tabular viewers for CSV and TSV responses.