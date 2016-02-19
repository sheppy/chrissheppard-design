# Component Namespaces: c-

* Components are implementation-specific bits of UI.
* They are quite safe to modify.
* Anything with a leading c- is a specific thing.

Signify that something is a Component. This is a concrete, implementation-specific piece of UI. All of the changes
you make to its styles should be detectable in the context you’re currently looking at. Modifying these styles should
be safe and have no side effects.

Components are finite, discrete, implementation-specific parts of our UI that most people (users, designers, developers,
the business) would be able to identify: This is a button; This is the date picker; etc.

Usually when we make changes to a Component’s ruleset, we will immediately see those changes happening every- (and only)
where we’d expect. Unlike with Objects, changing the padding on the .c-modal__content should not affect anything else in
the site other than the content area of our modal. Where Objects are implementation-agnostic, Components are
implementation-specific.

Format:

```css
.c-component-name[<__element>|<--modifier>] {}
```

Example:

```css
.c-modal {}

    .c-modal__title {}

.c-modal--gallery {}
```
