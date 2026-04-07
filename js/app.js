// src/js/app.js
import { AOS } from "./aos.min.js";

// src/blocks/attachments/attachments.js
import { Fancybox } from "./fancybox.min.js";
import { FreeMode, Navigation, Pagination, Swiper } from "./swiper.min.js";
function initAttachments() {
  document.querySelectorAll(".attachments__swiper").forEach((element) => {
    new Swiper(element, {
      modules: [FreeMode, Navigation, Pagination],
      slideClass: "attachments__slide",
      slidesPerView: "auto",
      spaceBetween: 32,
      freeMode: {
        enabled: true,
        momentum: true
      },
      pagination: {
        el: element.querySelector(".pagination--attachments"),
        clickable: true
      },
      navigation: {
        nextEl: element.querySelector(".arrow--attachments-next"),
        prevEl: element.querySelector(".arrow--attachments-prev")
      }
    });
  });
  Fancybox.bind('[data-fancybox="certificates"]', {});
  Fancybox.bind('[data-fancybox="letters"]', {});
}

// src/blocks/companies/companies.js
import { Grid, Navigation as Navigation2, Pagination as Pagination2, Swiper as Swiper2 } from "./swiper.min.js";
function initCompanies() {
  document.querySelectorAll(".companies__swiper").forEach((element) => {
    new Swiper2(element, {
      modules: [Grid, Navigation2, Pagination2],
      slideClass: "companies__slide",
      slidesPerView: 2,
      grid: {
        rows: 2,
        fill: "row"
      },
      spaceBetween: 10,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
      resizeObserver: true,
      breakpoints: {
        576: {
          slidesPerView: 3,
          grid: {
            rows: 2,
            fill: "row"
          },
          spaceBetween: 10,
          watchOverflow: true
        },
        768: {
          slidesPerView: 4,
          grid: {
            rows: 2,
            fill: "row"
          },
          spaceBetween: 10,
          watchOverflow: true
        },
        992: {
          slidesPerView: 6,
          grid: {
            rows: 2,
            fill: "row"
          },
          spaceBetween: 10,
          watchOverflow: true
        },
        1200: {
          slidesPerView: 10,
          grid: {
            rows: 2,
            fill: "row"
          },
          spaceBetween: 10,
          watchOverflow: true
        }
      },
      pagination: {
        el: element.querySelector(".pagination--companies"),
        clickable: true
      },
      navigation: {
        nextEl: element.querySelector(".arrow--companies-next"),
        prevEl: element.querySelector(".arrow--companies-prev")
      }
    });
  });
}

// src/blocks/gallery/gallery.js
import { Fancybox as Fancybox2 } from "./fancybox.min.js";
import { Navigation as Navigation3, Pagination as Pagination3, Swiper as Swiper3 } from "./swiper.min.js";
function initGallery() {
  document.querySelectorAll(".gallery__swiper").forEach((element) => {
    new Swiper3(element, {
      modules: [Navigation3, Pagination3],
      slideClass: "gallery__slide",
      slidesPerView: 1,
      spaceBetween: 32,
      pagination: {
        el: element.querySelector(".pagination--gallery"),
        clickable: true
      },
      navigation: {
        nextEl: element.querySelector(".arrow--gallery-next"),
        prevEl: element.querySelector(".arrow--gallery-prev")
      }
    });
  });
  Fancybox2.bind('[data-fancybox="gallery"]', {});
}

// src/blocks/header/header.js
function initHeaderLangsHover() {
  document.querySelectorAll(".header__burger").forEach((burger) => {
    burger.addEventListener("click", () => {
      document.body.classList.toggle("body--active");
    });
  });
  document.querySelectorAll(".langs").forEach((langs) => {
    const langsList = langs.querySelector(".langs-list");
    if (!langsList) return;
    const items = Array.from(langsList.querySelectorAll(".langs-item"));
    if (!items.length) return;
    let highlight = langs.querySelector(".langs__highlight");
    if (!highlight) {
      highlight = document.createElement("div");
      highlight.classList.add("langs__highlight");
      langs.appendChild(highlight);
    }
    let activeItem = langsList.querySelector(".langs-item--active") || items[0];
    const setActive = (target) => {
      items.forEach((item) => item.classList.remove("langs-item--active"));
      target.classList.add("langs-item--active");
    };
    const moveHighlight = (target) => {
      const rect = target.getBoundingClientRect();
      const parentRect = langsList.getBoundingClientRect();
      const left = rect.left - parentRect.left;
      highlight.style.transform = `translate(${left}px, -50%)`;
    };
    setActive(activeItem);
    moveHighlight(activeItem);
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        setActive(item);
        moveHighlight(item);
      });
      item.addEventListener("click", () => {
        activeItem = item;
      });
    });
    langsList.addEventListener("mouseleave", () => {
      setActive(activeItem);
      moveHighlight(activeItem);
    });
    window.addEventListener("resize", () => {
      moveHighlight(activeItem);
    });
  });
}

// src/js/app.js
function initApp() {
  AOS.init({
    duration: 750,
    offset: 0,
    anchorPlacement: "top-bottom"
  });
  initAttachments();
  initCompanies();
  initGallery();
  initHeaderLangsHover();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
export {
  initApp
};
