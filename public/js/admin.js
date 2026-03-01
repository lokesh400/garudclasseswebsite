/* ═══════════════════════════════════════════════════════════
   GARUD CLASSES - ADMIN JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sidebar toggle (mobile) ── */
  const sidebarToggle  = document.getElementById('sidebarToggle');
  const adminSidebar   = document.getElementById('adminSidebar');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  const openSidebar  = () => adminSidebar && adminSidebar.classList.add('open');
  const closeSidebar = () => adminSidebar && adminSidebar.classList.remove('open');

  if (sidebarToggle)  sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);

  document.addEventListener('click', (e) => {
    if (adminSidebar && adminSidebar.classList.contains('open') &&
        !adminSidebar.contains(e.target) && e.target !== sidebarToggle) {
      closeSidebar();
    }
  });

  /* ── 2. Image preview on file input change ── */
  document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function () {
      const preview = this.closest('.form-group')?.querySelector('.preview-img');
      if (!preview) return;
      const file = this.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
        reader.readAsDataURL(file);
      }
    });
  });

  /* ── 3. Flash alert auto-dismiss ── */
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
    alert.querySelector('.alert-close')?.addEventListener('click', () => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    });
  });

  /* ── 4. Confirm before delete ── */
  document.querySelectorAll('form[data-confirm], button[data-confirm]').forEach(el => {
    el.addEventListener('submit', (e) => {
      if (!confirm(el.dataset.confirm || 'Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });

  /* ── 5. Character counter for textareas with maxlength ── */
  document.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const max = ta.getAttribute('maxlength');
    const counter = document.createElement('small');
    counter.style.cssText = 'display:block;text-align:right;color:#718096;margin-top:4px;';
    counter.textContent = `0 / ${max}`;
    ta.after(counter);
    ta.addEventListener('input', () => {
      counter.textContent = `${ta.value.length} / ${max}`;
      counter.style.color = ta.value.length > max * 0.9 ? '#e63946' : '#718096';
    });
  });

});
