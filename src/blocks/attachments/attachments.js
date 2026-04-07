import { Fancybox } from "../../js/fancybox.js";
import { FreeMode, Navigation, Pagination, Swiper } from "../../js/swiper.js";

export function initAttachments() {
  document.querySelectorAll(".attachments__swiper").forEach((element) => {
    new Swiper(element, {
      modules: [FreeMode, Navigation, Pagination],
      slideClass: "attachments__slide",
      slidesPerView: "auto",
      spaceBetween: 32,
      freeMode: {
        enabled: true,
        momentum: true,
      },
      pagination: {
        el: element.querySelector(".pagination--attachments"),
        clickable: true,
      },
      navigation: {
        nextEl: element.querySelector(".arrow--attachments-next"),
        prevEl: element.querySelector(".arrow--attachments-prev"),
      },
    });
  });

  Fancybox.bind('[data-fancybox="certificates"]', {});
  Fancybox.bind('[data-fancybox="letters"]', {});
}
