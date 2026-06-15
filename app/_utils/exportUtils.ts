import type { TableState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: TableState, fileName = "tables"): ExportPayload {
  return { fileName: `${fileName || "tables"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: TableState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};
function resolveFont(s) { return s.fontBucket === "google" ? '"' + s.googleFontFamily + '", sans-serif' : "inherit"; }
function buildShadow(s) { if (!s.shadowEnabled) return "none"; var hex = Math.round(s.shadowOpacity * 255).toString(16).padStart(2, "0"); return s.shadowX + "px " + s.shadowY + "px " + s.shadowBlur + "px " + s.shadowSpread + "px " + s.shadowColor + hex; }


function panelStyle(config) {
  return {
    width: config.width,
    minHeight: config.height,
    padding: config.padding,
    borderRadius: config.radius,
    border: config.borderWidth + "px " + config.borderStyle + " " + (config.disabled && config.disabledUseCustomColors ? config.disabledBorder : config.border),
    boxShadow: "0 " + Math.round(config.shadow / 3) + "px " + config.shadow + "px rgba(0,0,0,.28)",
    background: config.background,
    color: config.foreground,
    fontFamily: config.fontFamily,
    opacity: config.disabled ? (config.disabledOpacity ?? 0.5) : 1,
cursor: config.disabled ? config.disabledCursor : undefined,
    display: "grid",
    gap: 16,
  };
}

function columns(config) {
  return Array.from({ length: Math.max(1, config.columnCount) }, (_, index) => ({
    key: "column-" + (index + 1),
    label: index === 0 ? config.label : "Metric " + (index + 1),
  }));
}

function rows(config) {
  const tableColumns = columns(config);

  return Array.from({ length: Math.max(1, config.rowCount) }, (_, rowIndex) => ({
    key: "row-" + (rowIndex + 1),
    label: "Row " + (rowIndex + 1),
    selected: config.selectable && (config.previewState === "selected" ? rowIndex === 0 : rowIndex === 1),
    values: tableColumns.map((column, columnIndex) => columnIndex === 0 ? config.label + " " + (rowIndex + 1) : ((rowIndex + 1) * (columnIndex + 2)) + "." + columnIndex + "k"),
  }));
}

export default function TableComponent() {
  const tableColumns = React.useMemo(() => columns(state), []);
  const tableRows = React.useMemo(() => rows(state), []);
  const isLoading = state.previewState === "loading";
  const isEmpty = state.previewState === "empty";
  const rowTotal = isEmpty ? 0 : tableRows.length;
  const columnTotal = tableColumns.length;

  return (
    <section id={state.id} aria-labelledby={state.id + "-title"} aria-describedby={state.id + "-meta"} style={panelStyle(state)}>
      <div style={{ display: "grid", gap: 4 }}>
        <h3 id={state.id + "-title"} style={{ fontSize: state.titleSize, fontWeight: state.fontWeight, margin: 0 }}>{state.title}</h3>
        <p style={{ color: state.muted, fontSize: state.bodySize, margin: 0 }}>{state.description}</p>
      </div>
      {state.filterable && (
        <input
          type="search"
          placeholder={\`Filter \${state.title.toLowerCase()}…\`}
          aria-label={\`Filter \${state.ariaLabel}\`}
          style={{ borderRadius: 12, border: "1px solid " + state.border, background: "transparent", padding: "8px 12px", color: state.foreground, fontSize: 14, outline: 0 }}
        />
      )}
      <div style={{ overflow: "auto", border: "1px solid " + state.border, borderRadius: 16 }} data-audit="table-preview" data-testid="table-preview">
        <style>{"#" + state.id + "-table tbody tr.tbl-row:hover { background: " + state.rowHoverBg + " !important; color: " + state.rowHoverText + " !important; }"}</style>
        <table
          id={state.id + "-table"}
          aria-label={state.ariaLabel}
          aria-rowcount={rowTotal}
          aria-colcount={columnTotal}
          aria-busy={isLoading || undefined}
          style={{ width: "100%", minWidth: Math.max(state.width - state.padding * 2, columnTotal * 120), borderCollapse: "separate", borderSpacing: 0, captionSide: state.captionPosition }}
        >
          <caption style={{ padding: state.cellPadding, textAlign: "left", color: state.captionColor, fontSize: state.captionSize }}>{state.caption}</caption>
          <thead>
            <tr>
              {tableColumns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={state.sortable && index === 0 ? "ascending" : undefined}
                  style={{
                    position: index === 0 ? "sticky" : state.stickyHeader ? "sticky" : "relative",
                    left: index === 0 ? 0 : undefined,
                    borderBottom: state.cellBorderStyle === "none" ? "none" : "1px " + state.cellBorderStyle + " " + state.headerBorder,
                    borderRight: index === 0 ? "1px solid " + state.pinnedColumnBorder : undefined,
                    color: state.headerText,
                    background: index === 0 ? state.pinnedColumnBg : state.headerBg,
                    top: 0,
                    zIndex: index === 0 ? 3 : state.stickyHeader ? 2 : "auto",
                    padding: state.cellPadding,
                    textAlign: "left",
                    fontSize: 12,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                  }}
                >
                  {index === 0 ? <span aria-hidden="true" style={{ marginRight: 8, color: state.dragHandleColor, cursor: "grab", letterSpacing: "-2px" }}>⠿</span> : null}
                  {state.sortable ? <span style={{ color: index === 0 ? state.headerSortActiveColor : state.headerSortColor, fontWeight: index === 0 ? 700 : 400 }}>{column.label} {index === 0 ? "↓" : "↕"}</span> : column.label}
                  {index < columnTotal - 1 ? <span aria-hidden="true" style={{ position: "absolute", top: 6, bottom: 6, right: 0, width: 2, background: state.resizeHandleColor, cursor: "col-resize", opacity: 0.6 }} /> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columnTotal} role="status" style={{ padding: state.cellPadding * 2, textAlign: "center", background: state.emptyStateBg, color: state.emptyStateText, fontSize: 14 }}>Loading table rows...</td>
              </tr>
            ) : null}
            {isEmpty ? (
              <tr>
                <td colSpan={columnTotal} style={{ padding: state.cellPadding * 2, textAlign: "center", background: state.emptyStateBg, color: state.emptyStateText, fontSize: 14 }}>No rows match the current table state.</td>
              </tr>
            ) : null}
            {!isLoading && !isEmpty ? tableRows.map((row, rowIndex) => {
              const cellBorder = state.cellBorderStyle === "none" ? "none" : "1px " + state.cellBorderStyle + " " + state.cellBorderColor;
              const rowBg = row.selected ? state.rowSelectedBg : state.zebraRows ? (rowIndex % 2 === 1 ? state.zebraEvenBg : state.zebraOddBg) : "transparent";
              const rowColor = row.selected ? state.rowSelectedText : state.foreground;
              return (
              <tr key={row.key} className="tbl-row" aria-selected={state.selectable ? row.selected : undefined} style={{ background: rowBg, color: rowColor, boxShadow: row.selected ? "inset 2px 0 0 " + state.rowSelectedBorder : undefined, transition: state.transitionDuration > 0 ? "all " + state.transitionDuration + "ms " + state.transitionEasing : "none" }}>
                {row.values.map((value, columnIndex) => columnIndex === 0 ? (
                  <th key={row.key + "-" + tableColumns[columnIndex].key} scope="row" style={{ position: "sticky", left: 0, borderBottom: cellBorder, borderRight: "1px solid " + state.pinnedColumnBorder, color: "inherit", background: row.selected ? state.rowSelectedBg : state.pinnedColumnBg, padding: state.cellPadding, textAlign: "left", fontSize: 14, fontWeight: 700, zIndex: 1 }}>
                    {state.selectable ? <input type="checkbox" checked={row.selected} readOnly aria-label={"Select " + row.label} style={{ marginRight: 8, verticalAlign: "middle", accentColor: state.checkboxCheckedBg, borderColor: state.checkboxColor }} /> : null}
                    {value}
                  </th>
                ) : (
                  <td key={row.key + "-" + tableColumns[columnIndex].key} style={{ borderBottom: cellBorder, color: "inherit", padding: state.cellPadding, fontSize: 14 }}>{value}</td>
                ))}
              </tr>
              );
            }) : null}
          </tbody>
          {!isLoading && !isEmpty ? (
            <tfoot>
              <tr>
                <td colSpan={columnTotal} style={{ padding: state.cellPadding, textAlign: "left", fontSize: 12, background: state.footerBg, color: state.footerText, borderTop: "1px solid " + state.footerBorder }}>Showing {rowTotal} {rowTotal === 1 ? "row" : "rows"} across {columnTotal} columns.</td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      <p id={state.id + "-meta"} style={{ color: state.muted, fontSize: 12, margin: 0 }}>
        {state.helper} Rows: {rowTotal}. Columns: {columnTotal}. {state.stickyHeader ? "Sticky header enabled." : "Static header."} {state.zebraRows ? "Zebra rows enabled." : "Plain rows."}
      </p>
    </section>
  );
}
`;
}
