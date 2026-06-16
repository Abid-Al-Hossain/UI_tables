"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { TableState } from "../types";

type Props = { state: TableState; update: <K extends keyof TableState>(key: K, value: TableState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Items controls for native table generation.">
      <div className="space-y-4"><Slider label="Rows" value={state.rowCount} min={1} max={12} step={1} onChange={(value) => update("rowCount", value)} />
<Slider label="Columns" value={state.columnCount} min={1} max={8} step={1} onChange={(value) => update("columnCount", value)} /></div>
    </SectionCard>;
}
