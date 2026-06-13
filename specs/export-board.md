## Context

craftisle-draw 是一个基于 Next.js + Excalidraw 的在线画板应用。用户经常需要导出画板为图片或 PDF 用于分享、文档嵌入或打印。当前项目已有 `exportPNG` 函数（`src/components/ExcalidrawEditor.tsx:53-62`），但未在 UI 中暴露，用户无法使用导出功能。

## Current State

- `src/components/ExcalidrawEditor.tsx:53-62`：已有 `exportPNG` 函数，使用 `excalidrawRef.current.exportToBlob()` API
- 该函数返回 blob，但未绑定到任何 UI 按钮
- 无 PDF 导出功能（需要添加）
- 无导出进度指示器
- 无导出格式选择（PNG/PDF）

## Proposed Change

在画板页面（`/board/[id]`）添加导出功能：

1. **添加导出按钮**：在画板右上角添加"导出"按钮
2. **支持 PNG 导出**：调用已有的 `exportPNG` 函数，下载 blob 为 `.png` 文件
3. **支持 PDF 导出**：使用 `jsPDF` 库将画布转换为 PDF
4. **添加格式选择**：用户可选择 PNG 或 PDF 格式
5. **添加导出进度指示器**：导出时显示加载状态

### Implementation Details

**文件修改：**

| File | Change |
|------|--------|
| `src/components/ExcalidrawEditor.tsx` | 1. 添加 `exportPDF` 函数<br>2. 暴露 `exportPNG` 和 `exportPDF` 给父组件 |
| `src/components/ExcalidrawEditorWrapper.tsx` | 添加导出按钮 UI 和格式选择 |
| `src/app/board/[id]/page.tsx` | 传递导出回调给编辑器组件 |
| `package.json` | 添加 `jspdf` 依赖 |

**API Shapes：**

```typescript
// src/components/ExcalidrawEditor.tsx
export interface ExportAPI {
  exportPNG: () => Promise<Blob>;
  exportPDF: () => Promise<Blob>;
}

// 暴露 API 给父组件
const onExcalidrawAPIReady = useCallback((api: any) => {
  excalidrawRef.current = api;
  if (onExportAPIReady) {
    onExportAPIReady({
      exportPNG: exportPNG,
      exportPDF: exportPDF,
    });
  }
}, [onExportAPIReady]);
```

## Acceptance Criteria

1. ✅ 用户在画板页面能看到"导出"按钮
2. ✅ 点击"导出"按钮显示格式选择（PNG/PDF）
3. ✅ 选择 PNG 后下载 `.png` 文件，文件包含完整画布内容
4. ✅ 选择 PDF 后下载 `.pdf` 文件，文件包含完整画布内容
5. ✅ 导出过程中显示进度指示器
6. ✅ 导出失败时显示错误提示
7. ✅ 所有现有功能不受影响

## Testing Plan

| Layer | What | Count |
|--------|-------|-------|
| Unit | `exportPNG` 和 `exportPDF` 函数 | +3 |
| Integration | 导出按钮点击 → 下载文件 | +2 |
| E2E | 完整导出流程（登录 → 打开画板 → 导出） | +2 |

## Rollback Plan

如果导出功能导致性能问题或崩溃：
1. Revert PR
2. 移除导出按钮
3. 保留 `exportPNG` 函数（不影响现有功能）

## Effort Estimate

- 2h：添加 `jsPDF` 依赖和 `exportPDF` 函数
- 3h：修改 UI 组件，添加导出按钮和格式选择
- 2h：添加进度指示器和错误处理
- 3h：编写测试和调试

## Files Reference

| File | Change |
|------|--------|
| `src/components/ExcalidrawEditor.tsx:53-62` | 已有 `exportPNG`，需添加 `exportPDF` |
| `src/components/ExcalidrawEditorWrapper.tsx` | 添加导出按钮 UI |
| `src/app/board/[id]/page.tsx` | 传递导出回调 |

## Out of Scope

- 批量导出多个画板
- 导出为 SVG 格式
- 自定义导出分辨率
- 导出为其他格式（JPG、WebP 等）

## Related

- 无相关 issue 或 PR
