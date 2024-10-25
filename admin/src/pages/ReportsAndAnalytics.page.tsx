import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { FileDown, Loader2 } from "lucide-react";

import {
  useGetStudentPerformanceReportQuery,
  useGetTeacherWorkloadReportQuery,
  useGetClassCapacityReportQuery,
} from "@/store/endpoints/reportEndpoints";
import { toast } from "sonner";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

interface ReportItem {
  [key: string]: string | number;
}

const reportTypes = [
  { value: "studentPerformance", label: "Student Performance" },
  { value: "teacherWorkload", label: "Teacher Workload" },
  { value: "classCapacity", label: "Class Capacity" },
];

export default function ReportsAndAnalytics() {
  const [reportType, setReportType] = useState<string>("studentPerformance");

  const {
    data: studentPerformanceData,
    isLoading: isLoadingStudentPerformance,
    isError: isErrorStudentPerformance,
  } = useGetStudentPerformanceReportQuery(undefined, {
    skip: reportType !== "studentPerformance",
  });

  const {
    data: teacherWorkloadData,
    isLoading: isLoadingTeacherWorkload,
    isError: isErrorTeacherWorkload,
  } = useGetTeacherWorkloadReportQuery(undefined, {
    skip: reportType !== "teacherWorkload",
  });

  const {
    data: classCapacityData,
    isLoading: isLoadingClassCapacity,
    isError: isErrorClassCapacity,
  } = useGetClassCapacityReportQuery(undefined, {
    skip: reportType !== "classCapacity",
  });

  const isLoading =
    isLoadingStudentPerformance ||
    isLoadingTeacherWorkload ||
    isLoadingClassCapacity;
  const isError =
    isErrorStudentPerformance || isErrorTeacherWorkload || isErrorClassCapacity;

  const reportData: ReportItem[] | null | undefined = (() => {
    switch (reportType) {
      case "studentPerformance":
        return studentPerformanceData;
      case "teacherWorkload":
        return teacherWorkloadData;
      case "classCapacity":
        return classCapacityData;
      default:
        return null;
    }
  })();

  const renderChart = () => {
    if (!reportData) return null;

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-background p-2 border rounded shadow-lg">
            <p className="font-semibold">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    switch (reportType) {
      case "studentPerformance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <XAxis dataKey="student" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="grade" fill="hsl(var(--primary))" name="Grade" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "teacherWorkload":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <XAxis dataKey="teacher" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="classes"
                fill="hsl(var(--secondary))"
                name="Classes"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "classCapacity":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="currentStudents"
                stroke="hsl(var(--primary))"
                name="Current Students"
              />
              <Line
                type="monotone"
                dataKey="maxCapacity"
                stroke="hsl(var(--secondary))"
                name="Max Capacity"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const exportToExcel = () => {
    if (!reportData) return;
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `${reportType}_report.xlsx`);
    toast("Report exported successfully");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (isError)
    return (
      <div className="text-destructive text-center p-4">
        Error loading report data. Please try again later.
      </div>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold">Reports and Analytics</h1>
        <p>View and analyze data across different metrics</p>
      </CardHeader>
      <CardBody>
        <div className="mb-6 space-y-2">
          <label
            htmlFor="report-type"
            className="text-sm font-medium text-muted-foreground"
          >
            Select Report Type
          </label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type" className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <h1 className="text-lg">
              {reportTypes.find((t) => t.value === reportType)?.label} Chart
            </h1>
          </CardHeader>
          <CardBody className="pt-0">{renderChart()}</CardBody>
        </Card>

        {reportData && (
          <Card>
            <CardHeader>
              <h1 className="text-lg">Data Table</h1>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(reportData[0]).map((key) => (
                        <TableHead key={key} className="font-semibold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((item, index) => (
                      <TableRow key={index}>
                        {Object.values(item).map((value, valueIndex) => (
                          <TableCell key={valueIndex}>
                            {value.toString()}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={exportToExcel}
            className="flex items-center space-x-2"
          >
            <FileDown className="h-4 w-4" />
            <span>Export to Excel</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
