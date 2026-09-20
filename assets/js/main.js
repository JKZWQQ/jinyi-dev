/* 今翊科技官网 · 交互脚本 */
(function () {
  'use strict';

  var JY = window.JY || {};
  var CONTACT = JY.contact || { wechat: '13202868751' };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Header 滚动 ---------------- */
  var header = $('#siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- 移动端菜单 ---------------- */
  var navToggle = $('#navToggle'), mainNav = $('#mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () { mainNav.classList.toggle('open'); });
    $$('a', mainNav).forEach(function (a) {
      a.addEventListener('click', function () { mainNav.classList.remove('open'); });
    });
  }

  /* ---------------- 滚动入场 ---------------- */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------------- 工作台 Tab ---------------- */
  var tabs = $$('.studio-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      $$('.studio-panel').forEach(function (p) { p.hidden = true; });
      var target = document.getElementById(tab.getAttribute('data-panel'));
      if (target) target.hidden = false;
    });
  });

  /* ---------------- Chip 单选组（带 data-multi 的为多选） ---------------- */
  $$('.chip-row').forEach(function (row) {
    row.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || !row.contains(chip)) return;
      if (row.hasAttribute('data-multi')) {
        chip.classList.toggle('active');
      } else {
        $$('.chip', row).forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
      }
      var box = row.closest('.studio-panel');
      if (box) box.dispatchEvent(new CustomEvent('chipchange', { bubbles: true }));
    });
  });
  function pickedChip(rowId) {
    var row = document.getElementById(rowId);
    if (!row) return null;
    return $('.chip.active', row);
  }

  /* ---------------- 图片上传预览 ---------------- */
  $$('.img-upload').forEach(function (wrap) {
    var input = $('input[type="file"]', wrap);
    var previews = $('.img-upload-previews', wrap);
    var max = parseInt(wrap.getAttribute('data-max') || '3', 10);
    var files = [];

    function render() {
      previews.innerHTML = '';
      files.forEach(function (f, i) {
        var thumb = document.createElement('div');
        thumb.className = 'img-thumb';
        var img = document.createElement('img');
        img.src = URL.createObjectURL(f);
        img.alt = f.name;
        var del = document.createElement('button');
        del.type = 'button';
        del.textContent = '×';
        del.setAttribute('aria-label', '移除');
        del.addEventListener('click', function () {
          files.splice(i, 1);
          render();
        });
        thumb.appendChild(img);
        thumb.appendChild(del);
        previews.appendChild(thumb);
      });
      wrap.setAttribute('data-count', files.length);
      wrap._files = files;
    }

    input.addEventListener('change', function () {
      Array.prototype.slice.call(input.files || []).forEach(function (f) {
        if (files.length >= max) return;
        if (!/^image\//.test(f.type)) return;
        if (f.size > 4 * 1024 * 1024) return;
        files.push(f);
      });
      input.value = '';
      render();
    });
  });

  /* ---------------- 文档上传 ---------------- */
  var docInput = $('#systemDoc'), docLabel = $('#systemDocLabel'), docClear = $('#systemDocClear');
  if (docInput && docLabel) {
    docInput.addEventListener('change', function () {
      var f = docInput.files && docInput.files[0];
      if (!f) return;
      docLabel.textContent = f.name.length > 26 ? f.name.slice(0, 24) + '…' : f.name;
      if (docClear) docClear.hidden = false;
    });
    if (docClear) {
      docClear.addEventListener('click', function () {
        docInput.value = '';
        docLabel.textContent = '+ 上传文档';
        docClear.hidden = true;
      });
    }
  }

  /* ---------------- FAQ 折叠 ---------------- */
  $$('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      if (!item) return;
      item.classList.toggle('open');
    });
  });

  /* ---------------- 需求清单（页面不标价，由工程师按功能清单评估后报价） ---------------- */
  var KIND_MAP = { quoteMini: '小程序', quoteWebsite: '网站', quoteSystem: '系统' };
  var DURATION = { mini: '15 – 30 个工作日', website: '7 – 15 个工作日', system: '25 – 45 个工作日' };
  var INCLUDES = {
    mini: '小程序前端、后端接口、管理后台、完整源码与部署文档',
    website: '设计稿、响应式前端、页面制作与上线协助',
    system: '数据库设计、后端服务、Web 管理端、完整源码与部署文档'
  };
  var QUOTE_NOTE = '报价由工程师按功能清单逐项评估后书面给出，24 小时内回复。分阶段付款：确认后付定金开工，验收通过再付尾款。';

  function renderSummary(box, data, kind) {
    if (!box) return;
    box.innerHTML =
      '<h4>' + data.title + '</h4>' +
      '<div class="quote-row"><span>预计工期</span><strong style="font-size:15px">' + data.duration + '</strong></div>' +
      '<div class="quote-row"><span>报价方式</span><strong style="font-size:15px">按功能清单评估后报价</strong></div>' +
      '<p class="quote-note">包含：' + data.includes + '<br>' + QUOTE_NOTE + '</p>' +
      '<button type="button" class="btn btn-accent btn-block quote-submit" data-kind="' + (kind || KIND_MAP[box.id] || '') + '" style="margin-top:14px">把这个需求发给工程师</button>';
    box.hidden = false;
  }

  function quoteMini() {
    var chip = pickedChip('miniChips');
    var box = $('#quoteMini');
    if (!chip) { alert('请先选择一个小程序方向'); return; }
    renderSummary(box, {
      title: chip.getAttribute('data-name') + ' 小程序',
      duration: DURATION.mini,
      includes: INCLUDES.mini
    });
  }

  function quoteWebsite() {
    var chip = pickedChip('websiteChips');
    var hasBackend = chip && chip.getAttribute('data-value') === '1';
    renderSummary($('#quoteWebsite'), {
      title: hasBackend ? '带管理后台的网站' : '展示类网站',
      duration: DURATION.website,
      includes: INCLUDES.website
    });
  }

  function quoteSystem() {
    var chip = pickedChip('systemChips');
    var box = $('#quoteSystem');
    if (!chip) { alert('请先选择一个系统方向'); return; }
    renderSummary(box, {
      title: chip.getAttribute('data-name') + ' 系统',
      duration: DURATION.system,
      includes: INCLUDES.system
    });
  }

  var bind = function (id, fn) { var el = $(id); if (el) el.addEventListener('click', fn); };
  bind('#btnQuoteMini', quoteMini);
  bind('#btnQuoteWebsite', quoteWebsite);
  bind('#btnQuoteSystem', quoteSystem);

  /* ---------------- 需求弹窗 ---------------- */
  var modal = $('#orderModal');
  var pending = null;

  function openModal() { if (modal) { modal.hidden = false; document.body.style.overflow = 'hidden'; } }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    var f = $('#modalStepForm'), d = $('#modalStepDone');
    if (f) f.hidden = false;
    if (d) d.hidden = true;
  }

  // 报价结果里点「发给工程师」→ 弹出需求表单
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.quote-submit') : null;
    if (!btn) return;
    var kind = btn.getAttribute('data-kind') || '';
    var isMini = kind === '小程序', isSite = kind === '网站';
    var chip = isMini ? pickedChip('miniChips') : (isSite ? pickedChip('websiteChips') : pickedChip('systemChips'));
    var promptEl = isMini ? $('#miniPrompt') : (isSite ? $('#websitePrompt') : $('#systemPrompt'));
    pending = {
      kind: kind || '未选',
      name: chip ? (chip.getAttribute('data-name') || chip.textContent.trim()) : '未选择',
      prompt: promptEl ? promptEl.value.trim() : '',
      platforms: isMini ? $$('#miniPlatform .chip.active').map(function (c) { return c.getAttribute('data-value'); }) : [],
      backend: isSite && chip ? (chip.getAttribute('data-value') === '1' ? '需要' : '不需要') : ''
    };
    var hl = $('#submitHighlight');
    if (hl) {
      hl.innerHTML =
        '<div><span>开发类型</span><strong>' + pending.kind + '</strong></div>' +
        '<div><span>方向</span><strong>' + pending.name + '</strong></div>' +
        (pending.platforms.length ? '<div><span>需要的端</span><strong>' + pending.platforms.join(' / ') + '</strong></div>' : '') +
        (pending.backend ? '<div><span>管理后台</span><strong>' + pending.backend + '</strong></div>' : '');
    }
    openModal();
  });

  var modalClose = $('#modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  var orderForm = $('#orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('#orderName').value || '').trim() || '（未填）';
      var phone = ($('#orderPhone').value || '').trim() || '（未填）';
      var wechat = ($('#orderWechat').value || '').trim() || '（未填）';
      var note = ($('#orderNote').value || '').trim() || '（无）';
      var p = pending || {};
      var pEl = p.kind === '小程序' ? $('#miniPrompt')
              : (p.kind === '网站' ? $('#websitePrompt')
              : (p.kind === '系统' ? $('#systemPrompt') : null));
      var promptText = (pEl && pEl.value.trim()) || p.prompt || '（未填写，需沟通）';
      var lines = [
        '【今翊科技 · 开发需求】',
        '开发类型：' + (p.kind || '未选'),
        '方向：' + (p.name || '未选'),
        p.platforms && p.platforms.length ? '需要的端：' + p.platforms.join('、') : null,
        p.backend ? '管理后台：' + p.backend : null,
        '',
        '需求描述：',
        promptText,
        '',
        '联系人：' + name,
        '电话：' + phone,
        '微信：' + wechat,
        '补充说明：' + note
      ].filter(function (x) { return x !== null; });
      var out = $('#orderOutput');
      if (out) out.value = lines.join('\n');
      var f = $('#modalStepForm'), d = $('#modalStepDone');
      if (f) f.hidden = true;
      if (d) d.hidden = false;
    });
  }

  var copyBtn = $('#copyOrderBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var out = $('#orderOutput');
      if (!out) return;
      var done = function () {
        copyBtn.textContent = '已复制 ✓';
        setTimeout(function () { copyBtn.textContent = '一键复制'; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.value).then(done, function () { out.select(); document.execCommand('copy'); done(); });
      } else {
        out.select();
        document.execCommand('copy');
        done();
      }
    });
  }

  /* ---------------- 全站联系方式注入 ---------------- */
  $$('[data-contact-wechat]').forEach(function (el) { el.textContent = CONTACT.wechat; });
  var fw = $('#footerWechat');
  if (fw) fw.textContent = CONTACT.wechat;


  /* ---------------- 行业方案库筛选 ---------------- */
  var filterRow = $('#industryFilter');
  if (filterRow) {
    var indCards = $$('#industryGrid .industry-card');
    var indCount = $('#industryCount');
    var indTotal = indCards.length;
    var allBtn = null;

    function applyFilter(f, label) {
      var shown = 0;
      indCards.forEach(function (c) {
        var ok = (f === 'all' || c.getAttribute('data-cat') === f);
        c.hidden = !ok;
        if (ok) { c.classList.add('in'); shown++; }   // 筛选后立刻可见，不等滚动动效
      });
      if (!indCount) return;
      indCount.innerHTML = (f === 'all')
        ? '共 <strong>' + indTotal + '</strong> 个行业方向，没找到你的行业？<a href="index.html#studio" class="ind-link">直接描述你的业务</a>，工程师帮你判断该做成什么样'
        : '「' + label + '」<strong>' + shown + '</strong> 个行业方向 · <a href="#" class="ind-link" id="indShowAll">看全部 ' + indTotal + ' 个</a>';
    }

    filterRow.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      applyFilter(chip.getAttribute('data-filter'), chip.textContent.trim());
    });

    document.addEventListener('click', function (e) {
      if (e.target.id !== 'indShowAll') return;
      e.preventDefault();
      allBtn = allBtn || $('.chip[data-filter="all"]', filterRow);
      if (allBtn) allBtn.click();
    });
  }

  /* ---------------- 高亮当前导航 ---------------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0];
    if (href === path) a.classList.add('active');
  });
})();
