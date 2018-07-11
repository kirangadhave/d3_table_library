import { DSVRowString, DSVParsedArray } from "d3";

export type d3Selection = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | d3.BaseType,
  any
>;

export type Table = DSVParsedArray<DSVRowString>;
export type DataPromise = Promise<Table>;
