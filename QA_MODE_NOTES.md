# QA Checklist - Configure vs Review Modes

## Configure Mode
- [ ] Load `/builder` and verify sidebar, forms, prompt editor, and preview render as before.
- [ ] Cmd/Ctrl + Enter generates a prompt and leaves the UI in Configure mode.
- [ ] Cmd/Ctrl + B toggles the advanced panel.

## Transition to Review & Iterate Mode
- [ ] Click Generate Website (or Cmd/Ctrl + Shift + G) and confirm:
  - Sidebar collapses into floating history control.
  - Prompt editor is hidden.
  - Summary banner shows active sections and layout type with an Edit settings button.
  - Chat panel appears with the generated prompt as the first message.
  - Preview expands and includes Desktop/Mobile toggle.
- [ ] History drawer opens via floating History button or Cmd/Ctrl + H, and can be dismissed.

## Review Mode Interactions
- [ ] Drag the vertical handle between chat and preview to resize (preview stays =60% width) and Reset layout returns it to default.
- [ ] Send a chat message and confirm a new Update request is appended to the prompt context.
- [ ] Suggested chips add canned messages and trigger the same prompt update.
- [ ] Regenerate button runs the existing generate flow without leaving Review mode.

## Return to Configure Mode
- [ ] Use Edit settings button or Cmd/Ctrl + E to restore the full configuration workspace with previous selections intact.
- [ ] Verify prompt editor still contains prior edits after returning.

## Responsive & Theme
- [ ] On small screens, review layout stacks vertically without layout breakage.
- [ ] Toggle between light/dark themes and ensure chat, preview, and summary styles remain legible.