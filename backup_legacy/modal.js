document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('modalOverlay');
    const btnOpenContact = document.getElementById('btnOpenContact');
    const btnCloseModal = document.getElementById('btnCloseModal');
  
    // Open Modal
    if (btnOpenContact) {
      btnOpenContact.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('open');
      });
    }
  
    // Close Modal
    function closeModal() {
      modalOverlay.classList.remove('open');
    }
  
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeModal);
    }
  
    // Close on click outside
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
  
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
          closeModal();
        }
      });
    }
  });
