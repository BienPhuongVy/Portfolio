/* =========================================================
   Portfolio – Biện Phương Vy  |  script dùng chung cho mọi trang
   ========================================================= */
(function () {
    "use strict";

    const $  = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Toast ---------- */
    let toastTimer;
    function toast(msg, type) {
        let el = $("#toast");
        if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); }
        el.className = "toast show " + (type || "ok");
        el.innerHTML = '<i class="fa-solid ' + (type === "err" ? "fa-circle-exclamation" : "fa-circle-check") + '"></i><span></span>';
        el.lastChild.textContent = msg;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove("show"), 3800);
    }

    /* ---------- Menu: trang đang mở + thanh trượt ---------- */
    const header = $("header");
    const nav = $("header nav");
    const indicator = $(".nav-indicator", nav || document);
    const navLinks = $$("nav ul li a");

    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    function markActive() {
        let current = null;
        navLinks.forEach(a => {
            const href = (a.getAttribute("href") || "").toLowerCase();
            const file = href.split("#")[0];
            a.classList.remove("active");
            if (!href.includes("#") && file === page) current = a;
        });
        if (!current) current = navLinks[0];
        if (current) current.classList.add("active");
    }
    function activeLink() { return $("nav a.active") || navLinks[0]; }
    function moveIndicator(item) {
        if (!indicator || !item) return;
        indicator.style.width  = item.offsetWidth  + "px";
        indicator.style.height = item.offsetHeight + "px";
        indicator.style.left   = item.offsetLeft   + "px";
        indicator.style.top    = item.offsetTop    + "px";
    }
    if (nav) {
        markActive();
        moveIndicator(activeLink());
        window.addEventListener("load", () => moveIndicator(activeLink()));
        window.addEventListener("resize", () => moveIndicator(activeLink()));
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveIndicator(activeLink()));
        navLinks.forEach(l => l.addEventListener("mouseenter", () => moveIndicator(l)));
        nav.addEventListener("mouseleave", () => moveIndicator(activeLink()));
    }

    /* ---------- Header nổi khi cuộn ---------- */
    function onScroll() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 50);
        const bt = $(".back-top");
        if (bt) bt.classList.toggle("show", window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Menu điện thoại ---------- */
    const navbar = $(".navbar");
    if (navbar && header) {
        const toggle = document.createElement("button");
        toggle.className = "menu-toggle";
        toggle.setAttribute("aria-label", "Mở menu");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        navbar.appendChild(toggle);
        const setOpen = open => {
            header.classList.toggle("menu-open", open);
            toggle.setAttribute("aria-expanded", open);
            toggle.innerHTML = '<i class="fa-solid ' + (open ? "fa-xmark" : "fa-bars") + '"></i>';
            if (!open) moveIndicator(activeLink());
        };
        toggle.addEventListener("click", () => setOpen(!header.classList.contains("menu-open")));
        $$("nav a, .nav-action button").forEach(el => el.addEventListener("click", () => setOpen(false)));
        document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
    }

    /* ---------- Cuộn mượt tới #mục trong cùng trang ---------- */
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            const id = a.getAttribute("href");
            if (id.length < 2) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
            const t = $(id);
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", id); }
        });
    });

    /* ---------- Nút Tải CV / Kết nối ---------- */
    $$(".btn-download").forEach(b => b.addEventListener("click", () => {
        toast("Đang mở CV – chọn “Lưu dưới dạng PDF” để tải về");
        window.open("cv.html?print=1", "_blank");
    }));
    $$(".btn-connect").forEach(b => b.addEventListener("click", () => {
        if ($("#contact")) $("#contact").scrollIntoView({ behavior: "smooth" });
        else location.href = "index.html#contact";
    }));

    /* ---------- Nút lên đầu trang ---------- */
    if (!$(".back-top")) {
        const bt = document.createElement("button");
        bt.className = "back-top";
        bt.setAttribute("aria-label", "Lên đầu trang");
        bt.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        bt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        document.body.appendChild(bt);
    }

    /* ---------- Hiệu ứng nền: hoa anh đào, bong bóng, lá ---------- */
    const fx = $("#sakura-container");
    if (fx && !reduceMotion) {
        const MAX = 28;
        const spawn = (cls, glyphs, size, dur, op, life) => {
            if (document.hidden || fx.childElementCount > MAX) return;
            const el = document.createElement("div");
            el.className = cls;
            el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
            el.style.left = Math.random() * 100 + "vw";
            el.style.fontSize = (size[0] + Math.random() * size[1]) + "px";
            el.style.animationDuration = (dur[0] + Math.random() * dur[1]) + "s";
            el.style.opacity = op[0] + Math.random() * op[1];
            fx.appendChild(el);
            setTimeout(() => el.remove(), life);
        };
        setInterval(() => spawn("sakura", ["🌸"], [15, 15], [8, 8], [0.08, 0.12], 16000), 600);
        setInterval(() => spawn("sakura", ["🫧"], [15, 15], [10, 8], [0.2, 0], 18000), 1100);
        setInterval(() => spawn("leaf", ["🌿", "🍃", "🌰"], [15, 15], [12, 8], [0.2, 0.3], 20000), 1700);
    }

    /* ---------- Hiện dần khi cuộn tới ---------- */
    const reveal = $$(".fade-up, .reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(es => es.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
        }), { threshold: 0.15 });
        reveal.forEach(el => io.observe(el));
    } else reveal.forEach(el => el.classList.add("show"));

    /* ---------- Thanh kỹ năng (trang Giới thiệu) ---------- */
    const edu = $(".education");
    if (edu) {
        $$(".skill-track span[data-width]", edu).forEach(b => b.style.setProperty("--skill-width", b.dataset.width));
        const run = () => edu.classList.add("skills-active");
        if ("IntersectionObserver" in window) {
            const o = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { run(); o.disconnect(); } }, { threshold: 0.2 });
            o.observe(edu);
        } else run();
    }

    /* ---------- Xem ảnh dự án phóng to ---------- */
    const shots = $$(".pj-shot img");
    if (shots.length) {
        const lb = document.createElement("div");
        lb.className = "lightbox";
        lb.innerHTML = '<button aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button><img alt="">';
        document.body.appendChild(lb);
        const img = $("img", lb);
        const close = () => lb.classList.remove("open");
        const openLb = src => { img.src = src; img.alt = ""; lb.classList.add("open"); };
        shots.forEach(i => { i.style.cursor = "zoom-in"; i.addEventListener("click", () => openLb(i.src)); });
        $$("a.pj-btn-solid[data-zoom]").forEach(a => a.addEventListener("click", e => {
            e.preventDefault(); openLb(a.getAttribute("href"));
        }));
        lb.addEventListener("click", close);
        document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    }

    /* ---------- Form liên hệ ---------- */
    const form = $("#contactForm");
    if (form) {
        const OWNER = "vybien.100805@gmail.com";
        const LS = "portfolio_contact_draft";
        const f = {
            name: $("#contactName"), email: $("#contactEmail"),
            phone: $("#contactPhone"), msg: $("#contactMessage")
        };
        try {
            const d = JSON.parse(localStorage.getItem(LS) || "null");
            if (d) { f.name.value = d.name || ""; f.email.value = d.email || ""; f.phone.value = d.phone || ""; f.msg.value = d.msg || ""; }
        } catch (_) {}
        const save = () => { try { localStorage.setItem(LS, JSON.stringify({ name: f.name.value, email: f.email.value, phone: f.phone.value, msg: f.msg.value })); } catch (_) {} };
        Object.values(f).forEach(el => el.addEventListener("input", () => { el.classList.remove("invalid"); save(); }));

        form.setAttribute("novalidate", "");
        form.addEventListener("submit", e => {
            e.preventDefault();
            const name = f.name.value.trim(), email = f.email.value.trim();
            const phone = f.phone.value.trim(), msg = f.msg.value.trim();
            let bad = null;
            if (name.length < 2) bad = [f.name, "Vui lòng nhập họ và tên"];
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad = [f.email, "Email chưa đúng định dạng"];
            else if (phone && !/^[+\d][\d\s.\-]{7,15}$/.test(phone)) bad = [f.phone, "Số điện thoại chưa hợp lệ"];
            else if (msg.length < 5) bad = [f.msg, "Hãy viết vài dòng nhắn gửi nhé"];
            if (bad) { bad[0].classList.add("invalid"); bad[0].focus(); toast(bad[1], "err"); return; }

            const subject = "Liên hệ từ Portfolio – " + name;
            const body = "Họ tên: " + name + "\nEmail: " + email + (phone ? "\nSĐT: " + phone : "") + "\n\n" + msg;
            const btn = $(".contact-submit", form);
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang mở email...';
            setTimeout(() => {
                location.href = "mailto:" + OWNER + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
                toast("Cảm ơn " + name + "! Hãy bấm Gửi trong ứng dụng email vừa mở nhé");
                try { localStorage.removeItem(LS); } catch (_) {}
                form.reset();
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi';
            }, 600);
        });
    }

    /* ---------- Copy email / số điện thoại khi bấm ---------- */
    $$(".contact-info-card").forEach(card => {
        const val = $("strong", card);
        if (!val || /Đà Nẵng/.test(val.textContent)) return;
        card.style.cursor = "pointer";
        card.title = "Bấm để sao chép";
        card.addEventListener("click", () => {
            const t = val.textContent.trim();
            (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
                .then(() => toast("Đã sao chép: " + t))
                .catch(() => toast(t));
        });
    });
})();
