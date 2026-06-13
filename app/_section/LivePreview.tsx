"use client";

import type { CSSProperties } from "react";
import type { TableState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function shell(state: TableState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px ${state.borderStyle} ${state.border}`,
    boxShadow: buildShadow(state),
    background: state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? 0.55 : 1,
  };
}

function columns(state: TableState) {
  return Array.from({ length: Math.max(1, state.columnCount) }, (_, index) => ({
    key: `column-${index + 1}`,
    label: index === 0 ? state.label : `Metric ${index + 1}`,
  }));
}

function rows(state: TableState) {
  return Array.from({ length: Math.max(1, state.rowCount) }, (_, rowIndex) => ({
    key: `row-${rowIndex + 1}`,
    label: `Row ${rowIndex + 1}`,
    selected: state.selectable && (state.previewState === "selected" ? rowIndex === 0 : rowIndex === 1),
    values: columns(state).map((column, columnIndex) => columnIndex === 0 ? `${state.label} ${rowIndex + 1}` : `${(rowIndex + 1) * (columnIndex + 2)}.${columnIndex}k`),
  }));
}

export default function LivePreview({ state }: { state: TableState }) {
  const tableColumns = columns(state);
  const tableRows = rows(state);
  const isLoading = state.previewState === "loading";
  const isEmpty = state.previewState === "empty";
  const rowTotal = isEmpty ? 0 : tableRows.length;
  const columnTotal = tableColumns.length;

  return (
    <section id={state.id} aria-labelledby={`${state.id}-title`} aria-describedby={`${state.id}-meta`} style={shell(state)} className="grid gap-4">
      <div className="grid gap-1">
        <h3 id={`${state.id}-title`} style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h3>
        <p style={{ color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
      </div>
      <div className="overflow-auto rounded-2xl border" style={{ borderColor: state.border }} data-audit="table-preview" data-testid="table-preview">
        <table
          aria-label={state.ariaLabel}
          aria-rowcount={rowTotal}
          aria-colcount={columnTotal}
          aria-busy={isLoading || undefined}
          style={{ width: "100%", minWidth: Math.max(state.width - state.padding * 2, columnTotal * 120), borderCollapse: "separate", borderSpacing: 0 }}
        >
          <caption className="px-4 py-3 text-left text-sm" style={{ color: state.muted }}>{state.caption}</caption>
          <thead>
            <tr>
              {tableColumns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={state.sortable && index === 0 ? "ascending" : undefined}
                  className="border-b px-4 py-3 text-left text-xs uppercase tracking-[0.14em]"
                  style={{
                    borderColor: state.border,
                    color: state.muted,
                    background: state.stickyHeader ? state.background : "transparent",
                    position: state.stickyHeader ? "sticky" : "static",
                    top: 0,
                    zIndex: state.stickyHeader ? 1 : "auto",
                  }}
                >
                  {state.sortable && index === 0 ? <button type="button" className="font-semibold" style={{ color: state.accent }}>{column.label} asc</button> : column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columnTotal} role="status" className="px-4 py-8 text-center text-sm" style={{ color: state.muted }}>Loading table rows...</td>
              </tr>
            ) : null}
            {isEmpty ? (
              <tr>
                <td colSpan={columnTotal} className="px-4 py-8 text-center text-sm" style={{ color: state.muted }}>No rows match the current table state.</td>
              </tr>
            ) : null}
            {!isLoading && !isEmpty ? tableRows.map((row, rowIndex) => (
              <tr key={row.key} aria-selected={state.selectable ? row.selected : undefined} style={{ background: row.selected ? `color-mix(in oklab, ${state.accent} 20%, transparent)` : state.zebraRows && rowIndex % 2 === 1 ? "rgba(255,255,255,.05)" : "transparent", transition: state.transitionDuration > 0 ? "background 0.2s ease" : "none" }}>
                {row.values.map((value, columnIndex) => columnIndex === 0 ? (
                  <th key={`${row.key}-${tableColumns[columnIndex].key}`} scope="row" className="border-b px-4 py-3 text-left text-sm font-semibold" style={{ borderColor: state.border, color: state.foreground }}>
                    {state.selectable ? <input type="checkbox" checked={row.selected} readOnly aria-label={`Select ${row.label}`} className="mr-2 align-middle" /> : null}
                    {value}
                  </th>
                ) : (
                  <td key={`${row.key}-${tableColumns[columnIndex].key}`} className="border-b px-4 py-3 text-sm" style={{ borderColor: state.border, color: state.foreground }}>{value}</td>
                ))}
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
      <p id={`${state.id}-meta`} className="text-xs" style={{ color: state.muted }}>
        {state.helper} Rows: {rowTotal}. Columns: {columnTotal}. {state.stickyHeader ? "Sticky header enabled." : "Static header."} {state.zebraRows ? "Zebra rows enabled." : "Plain rows."}
      </p>
    </section>
  );
}
