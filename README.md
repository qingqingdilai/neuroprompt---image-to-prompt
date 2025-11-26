<div align="center">
  <img width="1200" height="475" alt="NeuroPrompt banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.
View your app in AI Studio: https://aistudio.google.com/apps/drive/1a-ChjbQ9jT7tePE-JK02LjYkz7KyMHSj?fullscreenApplet=true&showPreview=true&showAssistant=true


# NeuroPrompt – Image to Prompt

NeuroPrompt 是一个使用 React + Vite 构建的逆向图像分析工具。它通过 Google Gemini 2.5 Flash Vision API 细致解析上传图片的主体、风格与关键视觉元素，并输出一段可直接用于 Midjourney、DALL·E 3、Stable Diffusion 等模型的高质量提示词。

## 主要特性
- 单页应用 (SPA)；零后端依赖，所有请求直接在前端调用 Gemini API。
- 图片拖拽 / 点击上传、实时预览以及一键清空。
- 分析时提供骨架状态，完成后展示提示词、艺术风格和元素标签。
- 按钮复制提示词到剪贴板，方便落地到任意 AIGC 平台。
- TypeScript 类型约束与响应式 Tailwind UI（通过 CDN 注入）。

## 技术栈
- **前端框架**：React 19 + TypeScript，使用 Vite 6 构建。
- **UI**：Tailwind CSS CDN 版本 + lucide-react 图标。
- **AI 服务**：`@google/genai` SDK，调用 `gemini-2.5-flash` 模型。

## 目录速览
- `App.tsx`：页面状态控制与布局，将子组件组合成完整体验。
- `components/Header.tsx`：顶部品牌栏。
- `components/UploadZone.tsx`：图片选择、拖拽、预览逻辑。
- `components/ResultCard.tsx`：提示词结果展示与复制。
- `services/geminiService.ts`：封装与 Gemini API 的交互。
- `types.ts`：`AnalysisResult`、`AppState`、`ImageFile` 等核心类型。
- `vite.config.ts`：载入 `.env.local` 并注入 `process.env.API_KEY`/`GEMINI_API_KEY`。

## 环境要求
- Node.js 18+（推荐 20）。
- Google AI Studio 中创建的 **Gemini API Key**，且开通了 `gemini-2.5-flash`（Vision）权限。

## 快速开始
1. **安装依赖**
   ```bash
   npm install
   ```
2. **配置密钥**  
   复制 `.env.local`（或新建）并写入：
   ```bash
   GEMINI_API_KEY=你的_API_Key
   ```
   `vite.config.ts` 会把该值注入到 `process.env.API_KEY` 与 `process.env.GEMINI_API_KEY`，供 `services/geminiService.ts` 使用。
3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 `http://localhost:3000`，页面默认监听 `0.0.0.0`，可在局域网共享。

## 使用流程
1. **上传图片**：点击或拖拽 JPG/PNG/WebP 文件到左侧区域，即可在本地生成预览。文件内容转换为 base64，供 Gemini Vision 读取。
2. **开始分析**：点击 “Generate Prompt”。`AppState` 切换为 `ANALYZING`，按钮与右侧骨架视图进入加载态。
3. **获取结果**：`services/geminiService.ts` 会：
   - 使用 `@google/genai` 创建客户端（读取 `process.env.API_KEY`）。
   - 调用 `gemini-2.5-flash`，发送图片 + 系统提示词，请求 JSON 响应。
   - 利用 `responseSchema` 强制输出 `{ prompt, elements[], style }`。
4. **查看 & 复制**：完成后右侧渲染 `ResultCard`，可复制提示词或查看艺术风格、关键元素标签。
5. **重新上传**：点击预览图中心的删除按钮即可重置，所有状态自动回到 `IDLE`。

## 运行脚本
- `npm run dev`：本地开发（Vite dev server）。
- `npm run build`：生产构建，生成 `dist/` 静态资源。
- `npm run preview`：在本地验证构建后的产物。

## 自定义与扩展
- **调整提示模板**：修改 `services/geminiService.ts` 中的 `promptText`，可强化特定风格或约束输出格式。
- **更换模型**：`generateContent` 的 `model` 字段改为其他 Vision 版本（确保帐号权限）。
- **扩展显示字段**：更新 `responseSchema` 和 `AnalysisResult` 接口，再在 `ResultCard.tsx` 渲染即可。
- **UI 样式**：Tailwind 由 CDN 注入，直接在组件中添加类即可；若需本地定制可在 Vite 中集成 PostCSS/Tailwind CLI。

## 部署指引
1. 执行 `npm run build` 产出静态文件。
2. 将 `dist/` 上传至任意静态托管（Vercel、Netlify、Cloudflare Pages 等）。
3. 在托管平台配置运行时环境变量 `GEMINI_API_KEY`；若需浏览器端直接使用，请确保密钥符合使用策略（可考虑代理层或基于 RAG 的 Token 限流）。

## 故障排查
- **提示 `API Key not found`**：确认 `.env.local` 存在且键名为 `GEMINI_API_KEY`，重启 dev server。
- **跨域或 403**：Gemini API 仅接受 HTTPS（生产）或 localhost 请求；确保密钥权限正常，且未超配额。
- **分析无结果/JSON 解析失败**：Gemini 可能返回格式化文本。可在 `geminiService.ts` 中捕获日志、放松 `responseSchema` 或增加重试机制。
- **大图上传缓慢**：浏览器需将文件转 base64，再传给 Gemini。建议控制图片在 4MB 以内以获得更快响应。

---

如需从 AI Studio 直接打开官方版本，可访问：[https://ai.studio/apps/drive/1a-ChjbQ9jT7tePE-JK02LjYkz7KyMHSj](https://ai.studio/apps/drive/1a-ChjbQ9jT7tePE-JK02LjYkz7KyMHSj)。
