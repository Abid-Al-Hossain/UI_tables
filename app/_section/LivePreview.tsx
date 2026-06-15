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
    border: `${state.borderWidth}px ${state.borderStyle} ${state.disabled && state.disabledUseCustomColors ? state.disabledBorder : state.border}`,
    boxShadow: buildShadow(state),
    background: state.disabled && state.disabledUseCustomColors ? state.disabledBg : state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? state.disabledOpacity : 1,
    cursor: state.disabled ? state.disabledCursor : undefined,
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
      {state.filterable && (
        <input
          type="search"
          placeholder={`Filter ${state.title.toLowerCase()}…`}
          aria-label={`Filter ${state.ariaLabel}`}
          className="rounded-xl border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: state.border, color: state.foreground }}
          readOnly
        />
      )}
      <div className="overflow-auto rounded-2xl border" style={{ borderColor: state.border }} data-audit="table-preview" data-testid="table-preview">
        <style>{`#${state.id}-table tbody tr.tbl-row:hover { background: ${state.rowHoverBg} !important; color: ${state.rowHoverText} !important; }`}</style>
        <table
          id={`${state.id}-table`}
          aria-label={state.ariaLabel}
          aria-rowcount={rowTotal}
          aria-colcount={columnTotal}
          aria-busy={isLoading || undefined}
          style={{ width: "100%", minWidth: Math.max(state.width - state.padding * 2, columnTotal * 120), borderCollapse: "separate", borderSpacing: 0, captionSide: state.captionPosition }}
        >
          <caption className="text-left" style={{ padding: state.cellPadding, color: state.captionColor, fontSize: state.captionSize }}>{state.caption}</caption>
          <thead>
            <tr>
              {tableColumns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={state.sortable && index === 0 ? "ascending" : undefined}
                  className="relative text-left text-xs uppercase tracking-[0.14em]"
                  style={{
                    padding: state.cellPadding,
                    borderBottom: state.cellBorderStyle === "none" ? "none" : `1px ${state.cellBorderStyle} ${state.headerBorder}`,
                    color: state.headerText,
                    background: index === 0 ? state.pinnedColumnBg : state.headerBg,
                    position: index === 0 ? "sticky" : state.stickyHeader ? "sticky" : "static",
                    left: index === 0 ? 0 : undefined,
                    borderRight: index === 0 ? `1px solid ${state.pinnedColumnBorder}` : undefined,
                    top: 0,
                    zIndex: index === 0 ? 3 : state.stickyHeader ? 2 : "auto",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    {index === 0 ? <span aria-hidden="true" style={{ color: state.dragHandleColor, cursor: "grab", letterSpacing: "-2px" }}>⠿</span> : null}
                    {state.sortable && index === 0 ? (
                      <button type="button" className="inline-flex items-center gap-1 font-semibold" style={{ color: state.headerSortActiveColor }}>
                        {column.label}
                        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M2.5 6.5L5 9l2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    ) : state.sortable ? (
                      <span className="inline-flex items-center gap-1" style={{ color: state.headerSortColor }}>{column.label}<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4L5 1.5 7.5 4M2.5 6L5 8.5 7.5 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    ) : column.label}
                  </span>
                  {index < columnTotal - 1 ? <span aria-hidden="true" style={{ position: "absolute", top: 6, bottom: 6, right: 0, width: 2, background: state.resizeHandleColor, cursor: "col-resize", opacity: 0.6 }} /> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columnTotal} role="status" className="text-center text-sm" style={{ padding: state.cellPadding * 2, background: state.emptyStateBg, color: state.emptyStateText }}>Loading table rows...</td>
              </tr>
            ) : null}
            {isEmpty ? (
              <tr>
                <td colSpan={columnTotal} className="text-center text-sm" style={{ padding: state.cellPadding * 2, background: state.emptyStateBg, color: state.emptyStateText }}>No rows match the current table state.</td>
              </tr>
            ) : null}
            {!isLoading && !isEmpty ? tableRows.map((row, rowIndex) => {
              const cellBorder = state.cellBorderStyle === "none" ? "none" : `1px ${state.cellBorderStyle} ${state.cellBorderColor}`;
              const rowBg = row.selected ? state.rowSelectedBg : state.zebraRows ? (rowIndex % 2 === 1 ? state.zebraEvenBg : state.zebraOddBg) : "transparent";
              const rowColor = row.selected ? state.rowSelectedText : state.foreground;
              return (
              <tr key={row.key} className="tbl-row" aria-selected={state.selectable ? row.selected : undefined} style={{ background: rowBg, color: rowColor, boxShadow: row.selected ? `inset 2px 0 0 ${state.rowSelectedBorder}` : undefined, transition: state.transitionDuration > 0 ? "background 0.2s ease, color 0.2s ease" : "none" }}>
                {row.values.map((value, columnIndex) => columnIndex === 0 ? (
                  <th key={`${row.key}-${tableColumns[columnIndex].key}`} scope="row" className="text-left text-sm font-semibold" style={{ padding: state.cellPadding, borderBottom: cellBorder, color: "inherit", background: row.selected ? state.rowSelectedBg : state.pinnedColumnBg, position: "sticky", left: 0, borderRight: `1px solid ${state.pinnedColumnBorder}`, zIndex: 1 }}>
                    {state.selectable ? <input type="checkbox" checked={row.selected} readOnly aria-label={`Select ${row.label}`} className="mr-2 align-middle" style={{ accentColor: state.checkboxCheckedBg, borderColor: state.checkboxColor }} /> : null}
                    {value}
                  </th>
                ) : (
                  <td key={`${row.key}-${tableColumns[columnIndex].key}`} className="text-sm" style={{ padding: state.cellPadding, borderBottom: cellBorder, color: "inherit" }}>{value}</td>
                ))}
              </tr>
              );
            }) : null}
          </tbody>
          {!isLoading && !isEmpty ? (
            <tfoot>
              <tr>
                <td colSpan={columnTotal} className="text-left text-xs" style={{ padding: state.cellPadding, background: state.footerBg, color: state.footerText, borderTop: `1px solid ${state.footerBorder}` }}>
                  Showing {rowTotal} {rowTotal === 1 ? "row" : "rows"} across {columnTotal} columns.
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      <p id={`${state.id}-meta`} className="text-xs" style={{ color: state.muted }}>
        {state.helper} Rows: {rowTotal}. Columns: {columnTotal}. {state.stickyHeader ? "Sticky header enabled." : "Static header."} {state.zebraRows ? "Zebra rows enabled." : "Plain rows."}
      </p>
    </section>
  );
}
