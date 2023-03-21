// @ts-ignore
import resolveConfig from "tailwindcss/resolveConfig";
// @ts-ignore
import { TailwindConfig } from "tailwindcss/tailwind-config";
import config from "../../tailwind.config.js";

// @ts-ignore
const TailwindConfig = resolveConfig(config as TailwindConfig);

export default TailwindConfig