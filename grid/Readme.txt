# Sanity Grid Readme

This document provides an in-depth explanation of how the Sanity Grid works in this codebase and how it integrates into the Sanity Studio.

---

## Overview

The Sanity Grid is a custom input component for Sanity Studio that allows editors to visually manage an array of "Grid Items" on a grid layout. Each item can contain a single "component" (e.g., hero, motto, toggle, textBlock), along with positioning data (row, column, width, height). This makes it possible to lay out content modules in a more visual and spatially-aware way.

## Files Involved

1. **`grid/plugin.ts`**  
   - Defines the `griditem` and `sanitygrid` schemas.
   - `griditem` schema has:
     - `component`: An array with a `max(1)` constraint, allowing only one of the defined component types (hero, motto, toggle, textBlock) at a time.
     - `settings`: An object containing fields for positioning, width, and height (the `gridItemSettings` object).
     - `sortOrder`: A numeric field for controlling item order in queries.
   - `sanitygrid` schema has:
     - `grid`: An array of `griditem`.
     - `layoutSettings`: An object that contains fields like `columns` and `rows`.

2. **`grid/SanityGrid.tsx`**  
   - A custom React input component for the `gridArray` (the array of `griditem`).
   - Renders all grid items inside a `ul` with CSS Grid styles.
   - Each item is draggable (using `gsap/Draggable`).
   - Upon drag end, the item’s position is updated (row/column).
   - Handles adding new items and removing existing ones.

3. **`grid/components/itemValue.tsx`**  
   - Responsible for rendering the preview of each Grid Item in the UI and providing an “edit” modal.
   - Uses Sanity’s built-in `ObjectInput` to manage fields.

4. **`grid/utils/`**  
   - Various utility functions used by the main grid input component:
     - `useEventListener.ts`: Custom React hook for attaching/detaching event listeners.
     - `randomKey.ts`: Generates random keys for new items.
     - `resolveJSType.ts` and `index.ts`: Helpers for determining the JavaScript type of a given value, generating prototypes, etc.

5. **`schemaTypes/page.ts`, `schemaTypes/gridBlock.ts`, or other references**  
   - Demonstrate how to attach a `sanitygrid` or `griditem` within other document schemas.

---

## How It Works

1. **Schema Definition**  
   - In `grid/plugin.ts`, the `grid` plugin is defined and includes the schema types. When installed in `sanity.config.ts`, it registers:
     - `gridItemSettings`: Describes how an item is placed in a grid.
     - `griditem`: Combines a single component (hero, motto, toggle, textBlock) and an associated `gridItemSettings`.
     - `sanitygrid`: An object that references an array of `griditem` (`gridArray`) and optional layout settings.

2. **Rendering in the Studio**  
   - The `griditem` array uses a custom input, `SanityGrid`, registered via `components.input = SanityGrid;` in the array’s schema. This ties the UI of the grid to that specific array field.

3. **Visual Editing**  
   - Each item in the array is displayed as a draggable `li` in a CSS Grid layout.
   - The drag-and-drop logic is powered by `gsap/Draggable`. Once an item is dropped, its column and row values are recalculated based on the position.

4. **Item Editing**  
   - Clicking on an item opens a modal that uses the `ObjectInput` from Sanity. This allows the user to edit or remove the selected item’s fields. Since `component` is an array of possible content blocks (hero, motto, toggle, textBlock), only one block can be present at a time (due to the `validation: (Rule) => Rule.max(1)` constraint).
   - The preview or label for an item is typically taken from the nested component’s title field and variant.

5. **Layout Settings**  
   - The `layoutSettings` object in `sanitygrid` can define how many columns and rows the grid should have. The fallback logic (in the code) sets default columns/rows if none are provided.

---

## Key Highlights

- **`Draggable` from `gsap`**  
  The library is used to create an intuitive drag-and-drop experience. Once the user stops dragging, the code calculates the new row/column based on the drop position.
  
- **`ObjectInput`**  
  By leveraging Sanity’s `ObjectInput`, the plugin seamlessly integrates with the standard forms approach, letting users edit fields in a popup.

- **`createProtoValue`**  
  When adding a new item, the system uses a function that generates a basic object (with `_key` and `_type`) to be inserted into the array, ensuring each item can be tracked by Sanity.

- **Scoped CSS**  
  The grid’s styling is isolated in `component.module.css` to keep the layout visually consistent while ensuring it doesn’t leak into other parts of the Studio.

---

## Use Cases

- **Landing Page Builder**:  
  Editors can drag-and-drop their hero, text blocks, toggles, or other custom components in a grid layout, effectively building a microsite layout without code changes.

- **Dashboard Layout**:  
  Great for building interactive dashboards with different widgets (each an item in the grid).

---

## Next Steps

- **Customization**  
  Potential expansions include custom settings for spacing, background color, or breakpoints. This could be configured in `layoutSettings`.

- **Enhancing Items**  
  By adding more component types (like videos, forms, or images), the grid can become a robust visual layout builder.

- **Performance**  
  If a page has many grid items or large media, consider lazy loading or additional optimizations.

---

## Conclusion

The Sanity Grid provides a highly flexible, visual editing experience for array-based content. By leveraging custom schemas, a custom input component, and GSAP’s Draggable library, editors can manage complex page layouts or modular dashboards with ease.