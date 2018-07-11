import { FileType } from "./FileType";
import { DataPromise } from "../Utils/types";
import { DSVParsedArray, DSVRowString } from "d3";
import * as d3 from "d3";

let ParseFormat: {
  [key: string]: (file: string, type?: FileType) => DataPromise;
} = {};

ParseFormat[FileType.CSV] = ParseDSV;

export function ParseDSV(
  file: string,
  type: FileType = FileType.CSV
): DataPromise {
  switch (type) {
    case FileType.CSV:
    default:
      return d3.dsv(",", file);
  }
}

export function ParseJSON(file: string): DataPromise {
  return null;
}

export function Parser(file: string, type: FileType): DataPromise {
  if (type === FileType.JSON) return ParseJSON(file);
  return ParseFormat[type](file, type);
}
