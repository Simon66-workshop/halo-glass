# 66X Glass kit

给财务（或其他）前端用的玻璃层。不含流体、星云、演示舞台。

## 拷贝

```
kit/glass.css
kit/GlassCard.tsx
```

可选：`kit/FinanceExamples.tsx`（净资产 / KPI / 流水模板）。

## 接入

```tsx
import "./glass.css";
import { GlassCard, GlassInset, GlassPill } from "./GlassCard";
```

页面背后必须有图或深色渐变。玻璃贴在纯白底上会发灰。

```tsx
<main style={{ minHeight: "100dvh", background: "#070b14", padding: 24 }}>
  <GlassCard tone="dark">{/* 总资产 */}</GlassCard>
  <GlassCard tone="light">{/* 对账单、表格 */}</GlassCard>
</main>
```

| 财务块 | 组件 |
|---|---|
| 总资产 / 账户余额 | `GlassCard tone="dark"` |
| 对账单、表格 | `GlassCard tone="light"` |
| 涨跌、APY、分类 | `GlassInset` |
| 筛选 Tab | `GlassPill` |
| 转账按钮 | `.cta-gradient` |

## 还原合同

- `backdrop-filter: blur(22px) saturate(165%)`
- 圆角 `2rem`，描边 `1px solid rgb(255 255 255 / 0.48)`
- 祖先不要加 `transform` / `filter`，否则毛玻璃会扁
- 保留 `glass-read` + `type-legible`，数字才能压住背景
- 深浅两套：默认暗霜，对账单加 `tone-light`

任意框架都能用 `glass.css`。`GlassCard.tsx` 是 React；Vue / Svelte 按同样三层重写：外壳 + read + sheen + `z-index: 10` 内容。
