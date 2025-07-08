export default {
    outputPath: 'dist-umi',
    plugins: [require.resolve('./src/index')],
    fontSlice: [{
        font: './src/assets/DINAlternate-Bold.ttf',
        output: 'sliced-fonts'
    }]
};