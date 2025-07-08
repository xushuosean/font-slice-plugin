// src/index.ts
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// src/InternalFontSlice.ts
import createFontSlice from "font-slice";
var InternalFontSlice = async (options) => {
  return await createFontSlice({
    ...options
  });
};

// src/index.ts
var index_default = (api) => {
  api.describe({
    key: "fontSlice",
    config: {
      schema(joi) {
        return joi.alternatives().try(
          joi.object({
            fontPath: joi.string().required(),
            outputDir: joi.string().optional().default("font-slice"),
            formats: joi.array().min(1).default(["woff2"])
          }),
          joi.array().items(
            joi.object({
              fontPath: joi.string().required(),
              outputDir: joi.string().optional().default("font-slice"),
              formats: joi.array().min(1).default(["woff2"])
            })
          )
        ).allow(null);
      }
    },
    enableBy: api.EnableBy.config
  });
  if (process.env.NODE_ENV !== "production") return;
  api.onBuildComplete(async () => {
    const arrayifyFontSlice = Array.isArray(api.config.fontSlice) ? api.config.fontSlice : [api.config.fontSlice];
    return await Promise.all(arrayifyFontSlice.map((item) => {
      return genBuilder(item, api);
    }));
  });
  api.modifyHTML(($) => {
    const arrayifyFontSlice = Array.isArray(api.config.fontSlice) ? api.config.fontSlice : [api.config.fontSlice];
    arrayifyFontSlice.forEach((item) => {
      const output = item.output || "font-slice";
      $("head").prepend(`<link rel="stylesheet" href="/${output}/font.css">`);
    });
    return $;
  });
};
async function genBuilder(option, api) {
  const absFont = join(api.cwd, option.fontPath);
  const absOutput = join(api.paths.absOutputPath, option.outputDir);
  if (!existsSync(absFont)) {
    api.logger.error(`[font-slice] Font file not found: ${absFont}`);
    return;
  }
  if (!existsSync(absOutput)) {
    mkdirSync(absOutput, { recursive: true });
  }
  api.logger.info(`[font-slice] slicing font: ${option.fontPath}, outputDir: ${option.outputDir}, formats: ${option.formats}`);
  return await InternalFontSlice({
    ...option,
    fontPath: absFont,
    outputDir: absOutput,
    preview: false
  });
}
export {
  index_default as default
};
