# Object Namespaces: o-

* Objects are abstract.
* They can be used in any number of places across the project—places you might not have even seen.
* Avoid modifying their styles.
* Be careful around anything with a leading o-.

Signify that something is an Object, and that it may be used in any number of unrelated contexts to the one you can
currently see it in. Making modifications to these types of class could potentially have knock-on effects in a lot of
other unrelated places. Tread carefully.

Abstract out the repetitive, shared, and purely structural aspects of a UI into reusable objects. his means that things
like layout, wrappers and containers, the Media Object, etc. can all exist as non-cosmetic styles that handle the
skeletal aspect of a lot of UI components, without ever actually looking like designed ‘things’.

Format:

```css
.o-object-name[<__element>|<--modifier>] {}
```

Example:

```css
.o-layout {}

    .o-layout__item {}

.o-layout--fixed {}
```
