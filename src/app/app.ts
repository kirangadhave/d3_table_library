import { FileType } from "./../FileParser/FileType";
import "./styles.scss";
import * as d3 from "d3";
import { TableView } from "../TableView/TableView";

TableView(
  d3.select("#table"),
  "../../data/FL_insurance_sample.csv",
  FileType.CSV
);
