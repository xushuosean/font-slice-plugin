// src/index.ts
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// src/InternalFontSlice.ts
import createFontSlice from "font-slice";
var InternalFontSlice = async (fontPath, outputPath) => {
  return await createFontSlice({
    fontPath,
    outputDir: outputPath,
    preview: false
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
            font: joi.string().required(),
            output: joi.string().default("font-slice")
          }),
          joi.array().items(
            joi.object({
              font: joi.string().required(),
              output: joi.string().default("font-slice")
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
      return genBuilder(item.font, item.output, api);
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
async function genBuilder(font, output, api) {
  const absFont = join(api.cwd, font);
  const absOutput = join(api.paths.absOutputPath, output);
  if (!existsSync(absFont)) {
    api.logger.error(`[font-slice] Font file not found: ${absFont}`);
    return;
  }
  if (!existsSync(absOutput)) {
    mkdirSync(absOutput, { recursive: true });
  }
  api.logger.info(`[font-slice] slicing font: ${font}`);
  return await InternalFontSlice(absFont, absOutput);
}
export {
  index_default as default
};
