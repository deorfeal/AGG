export function initHeaderLangsHover() {
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
