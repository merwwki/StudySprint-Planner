# StudySprint Planner — Design System
[View PDF](assets/StudySprint%20Planner%20—%20Design%20System.pdf)

## Overview

The StudySprint Planner design system establishes consistent visual rules for the application's interface. It defines the principles for color, typography, spacing, reusable components, interface states, responsiveness, and accessibility.

The purpose is to maintain a consistent experience across the login screen, task dashboard, and task form.

## Design Principles

- **Clarity:** Present task information in an understandable format.
- **Consistency:** Use shared visual styles across screens and components.
- **Simplicity:** Keep common task-management actions easy to find.
- **Accessibility:** Maintain readable text, sufficient contrast, and visible focus indicators.
- **Responsiveness:** Support desktop and mobile screen sizes.

## Color

The interface uses a primary color for important actions, neutral backgrounds for content, readable text colors, and distinct feedback styles for success, warnings, and errors.

Color should support the information hierarchy without becoming the only way to communicate meaning. Text and controls must remain distinguishable against their backgrounds.

## Typography

Typography establishes hierarchy between page titles, section headings, body text, labels, and supporting information.

Page titles are visually prominent, section headings distinguish content areas, and body text remains readable. Labels and supporting information use consistent styling throughout the interface.

## Spacing

A consistent spacing scale is used to organize page sections, cards, form fields, buttons, and task details.

Spacing establishes visual grouping between related elements and sufficient separation between unrelated elements. The same spacing conventions are reused across screens.

## Components

### Buttons

Buttons provide clear actions for login, saving tasks, editing records, deleting tasks, and updating completion status.

Interactive buttons provide visible feedback for hover and keyboard focus. Disabled buttons are visually distinguishable when an action is unavailable, and loading feedback is provided when applicable.

### Form Inputs

Form inputs have clear labels and consistent dimensions. Focus states are visible, and validation messages explain incorrect or missing information.

### Task Items

Task items present available task details in a consistent arrangement. Their layout supports quick identification of task titles, subjects, due dates, priorities, and completion states.

### Feedback Messages

Feedback messages communicate the outcome of an action or explain when an operation cannot be completed. Error messages should be understandable and should not expose sensitive technical details.

## Interface States

The application accounts for the following states:

- **Loading:** Data or an operation is being processed.
- **Empty:** No tasks are available to display.
- **Error:** An operation fails or data cannot be retrieved.
- **Data:** Saved task records are displayed.
- **Completed:** A task is marked as completed.
- **Validation:** Input requires correction before submission.

Each state should communicate what is happening and, when appropriate, provide a clear next action.

## Responsive Design

The interface adapts to different viewport sizes. Content should remain readable, task details should fit within the available space, and controls should remain accessible on mobile devices.

Forms and task items should not cause horizontal overflow, and interactive elements should have sufficient space for touch input.

## Accessibility

The design supports keyboard navigation, visible focus indicators, readable typography, and sufficient color contrast. Form controls use descriptive labels, and interactive elements have understandable names.

Normal text should meet the WCAG minimum contrast ratio of 4.5:1 against its background. Color should not be the sole indicator of task priority, completion, or error status.

## Implementation

The project's CSS styles are maintained in `client/src/styles.css`. Shared CSS custom properties and reusable styling rules help maintain consistency across the interface.

## Conclusion

The StudySprint Planner design system provides a consistent foundation for the application's interface. Applying shared rules to typography, spacing, components, feedback, and accessibility helps make the application easier to understand and use.