import createFontSlice from 'font-slice';

export type Option = Parameters<typeof createFontSlice>[0];

export const InternalFontSlice = async (options: Option) => {
  return await createFontSlice({
    ...options,
  });
}