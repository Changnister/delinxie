const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".site-nav, .nav"); /* support both class names */
const navItems = document.querySelectorAll(".site-nav a, .nav-item a");

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";

  const withoutTrailingSlash = pathname.replace(/\/+$/, "");
  const withoutIndex = withoutTrailingSlash.replace(/\/index(?:\.html)?$/i, "");
  const withoutHtml = withoutIndex.replace(/\.html$/i, "");

  return withoutHtml || "/";
}

function markActiveNavLink() {
  if (!navItems.length) return;

  const currentPath = normalizePath(window.location.pathname);

  navItems.forEach((link) => {
    link.removeAttribute("aria-current");
    link.classList.remove("is-active");

    const linkUrl = new URL(link.getAttribute("href"), window.location.origin);
    const linkPath = normalizePath(linkUrl.pathname);

    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
      link.classList.add("is-active");
    }
  });
}

function setMenuState(isOpen) {
  if (!hamburger || !navMenu) return;
  hamburger.classList.toggle("active", isOpen);
  navMenu.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function toggleMenu() {
  if (!hamburger || !navMenu) return;
  const isOpen = !hamburger.classList.contains("active");
  setMenuState(isOpen);
}

function closeMenu() {
  setMenuState(false);
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", toggleMenu);

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", markActiveNavLink, {
    once: true,
  });
} else {
  markActiveNavLink();
}
