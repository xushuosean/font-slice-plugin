"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_fs = require("fs");
var import_path = require("path");

// src/InternalFontSlice.ts
var import_font_slice = __toESM(require("font-slice"));
var InternalFontSlice = async (fontPath, outputPath) => {
  return await (0, import_font_slice.default)({
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
  const absFont = (0, import_path.join)(api.cwd, font);
  const absOutput = (0, import_path.join)(api.paths.absOutputPath, output);
  if (!(0, import_fs.existsSync)(absFont)) {
    api.logger.error(`[font-slice] Font file not found: ${absFont}`);
    return;
  }
  if (!(0, import_fs.existsSync)(absOutput)) {
    (0, import_fs.mkdirSync)(absOutput, { recursive: true });
  }
  api.logger.info(`[font-slice] slicing font: ${font}`);
  return await InternalFontSlice(absFont, absOutput);
}
