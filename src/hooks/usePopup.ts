import { useEffect } from "preact/hooks";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type usePopupyOptions = {
  selector: string;
  trigger?: string;
  slides: string[];
};

export function usePopup({
  selector,
  trigger = "figure",
  slides,
}: usePopupyOptions) {
  useEffect(() => {
    const galleries = document.querySelectorAll<HTMLElement>(selector);

    galleries.forEach((gallery) => {
      const triggers = gallery.querySelectorAll(trigger);

      triggers.forEach((el, index) => {
        const handler = () => {
          Fancybox.show(
            slides.map((url) => ({ src: url })),
            {
              startIndex: index,
              compact: false,
              idle: false,
              animated: true,
              showClass: false,
              hideClass: false,
              dragToClose: false,
              Images: {
                zoom: true,
              },
              Toolbar: {
                display: {
                  left: [],
                  middle: [],
                  right: ["close"],
                },
              },
            }
          );
        };

        el.addEventListener("click", handler);

        return () => {
          el.removeEventListener("click", handler);
        };
      });
    });

    return () => {
      Fancybox.close();
    };
  }, [selector, trigger, slides]);
}
