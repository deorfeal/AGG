const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const sassCompiler = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const gulpPostcss = require("gulp-postcss");
const postcss = require("postcss");
const nunjucksRender = require("gulp-nunjucks-render");
const data = require("gulp-data");
const del = require("del");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const esbuild = require("esbuild");
const browserslistToEsbuild = require("browserslist-to-esbuild").default;
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const convertFonts = require("./scripts/convert-fonts");

const paths = {
  root: {
    src: "src",
    dist: "dist",
  },
  pages: "src/pages/*.njk",
  templates: ["src/templates/**/*.njk", "src/blocks/**/*.njk", "src/pages/**/*.njk", "src/data/**/*.json"],
  styles: {
    entry: "src/scss/style.scss",
    watch: ["src/scss/**/*.scss", "src/blocks/**/*.scss"],
    dest: "dist/css",
  },
  scripts: {
    entries: [
      {
        entry: "src/js/app.js",
        name: "app",
      },
      {
        entry: "src/js/swiper.js",
        name: "swiper",
      },
      {
        entry: "src/js/aos.js",
        name: "aos",
      },
      {
        entry: "src/js/fancybox.js",
        name: "fancybox",
      },
      {
        entry: "src/js/libs-css.js",
        name: "../css/libs",
      },
    ],
    watch: ["src/js/**/*.js", "src/blocks/**/*.js"],
    destDir: "dist/js",
  },
  static: {
    src: "src/static/**/*",
    dest: "dist",
  },
};

function isProduction() {
  return process.env.NODE_ENV !== "development";
}

function onError(error) {
  console.error(error.message || error.toString());
  this.emit("end");
}

function getSiteData() {
  const siteDataPath = path.resolve(paths.root.src, "data", "site.json");
  const raw = fs.readFileSync(siteDataPath, "utf8");

  return JSON.parse(raw);
}

function clean() {
  return del([paths.root.dist]);
}

function html() {
  return src(paths.pages)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(
      data(() => ({
        site: getSiteData(),
        build: {
          isProd: isProduction(),
          year: new Date().getFullYear(),
        },
      }))
    )
    .pipe(
      nunjucksRender({
        path: [path.resolve(paths.root.src, "templates"), path.resolve(paths.root.src)],
      })
    )
    .pipe(dest(paths.root.dist))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.styles.entry, { sourcemaps: !isProduction() })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(
      sassCompiler.sync({
        outputStyle: "expanded",
      }).on("error", sassCompiler.logError)
    )
    .pipe(gulpPostcss([autoprefixer()]))
    .pipe(dest(paths.styles.dest, { sourcemaps: !isProduction() ? "." : false }))
    .pipe(browserSync.stream());
}

