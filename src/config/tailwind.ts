import resolveConfig from "tailwindcss/resolveConfig";
import type { TailwindConfig } from "tailwindcss/nesting";
import config from "../../tailwind.config.js";

const TailwindConfigs = resolveConfig(config as TailwindConfig);

export default TailwindConfigs