import { useEffect, useRef } from "preact/hooks";
import initializeSlider from "src/utils/sliders";

export default function Slider() {
  const sectionRef = useRef(null);

  useEffect(() => {
    initializeSlider(sectionRef.current, {
      loop: true,
      slides: {
        perView: 2,
        spacing: 20,
      },
    });
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="keen-slider">
        <div className="keen-slider__slide">Slide 1</div>
        <div className="keen-slider__slide">Slide 2</div>
        <div className="keen-slider__slide">Slide 3</div>
      </div>
    </section>
  );
}
