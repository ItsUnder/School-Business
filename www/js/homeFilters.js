(function () {
  function initHomeFilters() {
    const swiperEl = document.querySelector('.swiperCategories');
    if (swiperEl && window.Swiper) {
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 10,
        freeMode: true,
      });
    }

    const container = document.querySelector('#recente');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.feed-card'));
    const buttons = Array.from(document.querySelectorAll('.swiperCategories button[data-filter]'));

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

      cards.forEach(card => {
        const cat = (card.dataset.category || '').toLowerCase();

        const show = (f === 'todas') || (cat === f);
        card.style.display = show ? '' : 'none';
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        setActive(btn);
        applyFilter(filter);
      });
    });

    const activeBtn = buttons.find(b => b.classList.contains('filter-btn-active')) || buttons[0];
    if (activeBtn) applyFilter(activeBtn.dataset.filter);
  }

  document.addEventListener('page:init', function (e) {
    if (e.target && e.target.matches('.page[data-name="home"]')) {
      initHomeFilters();
    }
  });

  document.addEventListener('DOMContentLoaded', initHomeFilters);
})();
