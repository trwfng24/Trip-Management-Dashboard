# Trip workspace state design

## Goal

Make the mockup's two remaining fake trips—Đà Nẵng cuối tuần and Hà Nội food tour—fully independent. A change in one trip must update every related tab for that trip only, without affecting the other trip. State remains in memory for the browser session and is not persisted across refreshes.

## State model

`trips` stores only trip metadata and a stable ID. A `workspaces` map is keyed by that ID. Each workspace owns its own mutable data:

- `members`
- `plansByDay`
- `tasks`
- `expenses`
- `documents`
- `opinions`
- `notifications`
- `googleForm`

The Hà Nội and Đà Nẵng workspaces use separate arrays and objects. No default mutable array or object is shared between them. Creating a trip adds a new empty workspace with the same shape.

## Rendering and mutations

`activeTrip` identifies the open trip and a workspace accessor returns its state. All existing renderers read through that accessor.

Every mutating UI action writes only to the active workspace, then calls the common renderer. This includes tasks, activities, expenses, documents, opinions, notifications and Google Form configuration. Editing trip metadata updates the matching trip record, while its workspace remains attached to the same stable ID.

## Derived data

The following values are always derived from the active workspace rather than copied into separate state:

- Overview timeline and unfinished checklist
- Checklist completion count and progress
- Expense total, budget percentage and payer summary
- Per-member settlement, including the owner-receives-remainder split rule
- Export builder summary and PDF preview

Changing a trip's member list updates the member selectors used by task assignment and expense splitting, as well as the settlement and export views.

## UX rules

- The trip collection contains only Đà Nẵng cuối tuần and Hà Nội food tour.
- Switching trips immediately re-renders all tabs from the selected trip's workspace.
- A newly created trip starts with empty workspace collections and no inherited mutable state.
- There is no localStorage, backend persistence or cross-trip synchronization.

## Verification

Automated tests will cover switching trips, mutation isolation, derived task and expense values, and empty-workspace creation. Existing tests must continue to pass.
