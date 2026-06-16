"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { TableState } from "../types";

type Props = { state: TableState; update: <K extends keyof TableState>(key: K, value: TableState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Base container colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Active Item" subtitle="Selected or hovered item highlight.">
        <ColorControl label="Active background" value={state.itemActiveBg} onChange={(v) => update("itemActiveBg", v)} />
      </SectionCard>
      <SectionCard title="Header" subtitle="Column header row and sorting.">
      <div className="space-y-4">
        <ColorControl label="Header background" value={state.headerBg} onChange={(v) => update("headerBg", v)} />
        <ColorControl label="Header text" value={state.headerText} onChange={(v) => update("headerText", v)} />
        <ColorControl label="Header border" value={state.headerBorder} onChange={(v) => update("headerBorder", v)} />
        <ColorControl label="Sort icon" value={state.headerSortColor} onChange={(v) => update("headerSortColor", v)} />
        <ColorControl label="Sort active" value={state.headerSortActiveColor} onChange={(v) => update("headerSortActiveColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Rows" subtitle="Hover, selection, and zebra striping.">
      <div className="space-y-4">
        <ColorControl label="Row hover background" value={state.rowHoverBg} onChange={(v) => update("rowHoverBg", v)} />
        <ColorControl label="Row hover text" value={state.rowHoverText} onChange={(v) => update("rowHoverText", v)} />
        <ColorControl label="Selected background" value={state.rowSelectedBg} onChange={(v) => update("rowSelectedBg", v)} />
        <ColorControl label="Selected text" value={state.rowSelectedText} onChange={(v) => update("rowSelectedText", v)} />
        <ColorControl label="Selected border" value={state.rowSelectedBorder} onChange={(v) => update("rowSelectedBorder", v)} />
        <ColorControl label="Zebra odd" value={state.zebraOddBg} onChange={(v) => update("zebraOddBg", v)} />
        <ColorControl label="Zebra even" value={state.zebraEvenBg} onChange={(v) => update("zebraEvenBg", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Cells, footer & pinned" subtitle="Cell borders, footer, empty state, pinned column.">
      <div className="space-y-4">
        <ColorControl label="Cell border" value={state.cellBorderColor} onChange={(v) => update("cellBorderColor", v)} />
        <ColorControl label="Footer background" value={state.footerBg} onChange={(v) => update("footerBg", v)} />
        <ColorControl label="Footer text" value={state.footerText} onChange={(v) => update("footerText", v)} />
        <ColorControl label="Footer border" value={state.footerBorder} onChange={(v) => update("footerBorder", v)} />
        <ColorControl label="Empty background" value={state.emptyStateBg} onChange={(v) => update("emptyStateBg", v)} />
        <ColorControl label="Empty text" value={state.emptyStateText} onChange={(v) => update("emptyStateText", v)} />
        <ColorControl label="Caption" value={state.captionColor} onChange={(v) => update("captionColor", v)} />
        <ColorControl label="Checkbox" value={state.checkboxColor} onChange={(v) => update("checkboxColor", v)} />
        <ColorControl label="Checkbox checked" value={state.checkboxCheckedBg} onChange={(v) => update("checkboxCheckedBg", v)} />
        <ColorControl label="Resize handle" value={state.resizeHandleColor} onChange={(v) => update("resizeHandleColor", v)} />
        <ColorControl label="Drag handle" value={state.dragHandleColor} onChange={(v) => update("dragHandleColor", v)} />
        <ColorControl label="Pinned column bg" value={state.pinnedColumnBg} onChange={(v) => update("pinnedColumnBg", v)} />
        <ColorControl label="Pinned column border" value={state.pinnedColumnBorder} onChange={(v) => update("pinnedColumnBorder", v)} />
      </div>
    </SectionCard>
    </div>
  );
}
