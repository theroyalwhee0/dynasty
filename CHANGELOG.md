# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] (v2.0.0-alpha.2)
### Fixed
- Fix missing declarations.
### Changed
- Move source map generation to separate files.


## [v2.0.0-alpha.1]
### Changed
- Improved documentation.
- Read only some values to improve safety.


## [v2.0.0-alpha.0]
### Added
- Full rewrite in TypeScript. This is a breaking change to the entire API.
    - Not all features from v1 are implemented yet.
    - Supports factory functions.
    - Supports classes factories.
    - Supports value instances.
    - Supports resolvable properties on records.
    - Supports configuration with selectors and get.
    - Added generated API documentation.
## Deprecated
- The v1.x JavaScript branch is no longer maintained.


## [1.0.5] - 2022-11-13
### Changed
- Update dependencies.
- Cleanup build to match other projects.


## [1.0.4] - 2022-06-02
### Changed
- Update dependencies.


## [1.0.3] - 2021-06-10
### Changed
- Update dependencies.
### Removed
- Remove reference to missing typings.


## [1.0.2] - 2021-02-15
### Added
- Add async callback support for config().


## [1.0.1] - 2021-02-14
### Fixed
- Fix link in readme.


## [1.0.0] - 2021-02-14
### Added
- Added config() to set configuration data.
- Added $cfg to attach to query and attach specific configuration items.
- Add API documentation.
### Changed
- Test impovements.
### Removed
- Remove TypeScript bindings.


## [0.0.10] - 2021-01-23
### Removed
- Remove code obsoleted by updated dependency-graph library.
- Remove debug code.
### Changed
- Fix README case.


## [0.0.9]
### Changed
- Improved TypeScript support.


## [0.0.8]
Add TypeScript bindings.
### Changed
- Update dependencies.


## [0.0.6]
## Changed
- Move promise helpers to @theroyalwhee0/please.
- Move istype to @theroyalwhee0/istype.

