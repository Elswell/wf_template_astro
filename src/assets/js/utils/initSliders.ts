import KeenSlider, {
  type KeenSliderOptions,
  type KeenSliderInstance,
} from "keen-slider";

function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}

type SliderController = {
  destroy: () => void;
  getInstance: () => KeenSliderInstance | null;
};

export function initSliders(
  rootSelector: string,
  options: KeenSliderOptions = {},
  itemCount: number = 0
): SliderController[] {
  const rootElements = document.querySelectorAll<HTMLElement>(rootSelector);
  const controllers: SliderController[] = [];

  rootElements.forEach((rootEl) => {
    let sliderInstance: KeenSliderInstance | null = null;

    const sliderEl = rootEl.querySelector(".keen-slider") as HTMLElement | null;
    const paginationEl = rootEl.querySelector(
      ".wf_pagination"
    ) as HTMLElement | null;
    const prevBtn = rootEl.querySelector(".prev") as HTMLElement | null;
    const nextBtn = rootEl.querySelector(".next") as HTMLElement | null;

    if (!sliderEl) return;

    const getResponsivePerView = (): number => {
      const width = window.innerWidth;
      // @ts-expect-error
      const perViewOption = options.slides?.perView;

      if (typeof perViewOption === "number") return perViewOption;
      if (typeof perViewOption === "object") {
        const breakpoints = Object.keys(perViewOption)
          .map(Number)
          .filter((key) => !isNaN(key))
          .sort((a, b) => a - b);

        let matched = perViewOption.default || 1;
        for (const bp of breakpoints) {
          if (width >= bp) {
            matched = perViewOption[bp];
          }
        }
        return matched;
      }

      return 1;
    };

    const createPagination = (instance: KeenSliderInstance) => {
      if (!paginationEl) return;
      // @ts-expect-error

      const perView = instance.options.slides?.perView || 1;
      const pageCount = Math.ceil(itemCount / perView);
      paginationEl.innerHTML = "";

      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("button");
        dot.className = "dot";
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => {
          instance.moveToIdx(i * perView);
        });
        paginationEl.appendChild(dot);
      }

      updatePagination(instance);
    };

    const updatePagination = (instance: KeenSliderInstance) => {
      if (!paginationEl) return;

      // @ts-expect-error
      const perView = instance.options.slides?.perView || 1;
      const currentPage = Math.floor(instance.track.details.rel / perView);

      paginationEl.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentPage);
      });
    };

    const updateSlider = () => {
      const perView = getResponsivePerView();
      const shouldLoop = itemCount > perView;

      const instance = new KeenSlider(sliderEl, {
        ...options,
        loop: shouldLoop,
        slides: { perView },
        created: (slider) => {
          rootEl.classList.remove("nojs");

          if (prevBtn && nextBtn) {
            prevBtn.onclick = () => slider.prev();
            nextBtn.onclick = () => slider.next();
          }

          createPagination(slider);
          // @ts-expect-error
          if (options.onCreated) options.onCreated(slider, rootEl, sliderEl);
        },
        slideChanged: updatePagination,
        updated: createPagination,
      });

      if (sliderInstance) sliderInstance.destroy();
      sliderInstance = instance;
    };

    updateSlider();

    const handleResize = debounce(updateSlider, 200);
    window.addEventListener("resize", handleResize);

    controllers.push({
      destroy: () => {
        window.removeEventListener("resize", handleResize);
        sliderInstance?.destroy();
      },
      getInstance: () => sliderInstance,
    });
  });

  return controllers;
}
