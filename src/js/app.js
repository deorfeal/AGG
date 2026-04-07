import { AOS } from "./aos.js";
import { initAttachments } from "../blocks/attachments/attachments.js";
import { initCompanies } from "../blocks/companies/companies.js";
import { initGallery } from "../blocks/gallery/gallery.js";
import { initHeaderLangsHover } from "../blocks/header/header.js";

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
