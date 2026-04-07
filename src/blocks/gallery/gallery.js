import { Fancybox } from "../../js/fancybox.js";
import { Navigation, Pagination, Swiper } from "../../js/swiper.js";

export function initGallery() {
  document.querySelectorAll(".gallery__swiper").forEach((element) => {
    new Swiper(element, {
      modules: [Navigation, Pagination],
      slideClass: "gallery__slide",
      slidesPerView: 1,
      spaceBetween: 32,
      pagination: {
        el: element.querySelector(".pagination--gallery"),
        clickable: true,
      },
      navigation: {
        nextEl: element.querySelector(".arrow--gallery-next"),
        prevEl: element.querySelector(".arrow--gallery-prev"),
      },
    });
  });

  Fancybox.bind('[data-fancybox="gallery"]', {});
}
