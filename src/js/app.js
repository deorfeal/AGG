import { AOS } from "./aos.js";
import { initAttachments } from "../blocks/attachments/attachments";
import { initCompanies } from "../blocks/companies/companies";
import { initGallery } from "../blocks/gallery/gallery";
import { initHeaderLangsHover } from "../blocks/header/header";

export function initApp() {
  AOS.init({
    duration: 750,
    offset: 0,
    anchorPlacement: "top-bottom",
  });

  initAttachments();
  initCompanies();
  initGallery();
  initHeaderLangsHover();
}
