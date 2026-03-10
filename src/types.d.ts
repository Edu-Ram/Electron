type Row = {
  id: number;
  name: string;
  mensaje: string;
};

type RowInput = {
  name: string;
  mensaje: string;
};

type ActionResult = {
  success: boolean;
  message: string;
};

type EventPayloadMapping = {
  getTableData: Row[];
  importDb: ActionResult;
  exportDb: ActionResult;
  createRow: ActionResult;
  updateRow: ActionResult;
  deleteRow: ActionResult;
};

interface Window {
  electron: {
    getTableData: () => Promise<Row[]>;
    importDb: () => Promise<ActionResult>;
    exportDb: () => Promise<ActionResult>;
    createRow: (row: RowInput) => Promise<ActionResult>;
    updateRow: (row: Row) => Promise<ActionResult>;
    deleteRow: (id: number) => Promise<ActionResult>;
  };
}