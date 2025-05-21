import LazyLoad from "vanilla-lazyload";
import scroll from "./scroll";

document.addEventListener("DOMContentLoaded", function () {
  new LazyLoad({
    elements_selector: ["[data-src]", "[data-srcset]"],
  });

  scroll();
});
