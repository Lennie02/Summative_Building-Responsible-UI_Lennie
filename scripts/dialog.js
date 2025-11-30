// scripts/dialog.js
// Delete Confirmation Dialog Module
const dialog = document.getElementById('delete-dialog');
const btnConfirm = document.getElementById('confirm-delete');
const btnCancel = document.getElementById('cancel-delete');

if (dialog) {
  let lastFocused = null;

  function openDeleteDialog(taskId = '') {
    lastFocused = document.activeElement;
    dialog.hidden = false;
    dialog.dataset.taskId = taskId;
    dialog.setAttribute('aria-hidden', 'false');
    btnCancel?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteDialog() {
    dialog.hidden = true;
    dialog.removeAttribute('aria-hidden');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    delete dialog.dataset.taskId;
  }

  btnCancel?.addEventListener('click', closeDeleteDialog);

  btnConfirm?.addEventListener('click', () => {
    const id = dialog.dataset.taskId || null;
    document.dispatchEvent(new CustomEvent('delete:confirm', { detail: { id } }));
    closeDeleteDialog();
  });

  document.addEventListener('keydown', (e) => {
    if (dialog.hidden) return;
    if (e.key === 'Escape') closeDeleteDialog();
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeDeleteDialog();
  });

  window.deleteDialog = { open: openDeleteDialog, close: closeDeleteDialog };
}
