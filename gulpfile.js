import gulp from "gulp";
import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";

gulp.task("svgSpriteBuild", () => {
  return gulp
    .src(`./src/assets/images/icons/*.svg`)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            rener: {
              css: false,
              scss: false,
            },
            dest: "./src/assets/images/",
            sprite: "sprite.svg",
          },
        },
      })
    )
    .pipe(gulp.dest("./"));
});
