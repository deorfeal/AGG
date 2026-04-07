import Swiper from "swiper";
import { Grid, Navigation, Pagination } from "swiper/modules";

export function initCompanies() {
  document.querySelectorAll(".companies__swiper").forEach((element) => {
    new Swiper(element, {
      modules: [Grid, Navigation, Pagination],
      slideClass: "companies__slide",
      slidesPerView: 2,
      grid: {
        rows: 2,
        fill: "row",
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
            fill: "row",
          },
          spaceBetween: 10,
          watchOverflow: true,
        },
        768: {
          slidesPerView: 4,
          grid: {
            rows: 2,
            fill: "row",
          },
          spaceBetween: 10,
          watchOverflow: true,
        },
        992: {
          slidesPerView: 6,
          grid: {
            rows: 2,
            fill: "row",
          },
          spaceBetween: 10,
          watchOverflow: true,
        },
        1200: {
          slidesPerView: 10,
          grid: {
            rows: 2,
            fill: "row",
          },
          spaceBetween: 10,
          watchOverflow: true,
        },
      },
      pagination: {
        el: element.querySelector(".pagination--companies"),
        clickable: true,
      },
      navigation: {
        nextEl: element.querySelector(".arrow--companies-next"),
        prevEl: element.querySelector(".arrow--companies-prev"),
      },
    });
  });
}
