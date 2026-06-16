"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import { SegmentedControl } from "@/components/shared/input/SegmentedControl";
import type { TableState } from "../types";

type Props = { state: TableState; update: <K extends keyof TableState>(key: K, value: TableState[K]) => void };

export default function SizingSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Sizing" subtitle="Sizing controls for native table generation.">
      <div className="space-y-4">
        <Slider label="Width" value={state.width} min={220} max={900} step={1} onChange={(value) => update("width", value)} />
        <Slider label="Height" value={state.height} min={120} max={720} step={1} onChange={(value) => update("height", value)} />
        <Slider label="Gap" value={state.gap} min={0} max={48} step={1} onChange={(value) => update("gap", value)} />
        <Slider label="Padding" value={state.padding} min={8} max={64} step={1} onChange={(value) => update("padding", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Cells & caption" subtitle="Cell padding, borders, and caption.">
      <div className="space-y-4">
        <Slider label="Cell padding" value={state.cellPadding} min={4} max={28} step={1} onChange={(value) => update("cellPadding", value)} />
        <Slider label="Caption size" value={state.captionSize} min={10} max={20} step={1} onChange={(value) => update("captionSize", value)} />
        <SegmentedControl
          label="Cell border style"
          value={state.cellBorderStyle}
          options={[{ label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "None", value: "none" }]}
          onChange={(value) => update("cellBorderStyle", value as TableState["cellBorderStyle"])}
        />
        <SegmentedControl
          label="Caption position"
          value={state.captionPosition}
          options={[{ label: "Top", value: "top" }, { label: "Bottom", value: "bottom" }]}
          onChange={(value) => update("captionPosition", value as TableState["captionPosition"])}
        />
      </div>
    </SectionCard>
    </div>
  );
}
