import { useEffect, useRef } from 'react';

export function useDialog(onClose: () => void, active = true) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!active || !dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    (controls()[0] || dialog).focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close.current();
      }
      if (event.key === 'Tab') {
        const items = controls();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first) { event.preventDefault(); dialog.focus(); return; }
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    dialog.addEventListener('keydown', keydown);
    // Associate existing visible labels without changing the visual layout.
    const labelFields = () => {
      dialog.querySelectorAll('label').forEach((label, index) => {
      const field = label.querySelector('input, select, textarea') || label.parentElement?.querySelector('input, select, textarea');
      if (field && !field.getAttribute('aria-label')) {
        const id = field.id || `paw-field-${crypto.randomUUID()}-${index}`;
        field.id = id;
        label.htmlFor = id;
      }
    });
    };
    labelFields();
    const observer = new MutationObserver(labelFields);
    observer.observe(dialog, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      dialog.removeEventListener('keydown', keydown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [active]);
  return ref;
}
