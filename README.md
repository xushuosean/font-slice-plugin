# UmiJS Font Slice Plugin

[![npm version](https://img.shields.io/npm/v/font-slice-umi-plugin)](https://www.npmjs.com/package/font-slice-umi-plugin)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

基于UmiJS的Web字体切片优化插件，通过动态子集化技术提升网页字体加载性能，支持WOFF/WOFF2格式。

## ✨ 特性
- 自动检测页面用字字符集
- 按需生成字体子集文件
- 支持多字体文件并行处理
- 智能缓存已生成的子集
- 生成优化后的CSS @font-face规则

## 📦 安装
```bash
yarn add font-slice-umi-plugin --dev
```

## 🚀 快速开始
```ts
// .umirc.ts
export default {
  plugins: [
    'font-slice-umi-plugin'
  ],
  fontSlice: {
    fonts: [
      {
        font: './src/assets/DINAlternate-Bold.woff2',
        output: 'public/fonts'
      }
    ]
  }
}
```

## ⚙️ 配置项
| 参数        | 类型     | 默认值          | 描述                  |
|------------|----------|----------------|-----------------------|
| font       | string   | -              | 字体文件路径（必填）    |
| output     | string   | 'sliced-fonts' | 切片文件输出目录        |
| formats    | string[] | ['woff2']      | 生成格式（支持woff/woff2）|

## 🎯 示例输出
```
public/
└── fonts/
    ├── din-alternate-bold-subset.woff2
    └── font.css
```

## 🔧 开发调试
```bash
# 监听模式
yarn build --watch

# 运行测试用例
yarn test
```

## 🤝 贡献指南
欢迎通过 [GitHub Issues](https://github.com/xushuosean/font-slice-umi-plugin/issues) 提交问题和建议

## 📄 许可证
ISC © [xushuosean](https://github.com/xushuosean)