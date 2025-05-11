import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import type { KeenSliderInstance, KeenSliderOptions } from "keen-slider";

function createPagination(instance, container: HTMLElement) {
  const { perView } = instance.options.slides!;
  const pageCount = Math.ceil(instance.track.details.slides.length / perView);
  const fragment = document.createDocumentFragment();

  container.innerHTML = "";

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    dot.setAttribute("aria-label", `Go to page ${i + 1}`);
    dot.addEventListener("click", () => instance.moveToIdx(i * perView));
    fragment.appendChild(dot);
  }

  container.appendChild(fragment);
  updatePagination(instance, container);
}

function updatePagination(instance, container: HTMLElement) {
  const currentPage = Math.floor(
    instance.track.details.rel / instance.options.slides!.perView
  );
  container.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentPage);
  });
}

function setupAutoSwitch(slider: KeenSliderInstance) {
  let timeout: ReturnType<typeof setTimeout>;
  let isPaused = false;

  const clearNextTimeout = () => {
    clearTimeout(timeout);
    timeout = null!;
  };

  const nextTimeout = () => {
    if (!isPaused && !timeout) {
      timeout = setTimeout(() => {
        slider.next();
      }, 2000);
    }
  };

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);

  slider.container.addEventListener("mouseenter", () => {
    isPaused = true;
    clearNextTimeout();
  });

  slider.container.addEventListener("mouseleave", () => {
    isPaused = false;
    nextTimeout();
  });

  nextTimeout();
}

function checkButtons(
  instance,
  prev: HTMLButtonElement | null,
  next: HTMLButtonElement | null
) {
  const slidesPerView = instance.options.slides!.perView || 1;
  const totalSlides = instance.track.details.slides.length;
  const currentSlide = instance.track.details.rel;
  const isLoop = instance.options.loop || false;

  if (prev && next) {
    prev.disabled =
      totalSlides <= slidesPerView || (!isLoop && currentSlide === 0);
    next.disabled =
      totalSlides <= slidesPerView ||
      (!isLoop && currentSlide >= totalSlides - slidesPerView);
  }
}

export default function initializeSlider(
  sliderElement: HTMLElement | null,
  options: KeenSliderOptions = {},
  onCreated?: (
    instance: KeenSliderInstance,
    element: HTMLElement,
    keenElement: HTMLElement
  ) => void
) {
  if (!sliderElement) return;

  const keenElement = sliderElement.querySelector(
    ".keen-slider"
  ) as HTMLElement;
  const paginationContainer = sliderElement.querySelector(
    ".wf_pagination"
  ) as HTMLElement | null;
  const prev = sliderElement.querySelector(".prev") as HTMLButtonElement | null;
  const next = sliderElement.querySelector(".next") as HTMLButtonElement | null;

  const sliderOptions: KeenSliderOptions = {
    ...options,
    created: (instance: KeenSliderInstance) => {
      sliderElement.classList.remove("nojs");

      if (paginationContainer) {
        createPagination(instance, paginationContainer);

        const handleResize = () => {
          createPagination(instance, paginationContainer);
        };
        window.addEventListener("resize", handleResize);
      }

      if (prev && next) {
        checkButtons(instance, prev, next);
      }

      if (typeof onCreated === "function") {
        onCreated(instance, sliderElement, keenElement);
      }

      if (prev && next) {
        prev.addEventListener("click", () => instance.prev());
        next.addEventListener("click", () => instance.next());
      }
    },
    slideChanged: (instance: KeenSliderInstance) => {
      if (paginationContainer) {
        updatePagination(instance, paginationContainer);
      }

      if (prev && next) {
        checkButtons(instance, prev, next);
      }
    },
  };

  new KeenSlider(keenElement, sliderOptions);
}
