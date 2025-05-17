import LazyLoad from "vanilla-lazyload";

let instance: LazyLoad | null = null;

export function getLazyLoadInstance(): LazyLoad {
  if (!instance) {
    instance = new LazyLoad({
      elements_selector: "img[data-src], source[data-srcset]",
      threshold: 300,
      class_loaded: "loaded",
      callback_loaded: (el) => {
        el.classList.add("lazyloaded");
      },
    });
  } else {
    instance.update();
  }

  return instance;
}
