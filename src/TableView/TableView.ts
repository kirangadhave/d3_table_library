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
    let [thead, tbody] = createTable(base);
    let searchBars = createHeader(thead, data.columns);
    createBody(tbody, data, data.columns);
    addSearch(searchBars, data, tbody, data.columns);
  });

  function createTable(base: d3Selection) {
    let table = base.append("table");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    return [thead, tbody];
  }

  function createHeader(head: d3Selection, columns: string[]): d3Selection {
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

    let searchBars = groups
      .append("input")
      .attr("class", "filter-box")
      .attr("type", "text")
      .attr("name", "textInput")
      .attr("placeholder", d => {
        return `Filter in ${d}`;
      });

    return searchBars;
  }

  function createBody(
    body: d3Selection,
    data: Table,
    columns: string[]
  ): d3Selection {
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

    return rows;
  }

  function addSearch(
    searchBars: d3Selection,
    data: Table,
    tbody: d3Selection,
    columns: string[]
  ) {
    searchBars.on("keyup", function(d, i) {
      let search_data = data;
      let search_text = d3
        .select(this)
        .property("value")
        .trim();

      let searchResults = search_data.map(t => t[d]).map(r => {
        let regex = new RegExp(`^.*${search_text}.*`, "i");
        if (regex.test(r)) return regex.exec(r)[0];
      });

      searchResults = searchResults.filter(r => r);

      let searched_data = searchResults.map(r => {
        return data.filter(p => {
          return p[d].indexOf(r) > -1;
        });
      });

      searched_data = [].concat.apply([], searched_data);

      console.log(searched_data);

      let rows = tbody.selectAll("tr").data(searched_data);
      rows.exit().remove();
      let cells = rows
        .enter()
        .append("tr")
        .merge(rows)
        .selectAll("td")
        .data(row => {
          return columns.map((col, i) => {
            return {
              name: col,
              val: row[col],
              idx: i
            };
          });
        });

      cells.exit().remove();

      cells
        .enter()
        .append("td")
        .merge(cells)
        .text(d => d.val);
    });
  }
}