async function stylesMin() {
  const sourcePath = path.resolve(paths.styles.dest, "style.css");
  const destPath = path.resolve(paths.styles.dest, "style.min.css");
  const source = await fs.promises.readFile(sourcePath, "utf8");
  const result = await postcss([
    autoprefixer(),
    cssnano({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ]).process(source, { from: sourcePath, to: destPath });

  await fs.promises.writeFile(destPath, result.css);
}

async function scripts() {
  try {
    await Promise.all(
      paths.scripts.entries.map(({ entry, name }) =>
        esbuild.build({
          entryPoints: [entry],
          outfile: path.resolve(paths.scripts.destDir, `${name}.js`),
          bundle: true,
          format: "esm",
          minify: false,
          sourcemap: !isProduction(),
          target: browserslistToEsbuild(),
          logLevel: "silent",
        })
      )
    );
  } catch (error) {
    console.error(error.message || error.toString());

    if (isProduction()) {
      throw error;
    }
  }

  browserSync.reload();
}

async function scriptsMin() {
  await Promise.all(
    paths.scripts.entries.map(({ entry, name }) =>
      esbuild.build({
        entryPoints: [entry],
        outfile: path.resolve(paths.scripts.destDir, `${name}.min.js`),
        bundle: true,
        format: "esm",
        minify: true,
        sourcemap: false,
        target: browserslistToEsbuild(),
        logLevel: "silent",
      })
    )
  );
}

async function pruneProductionArtifacts() {
  if (!isProduction()) {
    return;
  }

  const jsDir = path.resolve(paths.root.dist, "js");
  const cssDir = path.resolve(paths.root.dist, "css");

  if (fs.existsSync(jsDir)) {
    const jsFiles = await fs.promises.readdir(jsDir);
    await Promise.all(
      jsFiles.map(async (fileName) => {
        const shouldKeep =
          fileName === "app.js" ||
          fileName === "app.min.js" ||
          fileName === "aos.min.js" ||
          fileName === "swiper.min.js" ||
          fileName === "fancybox.min.js";

        if (!shouldKeep) {
          await fs.promises.rm(path.join(jsDir, fileName), { force: true });
        }
      })
    );
  }

  if (fs.existsSync(cssDir)) {
    const cssFiles = await fs.promises.readdir(cssDir);
    await Promise.all(
      cssFiles.map(async (fileName) => {
        const shouldKeep =
          fileName === "style.css" ||
          fileName === "style.min.css" ||
          fileName === "libs.min.css";

        if (!shouldKeep) {
          await fs.promises.rm(path.join(cssDir, fileName), { force: true });
        }
      })
    );
  }
}

async function pruneDevelopmentArtifacts() {
  if (isProduction()) {
    return;
  }

  const jsDir = path.resolve(paths.root.dist, "js");
  const cssDir = path.resolve(paths.root.dist, "css");

  if (fs.existsSync(jsDir)) {
    const jsFiles = await fs.promises.readdir(jsDir);
    await Promise.all(
      jsFiles.map(async (fileName) => {
        const shouldKeep =
          fileName === "app.js" ||
          fileName === "app.min.js" ||
          fileName === "aos.min.js" ||
          fileName === "swiper.min.js" ||
          fileName === "fancybox.min.js";

        if (!shouldKeep) {
          await fs.promises.rm(path.join(jsDir, fileName), { force: true });
        }
      })
    );
  }

  if (fs.existsSync(cssDir)) {
    const cssFiles = await fs.promises.readdir(cssDir);
    await Promise.all(
      cssFiles.map(async (fileName) => {
        const shouldKeep =
          fileName === "style.css" ||
          fileName === "style.min.css" ||
          fileName === "libs.min.css";

        if (!shouldKeep) {
          await fs.promises.rm(path.join(cssDir, fileName), { force: true });
        }
      })
    );
  }
}

function formatDistHtml(done) {
  try {
    execSync('npx prettier --write "dist/*.html"', { stdio: "ignore" });

    const htmlDir = path.resolve(paths.root.dist);
    const files = fs.readdirSync(htmlDir).filter((fileName) => fileName.endsWith(".html"));

    files.forEach((fileName) => {
      const filePath = path.join(htmlDir, fileName);
      const source = fs.readFileSync(filePath, "utf8");
      const normalized = source
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n\s*\n\s*\n+/g, "\n\n");

      fs.writeFileSync(filePath, normalized);
    });
  } catch (error) {
    console.error(error.message || error.toString());
  }

  done();
}

async function copyStatic() {
  const staticSource = path.resolve(paths.root.src, "static");
  const staticDest = path.resolve(paths.root.dist);

  if (!fs.existsSync(staticSource)) {
    return;
  }

  const copyRecursive = async (sourceDir, destDir) => {
    await fs.promises.mkdir(destDir, { recursive: true });
    const entries = await fs.promises.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        await copyRecursive(sourcePath, destPath);
        continue;
      }

      const buffer = await fs.promises.readFile(sourcePath);
      await fs.promises.writeFile(destPath, buffer);
    }
  };

  await copyRecursive(staticSource, staticDest);
}

function fonts() {
  return convertFonts();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: paths.root.dist,
    },
    notify: false,
    open: false,
  });

  done();
}

function watcher(done) {
  watch(paths.templates, html);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.watch, scripts);
  watch(paths.static.src, series(fonts, copyStatic, reload));
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function setDevelopment(done) {
  process.env.NODE_ENV = "development";
  done();
}

function setProduction(done) {
  process.env.NODE_ENV = "production";
  done();
}

const dev = series(setDevelopment, clean, parallel(html, styles, scripts, series(fonts, copyStatic)), serve);
const buildDev = series(
  setDevelopment,
  clean,
  parallel(
    html,
    series(styles, stylesMin),
    series(scripts, scriptsMin),
    series(fonts, copyStatic),
  ),
  pruneDevelopmentArtifacts,
);
const build = series(
  setProduction,
  clean,
  parallel(
    html,
    series(styles, stylesMin),
    series(scripts, scriptsMin),
    series(fonts, copyStatic),
  ),
  formatDistHtml,
  pruneProductionArtifacts,
);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.stylesMin = stylesMin;
exports.scripts = scripts;
exports.scriptsMin = scriptsMin;
exports.pruneProductionArtifacts = pruneProductionArtifacts;
exports.pruneDevelopmentArtifacts = pruneDevelopmentArtifacts;
exports.formatDistHtml = formatDistHtml;
exports.copyStatic = copyStatic;
exports.fonts = fonts;
exports.watch = series(
  setDevelopment,
  clean,
  parallel(html, styles, scripts, series(fonts, copyStatic)),
  serve,
  watcher,
);
exports.buildDev = buildDev;
exports.build = build;
exports.default = dev;
