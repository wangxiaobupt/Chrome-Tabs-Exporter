# Chrome Tabs Exporter

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**一键导出 Chrome 标签页到文本文件，支持按窗口分组**

[功能特点](#-功能特点) • [安装](#-安装) • [使用方法](#-使用方法) • [文件格式](#-文件格式) • [开发](#-开发)

</div>

## 📖 简介

Chrome Tabs Exporter 是一个轻量级的浏览器扩展，帮助你快速导出当前打开的所有标签页 URL 到文本文件。当你打开了大量重要网页但没有时间立即查看时，可以使用这个工具一键导出所有标签页，然后关闭浏览器释放内存。

## ✨ 功能特点

- 🚀 **一键导出** - 快速导出所有打开的标签页 URL
- 🪟 **窗口分组** - 按 Chrome 窗口分组显示，保持组织结构
- 📌 **固定标签页识别** - 区分固定标签页和普通标签页
- 🎯 **活动窗口标记** - 标识当前活动窗口
- ⏰ **时间戳文件名** - 自动生成带时间戳的文件名
- 🌍 **国际化支持** - 支持中文和特殊字符 URL
- 🔒 **安全过滤** - 自动过滤无效 URL（如 chrome:// 协议）
- 🎨 **简洁界面** - 极简的用户界面设计
- ⚡ **错误处理** - 完善的错误处理和用户反馈

## 🏗️ 架构

```
Chrome Tabs Exporter/
├── manifest.json          # 扩展配置文件 (Manifest V3)
├── popup.html             # 弹出窗口界面
├── popup.js               # 核心逻辑实现
├── icon16.svg             # 16x16 图标
├── icon48.svg             # 48x48 图标
├── icon128.svg            # 128x128 图标
└── README.md              # 项目文档
```

### 技术栈

- **平台**: Chrome Extension Manifest V3
- **语言**: 原生 JavaScript (ES6+)
- **UI**: HTML5 + CSS3
- **APIs**: Chrome Tabs API, Chrome Downloads API, Chrome Windows API

### 核心组件

1. **Popup UI** (`popup.html`) - 用户交互界面
2. **Tab Manager** (`popup.js`) - 标签页管理和导出逻辑
3. **File Generator** - 文件内容生成和格式化
4. **Error Handler** - 错误处理和用户反馈

## 📦 安装

### 方法一：开发者模式安装（推荐）

1. **下载项目**
   ```bash
   git clone https://github.com/wangxiaobupt/chrome-tabs-exporter.git
   cd chrome-tabs-exporter
   ```

2. **打开 Chrome 扩展管理页面**
   - 在地址栏输入：`chrome://extensions/`
   - 或者：Chrome 菜单 → 更多工具 → 扩展程序

3. **启用开发者模式**
   - 在页面右上角打开"开发者模式"开关

4. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹
   - 点击"选择文件夹"

5. **验证安装**
   - 扩展列表中出现"Chrome Tabs Exporter"
   - Chrome 工具栏显示扩展图标

### 图标转换（可选）

为了更好的兼容性，建议将 SVG 图标转换为 PNG 格式：

```bash
# 使用 ImageMagick
convert icon16.svg -resize 16x16 icon16.png
convert icon48.svg -resize 48x48 icon48.png
convert icon128.svg -resize 128x128 icon128.png

# 然后更新 manifest.json 中的图标引用
```

## 🚀 使用方法

### 基本操作

1. **打开扩展** - 点击工具栏中的扩展图标
2. **查看统计** - 弹出窗口显示当前标签页总数
3. **导出标签页** - 点击"导出标签页"按钮
4. **查看文件** - 在下载文件夹找到导出的文本文件

### 使用场景

- 📚 **研究项目** - 导出相关资料链接，按窗口主题分组
- 💼 **会议准备** - 导出需要展示的网页，保持窗口结构
- 🎓 **学习资料** - 导出教程和参考资料，便于按主题恢复
- 🔄 **多项目管理** - 每个窗口对应一个项目，导出时保持结构

## 📄 文件格式

导出的文本文件按窗口分组显示：

```
# Chrome Tabs Export (按窗口分组)
# Date: 2024-01-15T10:30:45.123Z
# Total Windows: 3
# Total Tabs: 30

## 窗口 1 (当前窗口) - 12 个标签页
# 固定标签页 (2 个)
https://mail.google.com
https://calendar.google.com

# 普通标签页 (10 个)
https://github.com/user/repo
https://stackoverflow.com/questions/12345
https://www.example.com

## 窗口 2 - 10 个标签页
# 普通标签页 (10 个)
https://www.google.com
https://www.youtube.com

## 窗口 3 - 8 个标签页
# 固定标签页 (1 个)
https://docs.google.com

# 普通标签页 (7 个)
https://www.wikipedia.org
```

### 格式说明

- 📝 **文件头** - 包含导出时间、窗口数量和标签页总数
- 🪟 **窗口分组** - 每个窗口单独分组，显示编号和标签页数量
- 🎯 **活动标记** - 当前活动窗口标记为"(当前窗口)"
- 📌 **标签页分类** - 固定标签页和普通标签页分别列出
- 🔗 **URL 过滤** - 仅包含 http:// 和 https:// 协议的 URL
- 🌍 **编码支持** - 使用 UTF-8 编码，支持国际字符

## 🛠️ 开发

### 项目结构

```javascript
// popup.js 核心函数
async function getAllWindowsAndTabs()     // 获取所有窗口和标签页
function generateExportContent(windows)   // 生成导出内容
async function exportTabs()               // 执行导出操作
function showMessage(text, type)          // 显示用户消息
```

### 权限说明

```json
{
  "permissions": [
    "tabs",      // 访问标签页信息
    "downloads"  // 下载文件到本地
  ]
}
```

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/wangxiaobupt/chrome-tabs-exporter.git
   cd chrome-tabs-exporter
   ```

2. **修改代码**
   - 编辑 `popup.js` 修改核心逻辑
   - 编辑 `popup.html` 修改界面
   - 编辑 `manifest.json` 修改配置

3. **测试扩展**
   - 在 Chrome 扩展管理页面点击"重新加载"
   - 测试功能是否正常工作

4. **调试**
   - 右键扩展图标 → "检查弹出窗口"
   - 查看控制台输出和错误信息

## 🐛 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 扩展图标不显示 | 图标文件缺失或格式不支持 | 检查图标文件，建议使用 PNG 格式 |
| 权限错误 | Chrome API 访问被拒绝 | 重新加载扩展或重启浏览器 |
| 导出失败 | 下载权限或磁盘空间问题 | 检查下载文件夹权限和磁盘空间 |
| 弹出窗口不显示 | popup.html 或 popup.js 文件问题 | 检查文件完整性，查看控制台错误 |

### 调试技巧

- 🔍 **控制台调试** - 右键扩展图标 → "检查弹出窗口"
- 📊 **详细日志** - 代码中包含详细的 `debugLog` 输出
- 🔄 **重新加载** - 修改代码后记得重新加载扩展
- 🧪 **测试环境** - 使用多个窗口和标签页测试各种场景

## 📊 技术规格

- **浏览器支持**: Chrome (Manifest V3)
- **文件格式**: UTF-8 编码的纯文本文件 (.txt)
- **支持协议**: http://, https://
- **最大标签页数**: 无限制（受浏览器内存限制）
- **文件命名**: `tabs_YYYY-MM-DD_HH-MM-SS.txt`

## 🔒 隐私保护

- ✅ **本地处理** - 所有数据处理都在本地进行
- ✅ **无数据传输** - 不向任何外部服务器发送数据
- ✅ **无信息收集** - 不收集或存储用户个人信息
- ✅ **最小权限** - 仅请求必要的浏览器权限
- ✅ **透明开源** - 代码完全开源，可审查

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发指南

- 📝 **代码风格** - 使用 ES6+ 语法，保持代码简洁
- 🧪 **测试** - 在多种场景下测试功能
- 📚 **文档** - 更新相关文档和注释
- 🐛 **问题报告** - 使用 GitHub Issues 报告 bug

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Chrome Extensions API 文档
- 开源社区的支持和反馈
- 所有贡献者和用户

## 📞 联系方式

- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/wangxiaobupt/chrome-tabs-exporter/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/wangxiaobupt/chrome-tabs-exporter/discussions)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

Made with ❤️ by [WangXiaoBupt](https://github.com/wangxiaobupt)

</div>
