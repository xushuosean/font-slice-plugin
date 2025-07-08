import createFontSlice from 'font-slice';

export const InternalFontSlice = async (fontPath: string, outputPath: string) => {
  return await createFontSlice({
    fontPath,
    outputDir: outputPath,
    preview: false,
  });
}