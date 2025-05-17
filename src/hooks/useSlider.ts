import { useEffect, useState } from "preact/hooks";
import KeenSlider, {
  type KeenSliderInstance,
  type KeenSliderOptions,
} from "keen-slider";
import { debounce } from "@/helpers/debounce";

type UseSliderOptions = KeenSliderOptions & {
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  onCreated?: (
    instance: KeenSliderInstance,
    rootEl: HTMLElement,
    sliderEl: HTMLElement
  ) => void;
};

export function useSlider(
  rootRef: preact.RefObject<HTMLElement>,
  options: UseSliderOptions,
  itemCount: number
) {
  const [sliderInstance, setSliderInstance] =
    useState<KeenSliderInstance | null>(null);
  const [_, setLoopEnabled] = useState(true);

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;
    const sliderEl = root.querySelector(".keen-slider") as HTMLElement;
    const paginationEl = root.querySelector(
      ".wf_pagination"
    ) as HTMLElement | null;
    const prev = root.querySelector(".prev") as HTMLButtonElement | null;
    const next = root.querySelector(".next") as HTMLButtonElement | null;

    if (!sliderEl) return;

    const getPerView = () => {
      const width = window.innerWidth;
      if (width >= 1440) return 4;
      if (width >= 1024) return 3;
      if (width >= 650) return 2;
      return 1;
    };

    const createPagination = (instance: KeenSliderInstance) => {
      if (!paginationEl) return;

      //   @ts-expect-error
      const perView = instance.options.slides?.perView as number;
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

      //   @ts-expect-error
      const perView = instance.options.slides?.perView as number;
      const currentPage = Math.floor(instance.track.details.rel / perView);

      paginationEl.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentPage);
      });
    };

    const updateSlider = () => {
      const perView = getPerView();
      const shouldLoop = itemCount > perView;
      setLoopEnabled(shouldLoop);

      const instance = new KeenSlider(sliderEl, {
        ...options,
        loop: shouldLoop,
        created: (slider) => {
          root.classList.remove("nojs");

          if (prev && next) {
            prev.onclick = () => slider.prev();
            next.onclick = () => slider.next();
          }

          createPagination(slider);
          options.onCreated?.(slider, root, sliderEl);
        },
        slideChanged: (slider) => {
          updatePagination(slider);
        },
        updated: (slider) => {
          createPagination(slider);
        },
      });

      setSliderInstance((prev) => {
        prev?.destroy();
        return instance;
      });
    };

    updateSlider();

    const handleResize = debounce(updateSlider, 200);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      sliderInstance?.destroy();
    };
  }, [itemCount]);
}
