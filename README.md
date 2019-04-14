# ifdef-helper README

VSCode Extension to help show active `#ifdef` statements in C and C++ code.

## Planned Features

- [x] Display the `#ifdef` statements active for any line of code.

- [x] Hover over any `#endif` to see its corresponding `#ifdef`.

- [ ] Jump between `#ifdef` and `#endif` statements.

- [ ] Add an auto-generated comment after an `#endif` statement referencing its corresponding `#ifdef`.

## Requirements

## Extension Settings

## Known Issues

* C block-style comments (`/* */`) are not stripped and may result in incorrect parsing.

* `#ifdef` statements are a terrible means of in-source configuration and should be avoided as much as possible.

* Comments added after `#endif` statements, like all comments, are not validated by the compiler to be correct and thus will often not be the most complete or up-to-date source of information available.

## Release Notes
