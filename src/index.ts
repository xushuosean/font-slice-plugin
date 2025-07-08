import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { IApi } from 'umi';
import { InternalFontSlice } from './InternalFontSlice';

export default (api: IApi) => {
  api.describe({
    key: 'fontSlice',
    config: {
      schema(joi) {
        return joi.alternatives().try(
          joi.object({
            font: joi.string().required(),
            output: joi.string().default('font-slice')
          }),
          joi.array().items(
            joi.object({
              font: joi.string().required(),
              output: joi.string().default('font-slice')
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
        return genBuilder(item.font, item.output, api);
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

async function genBuilder(font: string, output: string, api: IApi) {
    const absFont = join(api.cwd, font);
    const absOutput = join(api.paths.absOutputPath!, output);

    if (!existsSync(absFont)) {
      api.logger.error(`[font-slice] Font file not found: ${absFont}`);
      return;
    }

    // 确保输出目录存在
    if (!existsSync(absOutput)) {
      mkdirSync(absOutput, { recursive: true });
    }

    api.logger.info(`[font-slice] slicing font: ${font}`);
    return await InternalFontSlice(absFont, absOutput)
}
