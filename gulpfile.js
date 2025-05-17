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
        shape: {
          id: {
            generator: "i-%s",
          },
        },
        mode: {
          symbol: {
            dest: ".",
            sprite: "./public/sprite.svg",
            example: false,
          },
          css: {
            render: {
              scss: {
                template: "./src/styles/base/_sprite_template.scss",
                dest: "../../src/styles/base/_sprite.scss",
              },
            },
            dest: ".",
            sprite: "/public/sprite.svg",
          },
        },
        variables: {
          mapname: "i",
        },
      })
    )
    .pipe(gulp.dest("./"));
});
