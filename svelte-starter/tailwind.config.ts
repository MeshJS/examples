import type { Config } from "tailwindcss";

const sharedConfig: Omit<Config, "content"> = {
  theme: {
    extend: {},
  },
  plugins: [],
};

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  prefix: "mesh-",
  presets: [sharedConfig],
} satisfies Config;

export default config;
