# 网页内嵌工具 VSCode 插件

这是一个 VSCode/Cursor 插件，可以在 IDE 中内嵌网页，方便查看网页。

## 功能特性

- 在 VSCode 左侧活动栏中显示专用图标
- 在侧边栏中内嵌显示任意网页
- 支持自定义网页地址
- 提供工具栏进行网页导航和刷新

## 安装和使用

### 开发环境安装

1. 克隆或下载此项目到本地
2. 在项目目录中运行：

   ```bash
   npm install
   npm run compile
   ```

3. 在 VSCode 中打开项目文件夹
4. 按 `F5` 启动插件开发环境

### 使用方法

1. **打开内嵌网页**：

   - 点击左侧活动栏中的地球图标 🌐
   - 或使用命令面板 (`Ctrl+Shift+P` / `Cmd+Shift+P`) 输入 "打开内嵌网页"

2. **设置网页地址**：

   - 使用命令面板输入 "设置网页地址"
   - 输入你想要内嵌的网页 URL
   - 或直接在工具栏的地址栏中输入新网址

## 配置选项

在 VSCode 设置中可以配置：

- `webview-embed.defaultUrl`: 默认打开的网页地址

## 注意事项

- 某些网站可能因为安全策略（CORS）限制而无法在 iframe 中显示
- 建议使用支持 iframe 嵌入的网站
- 可以直接在网页中选择文本进行复制

## 开发

### 项目结构

```
├── src/
│   └── extension.ts    # 主要插件逻辑
├── package.json        # 插件配置和依赖
├── tsconfig.json      # TypeScript 配置
└── README.md          # 说明文档
```

### 构建命令

- `npm run compile`: 编译 TypeScript
- `npm run watch`: 监听文件变化并自动编译

## 许可证

MIT License
