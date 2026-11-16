const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let DB = null;

function C(section, key, fallback = '') {
  return DB?.portal?.copy?.[section]?.[key] ?? fallback;
}
function asset(path) {
  if (!path) return '';
  if (/^(data:|https?:|blob:)/i.test(path)) return path;
  return new URL(path, document.baseURI).href;
}
function routeHref(path) {
  if (!window.PREVIEW_MODE) return path;
  if (path === 'index.html') return '#home';
  if (path === 'gioi-thieu.html') return '#about';
  if (path === 'chuong-trinh.html') return '#courses';
  if (path === 'lien-he.html') return '#contact';
  if (path === 'so-do-website.html') return '#sitemap';
  const m = path.match(/^mon-hoc\/([^/]+)\/(index\.html|de-cuong\.html|bai-giang\.html|tai-lieu\.html|ho-tro\.html)$/);
  if (m) {
    const section = ({'index.html':'overview','de-cuong.html':'syllabus','bai-giang.html':'slides','tai-lieu.html':'references','ho-tro.html':'support'})[m[2]];
    return section === 'overview' ? `#course/${m[1]}` : `#course/${m[1]}/${section}`;
  }
  return '#home';
}
function courseUrl(course) { return routeHref(`mon-hoc/${encodeURIComponent(course.id)}/index.html`); }
function courseSectionUrl(course, section) {
  const file = ({syllabus:'de-cuong.html',slides:'bai-giang.html',references:'tai-lieu.html',support:'ho-tro.html'})[section] || 'index.html';
  return routeHref(`mon-hoc/${encodeURIComponent(course.id)}/${file}`);
}
function phoneDisplay(value = '') {
  const digits = String(value).replace(/\D/g, '');
  return digits.length === 10 ? `${digits.slice(0,4)} ${digits.slice(4,7)} ${digits.slice(7)}` : value;
}
function icon(name) {
  const paths = {
    book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20"/>',
    outline:'<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h8"/>',
    slides:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m8 21 4-4 4 4M12 17v4"/>',
    reference:'<path d="M10 4H4v16h16v-6"/><circle cx="15" cy="9" r="5"/><path d="m19 13 3 3"/>',
    support:'<path d="M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
    contact:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    building:'<path d="M3 21h18M5 21V6l7-3 7 3v15M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>'
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.book}</svg>`;
}
function brandMarkup() {
  const p = DB.portal || {}, b = p.brand || {};
  return `<a class="brand" href="${routeHref('index.html')}" aria-label="${esc(C('labels','brandMarkAlt','Biểu tượng THANH'))}">
    <img src="${esc(asset(b.mark || 'assets/images/thanh-mark.svg'))}" alt="${esc(C('labels','brandMarkAlt','Biểu tượng THANH'))}" width="48" height="48">
    <span class="brand-copy"><strong>${esc(p.name || 'Cổng thông tin học tập')}</strong><small>${esc(p.subtitle || 'THANH · Learning Portal')}</small></span>
  </a>`;
}
function renderHeader() {
  const page = document.body.dataset.page || 'home';
  const active = page === 'course' ? 'courses' : page;
  const navItems = [
    ['home','index.html',C('navigation','home','Trang chủ')],
    ['about','gioi-thieu.html',C('navigation','about','Giới thiệu')],
    ['courses','chuong-trinh.html',C('navigation','courses','Chương trình học')],
    ['contact','lien-he.html',C('navigation','contact','Liên hệ')]
  ];
  const header = $('#siteHeader');
  if (!header) return;
  header.innerHTML = `<header class="site-header"><div class="container header-inner">
    ${brandMarkup()}
    <button class="nav-toggle" type="button" aria-label="${esc(C('labels','menuOpenAria','Mở menu'))}" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav class="main-nav" aria-label="${esc(C('labels','mainNavAria','Điều hướng chính'))}">${navItems.map(([id,url,label]) => `<a href="${routeHref(url)}" class="${active===id?'active':''}">${esc(label)}</a>`).join('')}</nav>
    <a class="header-cta" href="${routeHref('lien-he.html')}">${esc(C('navigation','connect','Kết nối Zalo'))} ${icon('arrow')}</a>
  </div></header>`;
  const toggle = $('.nav-toggle', header), nav = $('.main-nav', header);
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a', header).forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle?.setAttribute('aria-expanded','false');
  }));
}
function renderFooter() {
  const p = DB.portal || {}, t = p.teacher || {}, contact = p.contact || {};
  const footer = $('#siteFooter'); if (!footer) return;
  footer.innerHTML = `<footer class="footer"><div class="container">
    <div class="footer-main">
      <div class="footer-brand-block">${brandMarkup()}<p>${esc(C('footer','tagline','Chương trình học và tài nguyên thực hành theo từng môn.'))}</p></div>
      <div class="footer-column"><h3>${esc(C('footer','siteMapTitle','Điều hướng'))}</h3>
        <a href="${routeHref('index.html')}">${esc(C('navigation','home','Trang chủ'))}</a>
        <a href="${routeHref('gioi-thieu.html')}">${esc(C('navigation','about','Giới thiệu'))}</a>
        <a href="${routeHref('chuong-trinh.html')}">${esc(C('navigation','courses','Chương trình học'))}</a>
        <a href="${routeHref('so-do-website.html')}">${esc(C('footer','sitemapLabel','Sơ đồ website'))}</a>
      </div>
      <div class="footer-column"><h3>${esc(C('footer','contactTitle','Kết nối'))}</h3>
        <a href="${routeHref('lien-he.html')}">${esc(C('navigation','contact','Liên hệ'))}</a>
        ${contact.phone ? `<a href="tel:${esc(contact.phone)}">${esc(phoneDisplay(contact.phone))}</a>` : ''}
        ${contact.zaloUrl ? `<a href="${esc(contact.zaloUrl)}" target="_blank" rel="noopener">${esc(C('footer','zaloLinkLabel','Zalo cá nhân'))} ↗</a>` : ''}
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(p.name || 'Cổng thông tin học tập')} · THANH</span><span>${esc(C('footer','ownerPrefix','Được xây dựng và quản lý bởi'))} <strong>${esc(t.name || p.owner || 'Đoàn Tuấn Thanh')}</strong>.</span></div>
  </div></footer>`;
}
function courseCard(c, compact = false) {
  const locked = c.status !== 'open';
  const image = c.coverImage ? `<img src="${esc(asset(c.coverImage))}" alt="${esc(c.title)}">` : `<div class="cover-placeholder">${icon('book')}</div>`;
  return `<a class="course-card ${locked?'is-locked':''} ${compact?'compact':''}" href="${courseUrl(c)}">
    <div class="course-cover">${image}<span class="course-number">${esc(c.number || '')}</span></div>
    <div class="course-body">
      <div class="course-meta"><span class="course-category">${esc(c.category || C('labels','courseCategoryDefault','Chương trình học'))}</span><span class="status-pill ${locked?'locked':'open'}">${esc(locked?C('home','lockedLabel','Tạm khóa'):C('home','openLabel','Đang mở'))}</span></div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.subtitle || c.description || '')}</p>
      <span class="course-link">${esc(locked?C('catalog','lockedAction','Xem thông tin môn học'):C('catalog','openAction','Truy cập môn học'))} ${icon('arrow')}</span>
    </div>
  </a>`;
}
function renderHome() {
  const courses = DB.courses || [];
  const featured = courses.find(c => c.status === 'open') || courses[0];
  const visual = DB.portal.visuals || {};
  const heroImage = visual.homeHero || featured?.coverImage || '';
  $('#homeContent').innerHTML = `<div class="container home-page">
    <section class="home-hero">
      <div class="home-hero-copy">
        <div class="eyebrow">${esc(C('home','eyebrow','THANH · LEARNING PORTAL'))}</div>
        <h1>${esc(C('home','title','Học tập có định hướng. Thực hành có kết quả.'))}</h1>
        <p>${esc(C('home','description','Chương trình học, bài giảng và tài nguyên thực hành được tổ chức theo từng môn học.'))}</p>
        <div class="hero-actions">
          <a class="btn btn-white" href="${routeHref('chuong-trinh.html')}">${esc(C('home','primaryAction','Khám phá chương trình học'))} ${icon('arrow')}</a>
          <a class="btn btn-ghost" href="${routeHref('gioi-thieu.html')}">${esc(C('home','secondaryAction','Giới thiệu'))}</a>
        </div>
      </div>
      <div class="home-hero-visual">
        ${heroImage?`<img class="hero-photo" src="${esc(asset(heroImage))}" alt="${esc(C('home','heroImageAlt','Hình ảnh minh họa chương trình học'))}" fetchpriority="high">`:''}
        <div class="hero-photo-shade"></div>
        <div class="hero-visual-top"><span>THANH</span><span>${esc(C('labels','portalTagline','LEARNING PORTAL'))}</span></div>
        <div class="featured-course-chip"><span class="featured-dot"></span><div><small>${esc(C('home','featuredLabel','Môn học đang mở'))}</small><strong>${esc(featured?.shortTitle || featured?.title || '')}</strong><a href="${featured?courseUrl(featured):routeHref('chuong-trinh.html')}">${esc(C('home','featuredAction','Xem môn học'))} ${icon('arrow')}</a></div></div>
      </div>
    </section>
    <section class="home-catalog">
      <div class="section-heading"><div><span class="eyebrow">${esc(C('labels','homeProgramsEyebrow','CHƯƠNG TRÌNH HỌC'))}</span><h2>${esc(C('home','catalogTitle','Chương trình học'))}</h2><p>${esc(C('home','catalogDescription','Chọn môn học để xem đề cương, bài giảng và tài nguyên đi kèm.'))}</p></div><a class="text-link" href="${routeHref('chuong-trinh.html')}">${esc(C('home','viewAll','Xem tất cả chương trình'))} ${icon('arrow')}</a></div>
      <div class="course-grid home-course-grid">${courses.map(c=>courseCard(c,true)).join('')}</div>
    </section>
    <section class="home-social" aria-labelledby="social-title">
      <div class="social-intro"><span class="eyebrow">CÙNG GIỮ KẾT NỐI</span><h2 id="social-title">${esc(DB.portal.social.title)}</h2><p>${esc(DB.portal.social.description)}</p></div>
      <div class="social-grid">${[['linkedin','LinkedIn','in','linkedinUrl','linkedinDescription'],['facebook','Facebook','f','facebookUrl','facebookDescription']].map(([kind,label,mark,url,desc])=>`<a class="social-card social-${kind}" href="${esc(DB.portal.social[url])}" target="_blank" rel="noopener noreferrer" aria-label="Kết nối qua ${label} (mở trong thẻ mới)"><span class="social-symbol" aria-hidden="true">${mark}</span><span class="social-copy"><strong>${label}</strong><span>${esc(DB.portal.social[desc])}</span><small>Kết nối với Thanh Đoàn <span aria-hidden="true">↗</span></small></span><span class="social-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
    </section>
  </div>`;
}
function renderAbout() {
  const p = DB.portal || {}, t = p.teacher || {}, inst = p.institute || {}, schools = p.institutions || [];
  const experience = t.experience || [];
  const paragraphs = String(t.bio || '').split(/\n\s*\n/).filter(Boolean);
  $('#aboutContent').innerHTML = `<div class="container page-pad">
    <div class="page-intro"><div class="breadcrumb"><a href="${routeHref('index.html')}">${esc(C('labels','breadcrumbHome','Trang chủ'))}</a><span>/</span>${esc(C('navigation','about','Giới thiệu'))}</div><div class="eyebrow">${esc(C('about','eyebrow','GIẢNG VIÊN'))}</div><h1>${esc(C('about','title',t.name || 'Đoàn Tuấn Thanh'))}</h1><p>${esc(C('about','intro','Kinh nghiệm chuyên môn, hoạt động giảng dạy và nghiên cứu học thuật.'))}</p></div>
    <section class="profile-overview">
      <aside class="profile-card"><img src="${esc(asset(p.visuals?.teacherPortrait || p.brand?.mark || 'assets/images/thanh-mark.svg'))}" alt="${esc(C('labels','teacherMarkAlt','Biểu tượng thương hiệu THANH'))}" class="profile-mark"><div class="profile-card-copy"><span class="eyebrow">${esc(C('labels','profileBrandEyebrow','THANH · LEARNING PORTAL'))}</span><h2>${esc(t.name || 'Đoàn Tuấn Thanh')}</h2><p class="profile-role">${esc(t.role || 'Giảng viên thỉnh giảng')}</p><p class="profile-positioning">${esc(t.positioning || '')}</p></div></aside>
      <div class="content-card bio-card"><h2>${esc(C('about','bioTitle','Giới thiệu'))}</h2>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
    </section>
    ${t.perspective?`<section class="content-card lecturer-perspective"><div class="perspective-heading"><span class="perspective-mark">${icon('quote')}</span><div><span class="eyebrow">GÓC NHÌN CÁ NHÂN</span><h2>${esc(C('about','perspectiveTitle','Góc nhìn của giảng viên'))}</h2></div></div>${String(t.perspective).split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('')}</section>`:''}
    <section class="about-section"><div class="section-heading simple"><div><span class="eyebrow">${esc(C('labels','experienceEyebrow','KINH NGHIỆM'))}</span><h2>${esc(C('about','experienceTitle','Kinh nghiệm chuyên môn'))}</h2></div></div><div class="experience-grid">${experience.map(x=>`<article class="experience-card"><strong>${esc(x.years)}</strong><h3>${esc(x.area)}</h3><p>${esc(x.detail)}</p></article>`).join('')}</div></section>
    <section class="about-two-col">
      <article class="content-card"><div class="card-icon">${icon('user')}</div><h2>${esc(C('about','teachingTitle','Hoạt động giảng dạy'))}</h2><p>${esc(t.teaching || '')}</p></article>
      <article class="content-card"><div class="card-icon">${icon('book')}</div><h2>${esc(C('about','researchTitle','Nền tảng học thuật'))}</h2>${String(t.research || '').split(/\n\s*\n|\n/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('')}</article>
    </section>
    ${t.publicationAccess?`<section class="publication-access"><div class="publication-copy"><span class="eyebrow">NGHIÊN CỨU HỌC THUẬT</span><h2>${esc(t.publicationAccess.title || C('about','researchAccessTitle','Công trình khoa học và bài báo công bố'))}</h2><p>${esc(t.publicationAccess.description || C('about','researchAccessDescription','Vui lòng liên hệ giảng viên để được hỗ trợ truy cập.'))}</p>${(t.publicationAccess.items||[]).map(x=>`<a class="publication-item" href="${esc(x.url||'#')}" target="_blank" rel="noopener">${esc(x.title||'Công trình khoa học')} ${icon('external-link')}</a>`).join('')}<a class="btn publication-cta" href="${routeHref('lien-he.html')}">${esc(t.publicationAccess.actionLabel || C('about','researchUnlockAction','Liên hệ giảng viên để mở khóa'))} ${icon('arrow')}</a></div><div class="publication-lock"><div class="lock-orbit">${icon('lock')}</div><strong>${esc(t.publicationAccess.lockedLabel || C('about','researchLockedLabel','Nội dung giới hạn quyền truy cập'))}</strong><span>CÔNG TRÌNH · BÀI BÁO KHOA HỌC</span></div></section>`:''}
    <section class="about-section institute-section"><div class="section-heading simple"><div><span class="eyebrow">${esc(C('labels','instituteEyebrow','ĐƠN VỊ KẾT NỐI'))}</span><h2>${esc(C('about','instituteTitle','Đơn vị kết nối giảng viên'))}</h2></div></div>
      <article class="institute-card">${inst.logo?`<img src="${esc(asset(inst.logo))}" alt="${esc(C('labels','instituteLogoAlt','Logo đơn vị kết nối giảng viên'))}" loading="lazy">`:`<div class="institution-icon">${icon('building')}</div>`}<div><span class="institution-role">${esc(inst.role || 'Đơn vị kết nối giảng viên đào tạo')}</span><h3>${esc(inst.name || '')}</h3><p>${esc(inst.description || '')}</p></div></article>
    </section>
    <section class="about-section"><div class="section-heading simple"><div><span class="eyebrow">${esc(C('labels','institutionsEyebrow','HOẠT ĐỘNG GIẢNG DẠY'))}</span><h2>${esc(C('about','institutionsTitle','Các cơ sở giáo dục đã tham gia giảng dạy và đào tạo'))}</h2><p>${esc(C('about','institutionsDescription','Tham gia theo các hình thức giảng viên thỉnh giảng, báo cáo viên chuyên đề hoặc mentor, tùy chương trình.'))}</p></div></div>
      <div class="institution-grid">${schools.map(s=>`<article class="institution-card">${s.logo?`<img src="${esc(asset(s.logo))}" alt="${esc(C('labels','schoolLogoAlt','Logo cơ sở giáo dục'))}" loading="lazy">`:`<div class="institution-icon">${icon('building')}</div>`}<div><h3>${esc(s.name)}</h3>${s.note?`<p>${esc(s.note)}</p>`:''}</div></article>`).join('')}</div>
    </section>
    <section class="about-contact"><div><h2>${esc(C('about','contactTitle','Trao đổi với giảng viên'))}</h2><p>${esc(C('about','contactDescription','Kết nối để trao đổi về chương trình học và hoạt động đào tạo.'))}</p></div><a class="btn" href="${routeHref('lien-he.html')}">${esc(C('navigation','connect','Kết nối Zalo'))} ${icon('arrow')}</a></section>
  </div>`;
}
function renderCourses() {
  const list = DB.courses || [];
  $('#coursesContent').innerHTML = `<div class="container page-pad">
    <div class="page-intro"><div class="breadcrumb"><a href="${routeHref('index.html')}">${esc(C('labels','breadcrumbHome','Trang chủ'))}</a><span>/</span>${esc(C('navigation','courses','Chương trình học'))}</div><div class="eyebrow">${esc(C('catalog','eyebrow','CHƯƠNG TRÌNH HỌC'))}</div><h1>${esc(C('catalog','title','Danh mục môn học'))}</h1><p>${esc(C('catalog','description','Mỗi môn học có trang thông tin và khu vực học liệu riêng.'))}</p></div>
    <div class="catalog-toolbar"><label class="search-field">${icon('search')}<input id="courseSearch" type="search" placeholder="${esc(C('catalog','searchPlaceholder','Tìm theo tên môn học...'))}" aria-label="${esc(C('labels','catalogSearchAria','Tìm kiếm môn học'))}"></label><select id="statusFilter" class="filter-select" aria-label="${esc(C('labels','catalogFilterAria','Lọc trạng thái'))}"><option value="all">${esc(C('catalog','allStatus','Tất cả trạng thái'))}</option><option value="open">${esc(C('catalog','openStatus','Đang mở'))}</option><option value="locked">${esc(C('catalog','lockedStatus','Tạm khóa'))}</option></select></div>
    <div id="catalogGrid" class="course-grid catalog-grid"></div>
  </div>`;
  const input = $('#courseSearch'), filter = $('#statusFilter');
  const update = () => {
    const q = (input.value || '').trim().toLocaleLowerCase('vi'), status = filter.value;
    const courses = list.filter(c => {
      const hay = [c.title,c.shortTitle,c.subtitle,c.description,c.category].join(' ').toLocaleLowerCase('vi');
      return (!q || hay.includes(q)) && (status === 'all' || (status === 'open' ? c.status === 'open' : c.status !== 'open'));
    });
    $('#catalogGrid').innerHTML = courses.length ? courses.map(c=>courseCard(c)).join('') : `<div class="empty"><div class="empty-icon">${icon('search')}</div><h3>${esc(C('catalog','notFound','Không tìm thấy môn học phù hợp'))}</h3></div>`;
  };
  input.addEventListener('input', update); filter.addEventListener('change', update); update();
}
const COURSE_SECTIONS = [
  {id:'overview',file:'index.html',label:'Tổng quan môn học',icon:'book'},
  {id:'syllabus',file:'de-cuong.html',label:'Đề cương môn học',icon:'outline'},
  {id:'slides',file:'bai-giang.html',label:'Nội dung bài giảng',icon:'slides'},
  {id:'references',file:'tai-lieu.html',label:'Tài liệu tham khảo',icon:'reference'},
  {id:'support',file:'ho-tro.html',label:'Hỗ trợ học viên',icon:'support'}
];
function courseBreadcrumb(c, sectionLabel) {
  return `<div class="breadcrumb"><a href="${routeHref('index.html')}">${esc(C('labels','breadcrumbHome','Trang chủ'))}</a><span>/</span><a href="${routeHref('chuong-trinh.html')}">${esc(C('navigation','courses','Chương trình học'))}</a><span>/</span><a href="${courseUrl(c)}">${esc(c.shortTitle || c.title)}</a>${sectionLabel && sectionLabel!=='Tổng quan môn học'?`<span>/</span>${esc(sectionLabel)}`:''}</div>`;
}
function courseSidebar(c, active) {
  return `<aside class="course-sidebar"><div class="sidebar-course-name"><span class="eyebrow">${esc(C('labels','coursePrefixUpper','MÔN'))} ${esc(c.number)}</span><strong>${esc(c.shortTitle || c.title)}</strong></div><nav aria-label="${esc(C('labels','courseSidebarAria','Nội dung môn học'))}">${COURSE_SECTIONS.map(s=>`<a class="${active===s.id?'active':''}" href="${s.id==='overview'?courseUrl(c):courseSectionUrl(c,s.id)}">${icon(s.icon)}<span>${esc(C('course',s.id,s.label))}</span></a>`).join('')}</nav><a class="sidebar-back" href="${routeHref('chuong-trinh.html')}">← ${esc(C('course','backToCatalog','Quay lại chương trình học'))}</a></aside>`;
}
function courseOverviewHTML(c) {
  const s = c.syllabus || {};
  const cards = COURSE_SECTIONS.filter(x=>x.id!=='overview');
  return `<div class="course-overview-panel">
    <div class="course-overview-copy"><span class="eyebrow">${esc(c.category || 'CHƯƠNG TRÌNH HỌC')} · ${esc(C('labels','coursePrefixUpper','MÔN'))} ${esc(c.number)}</span><h1>${esc(c.title)}</h1>${c.audienceLabel?`<div class="audience-pill">${esc(c.audienceLabel)}</div>`:''}<p class="course-lead">${esc(c.subtitle || '')}</p><p>${esc(c.description || s.overview || '')}</p><div class="course-facts">${[c.duration,c.format,c.method].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>
    <div class="course-overview-art">${c.coverImage?`<img src="${esc(asset(c.coverImage))}" alt="${esc(c.title)}">`:''}</div>
  </div>
  <div class="section-heading simple course-content-heading"><div><h2>${esc(C('labels','courseContentTitle','Nội dung môn học'))}</h2><p>${esc(C('labels','courseContentIntro',C('course','sectionIntro',C('labels','courseContentIntro','Chọn nội dung cần xem trong chương trình học.'))))}</p></div></div>
  <div class="section-link-grid">${cards.map(sx=>`<a class="section-link-card" href="${courseSectionUrl(c,sx.id)}"><span class="section-link-icon">${icon(sx.icon)}</span><span class="section-link-title">${esc(C('course',sx.id,sx.label))}</span><span class="section-link-desc">${esc(({syllabus:C('course','syllabusCardDescription','Xem mục tiêu, nội dung và kế hoạch học tập.'),slides:C('course','slidesCardDescription','Truy cập slide và tài liệu theo từng buổi.'),references:C('course','referencesCardDescription','Tra cứu các nguồn học liệu tiếng Việt và tiếng Anh.'),support:C('course','supportCardDescription','Sử dụng công cụ và kết nối với giảng viên.')})[sx.id])}</span><span class="section-link-arrow">${icon('arrow')}</span></a>`).join('')}</div>`;
}
function bullets(items) {
  return `<ul class="check-list">${(items || []).map(x=>`<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
}
function syllabusHTML(c) {
  const s = c.syllabus || {}, tracks = c.tracks || [];
  return `<div class="section-page-intro"><span class="eyebrow">${esc(C('labels','courseOutlineEyebrow','COURSE OUTLINE'))}</span><h1>${esc(C('course','syllabus','Đề cương môn học'))}</h1><p>${esc(C('course','syllabusIntro','Mục tiêu, nội dung, phương pháp và yêu cầu đánh giá của môn học.'))}</p></div>
    <section class="content-card"><h2>${esc(C('labels','syllabusOverviewTitle','Giới thiệu môn học'))}</h2><p>${esc(s.overview || '')}</p></section>
    <div class="two-col"><section class="content-card"><h2>${esc(C('labels','objectivesTitle','Mục tiêu học tập'))}</h2>${bullets(s.objectives)}</section><section class="content-card"><h2>${esc(C('labels','outcomesTitle','Kết quả cần đạt'))}</h2>${bullets(s.outcomes)}</section></div>
    <section class="content-card"><h2>${esc(C('labels','sessionPlanTitle','Kế hoạch nội dung'))}</h2><div class="session-list">${(s.sessions || []).map(x=>`<article class="session"><div class="session-num">${String(x.number).padStart(2,'0')}</div><div class="session-main"><h3>${esc(x.title)}</h3><p>${esc(x.focus)}</p></div><div class="session-output"><small>${esc(C('labels','outputLabel','SẢN PHẨM / ĐẦU RA'))}</small><span>${esc(x.output)}</span></div></article>`).join('')}</div></section>
    ${tracks.length?`<section class="content-card"><h2>${esc(C('labels','tracksTitle','Thực hành theo chuyên ngành'))}</h2><p>${esc(C('course','trackIntro','Cùng một nền tảng học tập, nhiệm vụ và sản phẩm được lựa chọn theo đặc thù từng chuyên ngành.'))}</p><div class="track-grid">${tracks.map(t=>`<article class="track-card">${t.image?`<img src="${esc(asset(t.image))}" alt="${esc(t.title)}" loading="lazy">`:''}<div class="track-copy"><small>${esc(t.short)}</small><h3>${esc(t.title)}</h3><p>${esc(t.subtitle)}</p><details><summary>${esc(C('course','trackDetails',C('labels','trackDetailsLabel','Xem nhiệm vụ và sản phẩm')))}</summary><p><b>${esc(C('labels','taskLabel','Nhiệm vụ'))}:</b> ${esc(t.task)}</p><p><b>${esc(C('labels','workflowLabel','Các bước'))}:</b> ${esc(t.workflow)}</p><p><b>${esc(C('labels','productLabel','Sản phẩm'))}:</b> ${esc(t.product)}</p><p><b>${esc(C('labels','toolsLabel','Công cụ'))}:</b> ${esc(t.tools)}</p></details></div></article>`).join('')}</div></section>`:''}
    <div class="two-col"><section class="content-card"><h2>${esc(C('labels','teachingApproachTitle','Phương pháp học tập'))}</h2>${bullets(s.teachingApproach)}</section><section class="content-card"><h2>${esc(C('labels','assessmentTitle','Đánh giá kết quả'))}</h2><div class="assessment-list">${(s.assessment || []).map(x=>`<div class="assessment-row"><strong>${esc(x.weight)}</strong><div><b>${esc(x.name)}</b><p>${esc(x.description)}</p></div></div>`).join('')}</div></section></div>
    ${(s.projectRubric || []).length?`<section class="content-card"><h2>${esc(C('labels','projectRubricTitle','Tiêu chí đánh giá Mini Project'))}</h2>${s.projectRubric.map(x=>`<div class="rubric-row"><span>${esc(x.name)}</span><strong>${esc(x.weight)}</strong></div>`).join('')}</section>`:''}`;
}
function slidesHTML(c) {
  const slides = c.slides || [];
  if (!slides.length) return `<div class="section-page-intro"><span class="eyebrow">${esc(C('labels','learningMaterialsEyebrow','LEARNING MATERIALS'))}</span><h1>${esc(C('course','slides','Nội dung bài giảng'))}</h1><p>${esc(C('course','slidesIntro','Slide và tài liệu giảng dạy được cập nhật theo từng buổi học.'))}</p></div><div class="empty-state"><div class="empty-state-icon">${icon('slides')}</div><h2>${esc(C('course','emptySlidesTitle','Bài giảng sẽ được cập nhật'))}</h2><p>${esc(C('course','emptySlidesText','Slide của môn học sẽ được đăng tải tại đây sau khi giảng viên hoàn thiện và sắp xếp theo từng buổi.'))}</p></div>`;
  return `<div class="section-page-intro"><span class="eyebrow">${esc(C('labels','learningMaterialsEyebrow','LEARNING MATERIALS'))}</span><h1>${esc(C('course','slides','Nội dung bài giảng'))}</h1><p>${esc(C('course','slidesIntro','Slide và tài liệu giảng dạy được cập nhật theo từng buổi học.'))}</p></div><div class="resource-grid">${slides.map(x=>`<article class="resource-card"><div class="resource-meta"><span>${esc(x.type || C('course','defaultSlideType','Bài giảng'))}</span><small>${esc(x.session || '')}</small></div><h3>${esc(x.title)}</h3><p>${esc(x.description || '')}</p><a href="${esc(asset(x.url))}" target="_blank" rel="noopener">${esc(x.access || C('course','downloadResource','Xem / tải tài liệu'))} ${icon('arrow')}</a></article>`).join('')}</div>`;
}
function resourceCard(x) {
  return `<article class="resource-card" data-lang="${esc(x.language || '')}" data-type="${esc(x.type || '')}"><div class="resource-meta"><span>${esc(x.language || '')}</span><small>${esc(x.type || '')}</small></div><h3>${esc(x.title)}</h3><p>${esc(x.description || '')}</p><small class="publisher">${esc(x.publisher || '')}</small><a href="${esc(x.url || '#')}" target="_blank" rel="noopener">${esc(x.access || C('course','defaultResourceAction',C('course','openResource','Mở tài liệu')))} ${icon('arrow')}</a></article>`;
}
function referencesHTML(c) {
  const items = c.references || [];
  const intro = `<div class="section-page-intro"><span class="eyebrow">${esc(C('labels','referenceLibraryEyebrow','REFERENCE LIBRARY'))}</span><h1>${esc(C('course','references','Tài liệu tham khảo'))}</h1><p>${esc(C('course','referencesIntro','Nguồn tài liệu công khai để học viên đọc, tra cứu và tải về.'))}</p></div>`;
  if (!items.length) return intro + `<div class="empty-state"><div class="empty-state-icon">${icon('reference')}</div><h2>${esc(C('course','emptyReferencesTitle','Tài liệu tham khảo đang được cập nhật'))}</h2></div>`;
  const types = [...new Set(items.map(x=>x.type).filter(Boolean))];
  return intro + `<div class="resource-toolbar"><select id="langFilter" class="filter-select"><option value="all">${esc(C('course','allLanguages','Tất cả ngôn ngữ'))}</option><option value="Tiếng Việt">${esc(C('course','vietnamese','Tiếng Việt'))}</option><option value="English">${esc(C('course','english','English'))}</option></select><select id="typeFilter" class="filter-select"><option value="all">${esc(C('course','filterType','Tất cả loại tài liệu'))}</option>${types.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select></div><div class="resource-grid" id="resourceGrid">${items.map(resourceCard).join('')}</div>`;
}
function supportHTML(c) {
  const items = c.support || [], contact = DB.portal.contact || {};
  const intro = `<div class="section-page-intro"><span class="eyebrow">${esc(C('labels','learnerSupportEyebrow','LEARNER SUPPORT'))}</span><h1>${esc(C('course','support','Hỗ trợ học viên'))}</h1><p>${esc(C('course','supportIntro','Công cụ, hướng dẫn thực hành và kênh trao đổi với giảng viên.'))}</p></div>`;
  if (!items.length) return intro + `<div class="empty-state"><div class="empty-state-icon">${icon('support')}</div><h2>${esc(C('course','emptySupportTitle','Nội dung hỗ trợ đang được cập nhật'))}</h2></div>`;
  return intro + `<div class="support-grid">${items.map(x=>{
    const link = x.url || (x.id === 'consult' ? contact.zaloUrl : '');
    const action = link ? `<a class="support-action" href="${esc(link)}" target="_blank" rel="noopener">${esc(x.id==='consult'?C('course','consult','Kết nối Zalo với giảng viên'):(x.action || C('course','defaultSupportAction','Mở nội dung')))} ${icon('arrow')}</a>` : `<span class="support-status">${esc(x.label || C('course','defaultSupportStatus','Đang cập nhật'))}</span>`;
    return `<article class="support-card"><div class="support-icon">${icon(x.id==='consult'?'contact':x.id==='prompts'?'image':x.id==='tutorials'?'book':'support')}</div><div class="support-copy"><span class="support-category">${esc(x.category || '')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description || '')}</p>${action}</div></article>`;
  }).join('')}</div>`;
}
function setupResourceFilters() {
  const lang = $('#langFilter'), type = $('#typeFilter');
  if (!lang || !type) return;
  const update = () => $$('#resourceGrid .resource-card').forEach(el => {
    el.classList.toggle('is-hidden', (lang.value !== 'all' && el.dataset.lang !== lang.value) || (type.value !== 'all' && el.dataset.type !== type.value));
  });
  lang.addEventListener('change', update); type.addEventListener('change', update);
}
function renderCourse() {
  const id = document.body.dataset.courseId;
  const section = document.body.dataset.courseSection || 'overview';
  const c = DB.courses.find(x => x.id === id);
  const target = $('#courseContent');
  if (!c) {
    target.innerHTML = `<div class="container page-pad"><div class="empty-state"><h2>${esc(C('labels','courseNotFoundTitle','Không tìm thấy môn học'))}</h2><a class="btn" href="${routeHref('chuong-trinh.html')}">${esc(C('course','backToCatalog','Quay lại chương trình học'))}</a></div></div>`;
    return;
  }
  document.title = `${c.title} | ${DB.portal.name}`;
  if (c.status !== 'open') {
    target.innerHTML = `<div class="container page-pad">${courseBreadcrumb(c)}<section class="locked-panel"><div class="locked-icon">${icon('lock')}</div><span class="eyebrow">${esc(C('labels','coursePrefixUpper','MÔN'))} ${esc(c.number)}</span><h1>${esc(c.title)}</h1><p>${esc(c.lockedMessage || C('course','lockedMessage','Nội dung hiện đang tạm khóa, liên hệ quản trị viên để mở.'))}</p><a class="btn" href="${routeHref('lien-he.html')}">${esc(C('navigation','connect','Kết nối Zalo'))} ${icon('arrow')}</a><a class="back-link" href="${routeHref('chuong-trinh.html')}">← ${esc(C('course','backToCatalog','Quay lại chương trình học'))}</a></section></div>`;
    return;
  }
  const sectionItem = COURSE_SECTIONS.find(x=>x.id===section) || COURSE_SECTIONS[0];
  let content = '';
  if (section === 'overview') content = courseOverviewHTML(c);
  else if (section === 'syllabus') content = syllabusHTML(c);
  else if (section === 'slides') content = slidesHTML(c);
  else if (section === 'references') content = referencesHTML(c);
  else if (section === 'support') content = supportHTML(c);
  target.innerHTML = `<div class="container page-pad course-page">${courseBreadcrumb(c, sectionItem.label)}<div class="course-page-layout">${courseSidebar(c,section)}<main class="course-page-main">${content}<div class="course-page-bottom"><a href="${courseUrl(c)}">← ${esc(c.shortTitle || c.title)}</a><a href="${routeHref('lien-he.html')}">${esc(C('labels','courseHelpLink','Cần hỗ trợ? Kết nối giảng viên'))} ${icon('arrow')}</a></div></main></div></div>`;
  setupResourceFilters();
}
function renderContact() {
  const p = DB.portal || {}, c = p.contact || {}, qr = c.zaloQr || 'assets/images/zalo-qr.png';
  $('#contactContent').innerHTML = `<div class="container page-pad">
    <div class="page-intro"><div class="breadcrumb"><a href="${routeHref('index.html')}">${esc(C('labels','breadcrumbHome','Trang chủ'))}</a><span>/</span>${esc(C('navigation','contact','Liên hệ'))}</div><div class="eyebrow">${esc(C('contact','eyebrow','CONTACT'))}</div><h1>${esc(C('contact','title','Kết nối với giảng viên'))}</h1><p>${esc(C('contact','description','Trao đổi về chương trình học, nội dung bài giảng và hoạt động đào tạo.'))}</p></div>
    <div class="contact-layout"><section class="contact-card"><h2>${esc(C('contact','infoTitle','Thông tin liên hệ'))}</h2><div class="contact-detail">${icon('user')}<div><small>${esc(C('labels','lecturerLabel','Giảng viên'))}</small><strong>${esc(p.teacher?.name || p.owner || 'Đoàn Tuấn Thanh')}</strong></div></div>${c.phone?`<div class="contact-detail">${icon('contact')}<div><small>${esc(C('contact','phoneLabel','Điện thoại / Zalo'))}</small><strong><a href="tel:${esc(c.phone)}">${esc(phoneDisplay(c.phone))}</a></strong></div></div>`:''}${c.zaloUrl?`<a class="btn contact-zalo" href="${esc(c.zaloUrl)}" target="_blank" rel="noopener">${esc(C('contact','openZalo','Mở Zalo'))} ${icon('arrow')}</a>`:''}</section>
      <section class="qr-card"><img src="${esc(asset(qr))}" alt="${esc(C('labels','zaloQrAlt','Mã QR Zalo cá nhân của giảng viên'))}"><h2>${esc(C('contact','qrTitle','Quét mã QR để kết nối'))}</h2><p>${esc(C('contact','qrDescription','Sử dụng ứng dụng Zalo để quét mã và gửi lời nhắn trực tiếp.'))}</p></section></div>
  </div>`;
}
function renderSitemap() {
  const courses = DB.courses || [];
  $('#sitemapContent').innerHTML = `<div class="container page-pad"><div class="page-intro"><div class="breadcrumb"><a href="${routeHref('index.html')}">${esc(C('labels','breadcrumbHome','Trang chủ'))}</a><span>/</span>${esc(C('labels','siteMapCrumb','Sơ đồ website'))}</div><div class="eyebrow">${esc(C('labels','sitemapEyebrow','SITE MAP'))}</div><h1>${esc(C('labels','siteMapTitle','Sơ đồ website'))}</h1><p>${esc(C('labels','siteMapDescription','Cấu trúc các trang và nội dung trong Cổng thông tin học tập THANH.'))}</p></div><div class="sitemap-tree">
    <a class="sitemap-node root" href="${routeHref('index.html')}">${icon('building')}<span>${esc(C('labels','breadcrumbHome','Trang chủ'))}</span></a>
    <a class="sitemap-node" href="${routeHref('gioi-thieu.html')}">${icon('user')}<span>${esc(C('navigation','about','Giới thiệu'))}</span></a>
    <div class="sitemap-group"><a class="sitemap-node" href="${routeHref('chuong-trinh.html')}">${icon('book')}<span>${esc(C('navigation','courses','Chương trình học'))}</span></a><div class="sitemap-children">${courses.map(c=>`<div class="sitemap-course"><a class="sitemap-node ${c.status!=='open'?'muted':''}" href="${courseUrl(c)}"><span>${esc(C('labels','coursePrefixLabel','Môn'))} ${esc(c.number)}</span><strong>${esc(c.title)}</strong></a><div class="sitemap-subchildren">${COURSE_SECTIONS.slice(1).map(s=>`<a href="${courseSectionUrl(c,s.id)}">${esc(C('course',s.id,s.label))}</a>`).join('')}</div></div>`).join('')}</div></div>
    <a class="sitemap-node" href="${routeHref('lien-he.html')}">${icon('contact')}<span>${esc(C('navigation','contact','Liên hệ'))}</span></a>
  </div></div>`;
}
function renderShell() {
  renderHeader(); renderFooter();
  const page = document.body.dataset.page;
  if (page === 'home') renderHome();
  else if (page === 'about') renderAbout();
  else if (page === 'courses') renderCourses();
  else if (page === 'contact') renderContact();
  else if (page === 'sitemap') renderSitemap();
  else if (page === 'course') renderCourse();
}
function routeFromHash() {
  if (!window.PREVIEW_MODE) return;
  const raw = (location.hash || '#home').replace(/^#\/?/, '');
  const parts = raw.split('/');
  const page = parts[0] || 'home';
  if (page === 'course') {
    document.body.dataset.page = 'course';
    document.body.dataset.courseId = decodeURIComponent(parts[1] || 'ai-tech');
    document.body.dataset.courseSection = parts[2] || 'overview';
  } else {
    document.body.dataset.page = ['home','about','courses','contact','sitemap'].includes(page) ? page : 'home';
    delete document.body.dataset.courseId;
    delete document.body.dataset.courseSection;
  }
  const containers = {home:'#homeContent',about:'#aboutContent',courses:'#coursesContent',contact:'#contactContent',sitemap:'#sitemapContent',course:'#courseContent'};
  Object.values(containers).forEach(sel => { const el=$(sel); if(el) el.classList.add('is-hidden'); });
  const activeContainer=$(containers[document.body.dataset.page] || '#homeContent');
  if(activeContainer) activeContainer.classList.remove('is-hidden');
  renderShell();
  window.scrollTo({top:0,behavior:'auto'});
}
async function init() {
  try {
    if (window.PREVIEW_MODE && window.PREVIEW_DATA) DB = window.PREVIEW_DATA;
    else {
      const response = await fetch(new URL('data/courses.json', document.baseURI), {cache:'no-store'});
      if (!response.ok) throw new Error('Không tải được dữ liệu chương trình.');
      DB = await response.json();
    }
    if (DB.schema !== 'LEARNING_PORTAL' || !Array.isArray(DB.courses)) throw new Error('Dữ liệu cổng thông tin chưa đúng cấu trúc.');
    if (window.PREVIEW_MODE) routeFromHash();
    else renderShell();
  } catch (error) {
    const target = $('#pageContent') || $('main');
    if (target) target.innerHTML = `<div class="container page-pad"><div class="empty-state"><h2>${esc(C('labels','unknownPageTitle','Chưa thể tải nội dung cổng thông tin'))}</h2><p>${esc(C('labels','unknownPageDescription','Vui lòng tải lại trang hoặc kiểm tra file data/courses.json trong bộ website.'))}</p></div></div>`;
    console.error(error);
  }
}
if (window.PREVIEW_MODE) window.addEventListener('hashchange', routeFromHash);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
