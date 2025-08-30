import { globalIgnores } from "eslint/config";
import { fileURLToPath } from "node:url";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfigWithVueTs(
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: fileURLToPath(new URL(".", import.meta.url)),
      },
    },
  },
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
);
