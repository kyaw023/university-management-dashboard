import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  ChipProps,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { ChevronDownIcon } from "../components/icons/ChevronDownIcon";
import { SearchIcon } from "../components/icons/SearchIcon";
import { capitalize } from "./utils";
import { PlusIcon } from "../components/icons/PlusIcon";

import { useNavigate } from "react-router-dom";
import { Student } from "@/types/students.types";
import { TeacherType } from "@/types/teachers.type";
import { Course } from "@/types/classes.types";
import { SubjectType } from "@/types/subjects.types";
import FileImport from "@/components/FileImport";
import { ImportIcon } from "lucide-react";
import { Exam } from "@/types/exam.types";
import { Library } from "@/types/library.types";
import { Event } from "@/types/event.types";

type DataTypes =
  | Student
  | Course
  | TeacherType
  | SubjectType
  | Exam
  | Library
  | Event;

type DataTablePageProps<T extends DataTypes> = {
  data: T[];
  columns: Array<{ uid: string; name: string; sortable?: boolean }>;
  statusOptions: Array<{ uid: string; name: string }>;
  initialVisibleColumns: string[];
  statusColorMap: Record<string, ChipProps["color"]>;
  entityName: string;
  renderCell: (item: T, columnKey: React.Key) => JSX.Element;
  createLink: string;
  isLoading?: boolean;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  removeFile: () => void;
  importProgress: number;
  handleImport: () => void;
  importing: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  handlePageChange: (newPage: number) => void;
  total: number;
};

function DataTablePage<T extends DataTypes>({
  data,
  columns,
  statusOptions,
  initialVisibleColumns,
  renderCell,
  entityName,
  createLink,
  handleImport,
  importProgress,
  importing,
  error,
  file,
  removeFile,
  setFile,
  setError,
  page,
  setPage,
  setLimit,
  handlePageChange,
  total,
  isLoading,
}: DataTablePageProps<T extends DataTypes ? T : never>) {
  const INITIAL_VISIBLE_COLUMNS = initialVisibleColumns;
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    if (!data) return [];
    let filteredUsers = [...data];

    // Example type guard to check if the object has a 'name' property
    function hasNameProperty(obj: any): obj is { name: string } {
      return obj && typeof obj.name === "string";
    }

    // Example type guard to check if the object has a 'title' property
    function hasTitleProperty(obj: any): obj is { title: string } {
      return obj && typeof obj.title === "string";
    }

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        const searchString = filterValue.toLowerCase();

        if (hasNameProperty(user)) {
          return user.name.toLowerCase().includes(searchString);
        } else if (hasTitleProperty(user)) {
          return user.title.toLowerCase().includes(searchString);
        }

        return false; // If neither 'name' nor 'title' exists
      });
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length) {
      filteredUsers = filteredUsers.filter((user) => {
        // Check if user has a status property before filtering
        if ("status" in user) {
          return Array.from(statusFilter).includes(user.status);
        }
        return true; // If there's no status, include the item
      });
    }

    return filteredUsers;
  }, [data, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = React.useMemo(() => {
    const itemsToSort = filteredItems.length ? filteredItems : data;
    return [...itemsToSort].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T] as number;
      const second = b[sortDescriptor.column as keyof T] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data, filteredItems]);

  const onNextPage = React.useCallback(() => {
    if (page < total) {
      setPage(page + 1);
    }
  }, [page, total]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
      setLimit(Number(e.target.value));
    },

    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleNavigate = () => {
    navigate(createLink);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              onClick={handleNavigate}
              color="primary"
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
            <Button
              onClick={onOpen}
              color="primary"
              variant="bordered"
              className=" dark:text-gray-200 text-primary"
              endContent={<ImportIcon size={16} className=" dark:text-gray-200 text-primary" />}
            >
              Import
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data?.length} {entityName}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    data?.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={total}
          onChange={handlePageChange}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages == 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages == 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, data.length, page, pages, hasSearchFilter]);

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner />}
          loadingState={loadingState}
          emptyContent={`No ${entityName} found`}
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => {
                return <TableCell>{renderCell(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FileImport
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleImport={handleImport}
        file={file}
        setFile={setFile}
        error={error}
        setError={setError}
        removeFile={removeFile}
        importing={importing}
        importProgress={importProgress}
      />
    </>
  );
}

export default DataTablePage;
