import { EditorView } from '@codemirror/view';
import { currentCompletions } from '@codemirror/autocomplete';

function editor() {
  const element = document.querySelector('.cm-content');
  const view =
    element instanceof HTMLElement && EditorView.findFromDOM(element);
  if (!view) throw new Error('Editor not mounted');
  return view;
}
let stale: (() => void) | undefined;
const editorTest = {
  cursor(pos: number) {
    const view = editor();
    view.dispatch({ selection: { anchor: pos } });
    view.focus();
  },
  capture(label: string) {
    const view = editor();
    const option = currentCompletions(view.state).find(
      (item) => item.label === label,
    );
    if (!option || typeof option.apply !== 'function')
      throw new Error('Missing candidate');
    const apply = option.apply;
    const pos = view.state.selection.main.head;
    const from = view.state.doc.toString().lastIndexOf('.', pos) + 1;
    stale = () => apply(editor(), option, from, pos);
  },
  applyStale() {
    stale?.();
  },
};
declare global {
  interface Window {
    editorTest: typeof editorTest;
  }
}
window.editorTest = editorTest;
