(function () {
  function initMuralFilters(pageEl) {
    const root = pageEl || document;
    const swiperEl = root.querySelector('.swiperCategoriesMural');

    if (swiperEl && window.Swiper) {
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
      });
    }

    const buttons = Array.from(root.querySelectorAll('.swiperCategoriesMural button[data-filter]'));
    const sections = Array.from(root.querySelectorAll('.mural-section[data-section]'));

    if (!buttons.length || !sections.length) return;

    function setActive(btn) {
      buttons.forEach(b => {
        b.classList.remove('filter-btn-active');
        b.classList.add('filter-btn');
      });
      btn.classList.add('filter-btn-active');
      btn.classList.remove('filter-btn');
    }

    function applyFilter(filter) {
      const f = (filter || 'todas').toLowerCase();

      sections.forEach(sec => {
        const cat = (sec.dataset.section || '').toLowerCase();
        const show = (f === 'todas') || (cat === f);
        sec.style.display = show ? '' : 'none';
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        setActive(btn);
        applyFilter(btn.dataset.filter);
      });
    });

    const activeBtn = buttons.find(b => b.classList.contains('filter-btn-active')) || buttons[0];
    setActive(activeBtn);
    applyFilter(activeBtn.dataset.filter);
  }

  document.addEventListener('page:init', function (e) {
    const page = e.target;
    if (page && page.matches('.page[data-name="link2"]')) {
      initMuralFilters(page);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const page = document.querySelector('.page[data-name="link2"]');
    if (page) initMuralFilters(page);
  });
})();
