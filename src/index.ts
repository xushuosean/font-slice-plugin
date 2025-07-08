import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { IApi } from 'umi';
import { InternalFontSlice } from './InternalFontSlice';

import { Option } from './InternalFontSlice';

export default (api: IApi) => {
  api.describe({
    key: 'fontSlice',
    config: {
      schema(joi) {
        return joi.alternatives().try(
          joi.object<Option>({
            fontPath: joi.string().required(),
            outputDir: joi.string().optional().default('font-slice'),
            formats: joi.array().min(1).default(['woff2'])
          }),
          joi.array().items(
            joi.object<Option>({
              fontPath: joi.string().required(),
              outputDir: joi.string().optional().default('font-slice'),
              formats: joi.array().min(1).default(['woff2'])
            })
          )
        ).allow(null); // 允许对象、数组或null
      },
    },
    enableBy: api.EnableBy.config,
  });

  if (process.env.NODE_ENV !== 'production') return;

  api.onBuildComplete(async () => {
    const arrayifyFontSlice = Array.isArray(api.config.fontSlice) ? api.config.fontSlice : [api.config.fontSlice];
    return await Promise.all(arrayifyFontSlice.map(item => {
      return genBuilder(item, api);
    }))
  });

  api.modifyHTML(($) => {
    const arrayifyFontSlice = Array.isArray(api.config.fontSlice) ? api.config.fontSlice : [api.config.fontSlice];
    arrayifyFontSlice.forEach(item => {
      const output = item.output || 'font-slice';
      $('head').prepend(`<link rel="stylesheet" href="/${output}/font.css">`);
    })
    return $;
  });


};

async function genBuilder(option: Option, api: IApi) {
  const absFont = join(api.cwd, option.fontPath);
  const absOutput = join(api.paths.absOutputPath!, option.outputDir);

  if (!existsSync(absFont)) {
    api.logger.error(`[font-slice] Font file not found: ${absFont}`);
    return;
  }

  // 确保输出目录存在
  if (!existsSync(absOutput)) {
    mkdirSync(absOutput, { recursive: true });
  }

  api.logger.info(`[font-slice] slicing font: ${option.fontPath}, outputDir: ${option.outputDir}, formats: ${option.formats}`);
  return await InternalFontSlice({
    ...option,
    fontPath: absFont,
    outputDir: absOutput,
    preview: false,
  })
}
