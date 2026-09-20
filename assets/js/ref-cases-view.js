(function () {
  'use strict';
  var DATA = window.REFCASES || [];
  var PER = 24;
  var page = 1, q = '';
  var grid    = document.getElementById('refGrid');
  var pager   = document.getElementById('refPager');
  var empty   = document.getElementById('refEmpty');
  var countEl = document.getElementById('refCount');
  var searchEl= document.getElementById('refSearch');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function hay(x) { return (x.t + ' ' + x.d + ' ' + x.g).toLowerCase(); }
  function filtered() { return q ? DATA.filter(function (x) { return hay(x).indexOf(q) !== -1; }) : DATA; }
  function pageBtn(n, label, active, disabled) {
    return '<button type="button" data-page="' + n + '"' +
      (active ? ' class="active"' : '') + (disabled ? ' disabled' : '') + '>' + label + '</button>';
  }

  function render() {
    var list = filtered();
    var pages = Math.max(1, Math.ceil(list.length / PER));
    if (page > pages) page = pages;
    var slice = list.slice((page - 1) * PER, page * PER);

    grid.innerHTML = slice.map(function (x) {
      var img = x.i
        ? '<img src="' + x.i + '" alt="' + esc(x.t) + '" loading="lazy" width="640" height="400">'
        : '';
      return '<article class="ref-card">' +
        '<button type="button" class="ref-cover" data-img="' + esc(x.i) + '" data-t="' + esc(x.t) + '">' + img +
          '<span class="ref-open">放大看</span></button>' +
        '<div class="ref-body">' +
          '<h3>' + esc(x.t) + '</h3>' +
          '<p>' + esc(x.d) + '</p>' +
          '<span class="ref-tag">' + esc(x.s || x.g) + '</span>' +
        '</div></article>';
    }).join('');

    if (empty) empty.hidden = list.length > 0;

    var html = '';
    if (pages > 1) {
      html += pageBtn(page - 1, '上一页', false, page <= 1);
      var s = Math.max(1, page - 3), e = Math.min(pages, s + 6);
      if (s > 1) html += pageBtn(1, '1', page === 1, false) + (s > 2 ? '<span class="ref-dots">…</span>' : '');
      for (var i = s; i <= e; i++) html += pageBtn(i, String(i), i === page, false);
      if (e < pages) html += (e < pages - 1 ? '<span class="ref-dots">…</span>' : '') + pageBtn(pages, String(pages), page === pages, false);
      html += pageBtn(page + 1, '下一页', false, page >= pages);
    }
    if (pager) pager.innerHTML = html;
    if (countEl) countEl.innerHTML = '共 <strong>' + list.length + '</strong> 个参考案例' +
      (q ? ' · 搜索「' + esc(q) + '」' : '') + (pages > 1 ? ' · 第 ' + page + ' / ' + pages + ' 页' : '');
  }

  if (pager) pager.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button[data-page]') : null;
    if (!b || b.disabled) return;
    page = parseInt(b.getAttribute('data-page'), 10) || 1;
    render();
    var tools = document.querySelector('.ref-tools');
    if (tools) tools.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  var timer;
  if (searchEl) searchEl.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { q = searchEl.value.trim().toLowerCase(); page = 1; render(); }, 180);
  });

  /* 点卡片站内放大看图 */
  var lb = document.getElementById('refLightbox');
  var lbImg = lb ? lb.querySelector('img') : null;
  function closeLb() { if (lb) { lb.hidden = true; document.body.style.overflow = ''; } }
  document.addEventListener('click', function (e) {
    var cover = e.target.closest ? e.target.closest('.ref-cover') : null;
    if (cover && lb && lbImg) {
      lbImg.src = cover.getAttribute('data-img') || '';
      lbImg.alt = cover.getAttribute('data-t') || '';
      lb.hidden = false; document.body.style.overflow = 'hidden';
      return;
    }
    if (lb && !lb.hidden && (e.target === lb || e.target.classList.contains('ref-lb-close'))) closeLb();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* 说明条里的数量跟着数据走，避免删改后对不上 */
  var srcEl = document.getElementById('refSrc');
  if (srcEl) srcEl.textContent = '（共 ' + DATA.length + ' 个参考）';

  render();
})();
