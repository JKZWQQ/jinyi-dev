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
        '<a class="ref-cover" href="' + esc(x.u) + '" target="_blank" rel="noopener nofollow">' + img +
          '<span class="ref-open">查看原站 ↗</span></a>' +
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

  render();
})();
