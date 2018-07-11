export type TableConfiguration = {
  columnsToShow: string[];
};

export function TableConfig(): TableConfiguration {
  return {
    columnsToShow: []
  };
}
