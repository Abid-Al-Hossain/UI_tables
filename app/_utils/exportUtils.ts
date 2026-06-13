import type { TableState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: TableState, fileName = "tables"): ExportPayload {
  return { fileName: `${fileName || "tables"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: TableState) {
  return `import * as React from "react";

const state = ${JSON.stringify(state, null, 2)};

function panelStyle(config) {
  return {
    width: config.width,
    minHeight: config.height,
    padding: config.padding,
    borderRadius: config.radius,
    border: config.borderWidth + "px solid " + config.border,
    boxShadow: "0 " + Math.round(config.shadow / 3) + "px " + config.shadow + "px rgba(0,0,0,.28)",
    background: config.background,
    color: config.foreground,
    fontFamily: config.fontFamily,
    opacity: config.disabled ? 0.55 : 1,
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
      <div style={{ overflow: "auto", border: "1px solid " + state.border, borderRadius: 16 }} data-audit="table-preview" data-testid="table-preview">
        <table
          aria-label={state.ariaLabel}
          aria-rowcount={rowTotal}
          aria-colcount={columnTotal}
          aria-busy={isLoading || undefined}
          style={{ width: "100%", minWidth: Math.max(state.width - state.padding * 2, columnTotal * 120), borderCollapse: "separate", borderSpacing: 0 }}
        >
          <caption style={{ padding: "12px 16px", textAlign: "left", color: state.muted, fontSize: 14 }}>{state.caption}</caption>
          <thead>
            <tr>
              {tableColumns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={state.sortable && index === 0 ? "ascending" : undefined}
                  style={{
                    borderBottom: "1px solid " + state.border,
                    color: state.muted,
                    background: state.stickyHeader ? state.background : "transparent",
                    position: state.stickyHeader ? "sticky" : "static",
                    top: 0,
                    zIndex: state.stickyHeader ? 1 : "auto",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 12,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                  }}
                >
                  {state.sortable && index === 0 ? <button type="button" style={{ color: state.accent, fontWeight: 700, background: "transparent", border: 0, padding: 0 }}>{column.label} asc</button> : column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columnTotal} role="status" style={{ padding: "32px 16px", textAlign: "center", color: state.muted, fontSize: 14 }}>Loading table rows...</td>
              </tr>
            ) : null}
            {isEmpty ? (
              <tr>
                <td colSpan={columnTotal} style={{ padding: "32px 16px", textAlign: "center", color: state.muted, fontSize: 14 }}>No rows match the current table state.</td>
              </tr>
            ) : null}
            {!isLoading && !isEmpty ? tableRows.map((row, rowIndex) => (
              <tr key={row.key} aria-selected={state.selectable ? row.selected : undefined} style={{ background: row.selected ? "color-mix(in oklab, " + state.accent + " 20%, transparent)" : state.zebraRows && rowIndex % 2 === 1 ? "rgba(255,255,255,.05)" : "transparent", transition: state.transitionDuration > 0 ? "$1" : "none" }}>
                {row.values.map((value, columnIndex) => columnIndex === 0 ? (
                  <th key={row.key + "-" + tableColumns[columnIndex].key} scope="row" style={{ borderBottom: "1px solid " + state.border, color: state.foreground, padding: "12px 16px", textAlign: "left", fontSize: 14, fontWeight: 700 }}>
                    {state.selectable ? <input type="checkbox" checked={row.selected} readOnly aria-label={"Select " + row.label} style={{ marginRight: 8, verticalAlign: "middle" }} /> : null}
                    {value}
                  </th>
                ) : (
                  <td key={row.key + "-" + tableColumns[columnIndex].key} style={{ borderBottom: "1px solid " + state.border, color: state.foreground, padding: "12px 16px", fontSize: 14 }}>{value}</td>
                ))}
              </tr>
            )) : null}
          </tbody>
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
