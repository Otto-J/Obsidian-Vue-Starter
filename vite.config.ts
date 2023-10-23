// import path from "path";
import { defineConfig } from "vite";
import builtins from "builtin-modules";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import process from "node:process";
import path from "path";

import fs from "fs/promises";
import manifest from "./manifest.json";

import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
const env = dotenv.config();
dotenvExpand.expand(env);

// const isWatch = process.argv[2] === "watch";

export default defineConfig(({ command }) => {
  const isProd = command === "build";

  return {
    plugins: [
      vue(),
      {
        name: "postbuild-commands",
        async closeBundle() {
          if (!process.env.OB_PLUGIN_DIST) {
            console.log(
              "为了更好的开发体验，你可以在 .env 中配置 OB_PLUGIN_DIST"
            );
            return;
          }
          const dist = process.env.OB_PLUGIN_DIST + manifest.id + "-dev";

          await fs.mkdir(dist, { recursive: true });

          const copy = async (src: string, dist: string) => {
            await fs.copyFile(src, path.resolve(dist, src));
          };
          // do something
          // copy file
          await Promise.all([
            await copy("./main.js", dist),
            await copy("./styles.css", dist),
            await copy("./manifest.json", dist),
          ]);
          console.log("复制结果到", dist);
        },
      },
    ],
    build: {
      target: "esnext",
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
      lib: {
        entry: fileURLToPath(new URL("./src/starterIndex.ts", import.meta.url)),
        formats: ["cjs"],
      },
      css: {},
      rollupOptions: {
        output: {
          entryFileNames: "main.js",
          exports: "named",
          assetFileNames: "styles.css",
        },
        external: [
          "obsidian",
          "electron",
          "codemirror",
          "@codemirror/autocomplete",
          "@codemirror/closebrackets",
          "@codemirror/collab",
          "@codemirror/commands",
          "@codemirror/comment",
          "@codemirror/fold",
          "@codemirror/gutter",
          "@codemirror/highlight",
          "@codemirror/history",
          "@codemirror/language",
          "@codemirror/lint",
          "@codemirror/matchbrackets",
          "@codemirror/panel",
          "@codemirror/rangeset",
          "@codemirror/rectangular-selection",
          "@codemirror/search",
          "@codemirror/state",
          "@codemirror/stream-parser",
          "@codemirror/text",
          "@codemirror/tooltip",
          "@codemirror/view",
          "@lezer/common",
          "@lezer/lr",
          "@lezer/highlight",
          ...builtins,
        ],
      },
      // Use root as the output dir
      emptyOutDir: false,
      outDir: ".",
    },
  };
});
