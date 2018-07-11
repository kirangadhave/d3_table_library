import { d3Selection, Table } from "./../Utils/types";
import { TableConfiguration, TableConfig } from "./TableConfig";
import { FileType } from "./../FileParser/FileType";
import { Parser } from "../FileParser/Parser";
import "./styles.scss";
import * as d3 from "d3";

export function TableView(
  base: d3Selection,
  file: string,
  type: FileType,
  config?: TableConfiguration
) {
  if (!config) config = TableConfig();
  Parser(file, type).then(data => {
    let [table, thead, tbody] = createTable(base);
    let widths = createHeader(thead, data.columns);
    createBody(tbody, data, data.columns);
    let table2 = base.html();
  });

  function createTable(base: d3Selection) {
    let table = base.append("table");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    return [table, thead, tbody];
  }

  function createHeader(head: d3Selection, columns: string[]) {
    let cols = head
      .append("tr")
      .selectAll("th")
      .data(columns);

    cols.exit().remove();

    let groups = cols
      .enter()
      .append("th")
      .merge(cols);

    groups
      .append("div")
      .attr("class", "header")
      .text(d => {
        return d;
      });

    groups
      .append("input")
      .attr("class", "filter-box")
      .attr("type", "text")
      .attr("name", "textInput")
      .attr("placeholder", d => {
        return `Filter in ${d}`;
      });
    let widths: any[] = [];
    groups.each(function() {
      widths.push((this as any).getBoundingClientRect().width - 12);
    });
    return widths;
  }

  function createBody(body: d3Selection, data: Table, columns: string[]) {
    let _rows = body.selectAll("tr").data(data);
    _rows.exit().remove();
    let rows = _rows
      .enter()
      .append("tr")
      .merge(_rows);

    let _cells = rows.selectAll("td").data(row => {
      return columns.map((col, i) => {
        return {
          name: col,
          val: row[col],
          idx: i
        };
      });
    });

    _cells.exit().remove();
    let cells = _cells
      .enter()
      .append("td")
      .merge(_cells);

    cells.text(d => d.val);
  }
}
