import AOS from "aos";
import "aos/dist/aos.css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { initAttachments } from "../blocks/attachments/attachments";
import { initCompanies } from "../blocks/companies/companies";
import { initGallery } from "../blocks/gallery/gallery";
import { initHeaderLangsHover } from "../blocks/header/header";

AOS.init({
  duration: 750,
  offset: 0,
  anchorPlacement: "top-bottom",
});

initAttachments();
initCompanies();
initGallery();
initHeaderLangsHover();
