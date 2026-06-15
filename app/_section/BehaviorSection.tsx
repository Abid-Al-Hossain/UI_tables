"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Switch from "@/components/shared/input/Switch";
import type { TableState } from "../types";

type Props = { state: TableState; update: <K extends keyof TableState>(key: K, value: TableState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Selection" subtitle="Row selection and checkboxes.">
        <Switch label="Selectable rows" checked={state.selectable} onChange={(value) => update("selectable", value)} />
      </SectionCard>
      <SectionCard title="Sorting" subtitle="Column header sort controls.">
        <Switch label="Sortable columns" checked={state.sortable} onChange={(value) => update("sortable", value)} />
      </SectionCard>
      <SectionCard title="Filter" subtitle="Searchable row filter above the table.">
        <Switch label="Filterable" checked={state.filterable} onChange={(value) => update("filterable", value)} />
      </SectionCard>
      <SectionCard title="Layout" subtitle="Visual layout behavior.">
        <Switch label="Sticky header" checked={state.stickyHeader} onChange={(value) => update("stickyHeader", value)} />
        <Switch label="Zebra rows" checked={state.zebraRows} onChange={(value) => update("zebraRows", value)} />
      </SectionCard>
    </div>
  );
}
