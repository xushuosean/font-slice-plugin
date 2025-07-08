export default {
    outputPath: 'dist-umi',
    plugins: [require.resolve('./src/index')],
    fontSlice: [{
        fontPath: './src/assets/DINAlternate-Bold.ttf',
        outputDir: 'sliced-fonts'
    }]
};