import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Check, X } from "lucide-react";

interface ComparisonRow {
  id: string;
  type: "section" | "feature";
  label: string;
  values: string[];
  order: number;
}

interface ComparisonTableProps {
  headers: string[];
  rows: ComparisonRow[];
}

const ComparisonTable = ({ headers, rows }: ComparisonTableProps) => {
  const renderCellValue = (value: string) => {
    if (value === "check") {
      return <Check className="h-5 w-5 text-primary mx-auto" />;
    }
    if (value === "cross") {
      return <X className="h-5 w-5 text-muted-foreground mx-auto" />;
    }
    return <span className="text-foreground">{value}</span>;
  };

  const sortedRows = [...rows].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className={`${
                  index === 0 ? "text-left font-bold" : "text-center font-bold"
                } text-foreground sticky top-0 bg-secondary/50 backdrop-blur`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              className={`${
                row.type === "section"
                  ? "bg-secondary/30 font-semibold"
                  : rowIndex % 2 === 0
                  ? "bg-background"
                  : "bg-secondary/10"
              } hover:bg-secondary/20 transition-colors`}
            >
              <TableCell className="font-medium text-left">
                {row.label}
              </TableCell>
              {row.values.map((value, valueIndex) => (
                <TableCell key={valueIndex} className="text-center">
                  {row.type === "section" ? "" : renderCellValue(value)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComparisonTable;
