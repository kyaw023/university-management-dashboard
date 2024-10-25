import React, { useState } from "react";
import {
  Chip,
  ChipProps,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { columns, statusOptions } from "../../data/classData";
import { capitalize } from "../utils";

import { Link, useNavigate } from "react-router-dom";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";

import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import {
  useDeleteClassMutation,
  useGetAllClassesQuery,
  useImportClassMutation,
} from "@/store/endpoints/classEndpoints";
import { toast } from "sonner";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { renderClassSkeletonCell } from "@/components/SkeletonTable";
import { Course } from "@/types/classes.types";
import DataTablePage from "../DataTable.page";
import DataFetchErrorPage from "../DataFetchError.page";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "status",
  "max_students",
  "classroom",
  "actions",
];

export default function ClassPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: users,
    isLoading: classLoading,
    isFetching,
    isError,
    error: classError,
  } = useGetAllClassesQuery({
    page,
    limit,
  });

  const [classToDelete, setClassToDelete] = useState<Course | null>(null);
  const [deleteClass, { isLoading }] = useDeleteClassMutation();
  const navigate = useNavigate();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importClass] = useImportClassMutation();

  const removeFile = () => {
    setFile(null);
    setError(null);
    setImportProgress(0);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setImporting(true);

    const response = await importClass(formData).unwrap();

    setImporting(false);
    if (!response) {
      throw new Error("Import failed");
    }

    if (response.progress) {
      setImportProgress(response.progress);

      if (response.progress === 100) {
        toast.success("Students imported successfully");
      }
    }

    onOpenChange();
    removeFile();
  };

  const handleDeleteClick = (student: Course) => {
    setClassToDelete(student);
    onOpen();
  };

  const deleteClassHandler = async () => {
    if (classToDelete) {
      console.log(classToDelete._id);
      const response = await deleteClass(classToDelete._id as string);

      setClassToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/classes?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  const renderCell = React.useCallback(
    (user: Course, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Course];

      switch (columnKey) {
        case "name":
          return <p>{user.name}</p>;

        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="flat"
            >
              {capitalize(user.status)}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/classes/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit user">
                <Link to={`/classes/edit-class/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  onClick={() => handleDeleteClick(user)}
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );

        default: {
          // Render other columns as-is
          if (cellValue === null || cellValue === undefined) {
            return <span>N/A</span>; // Display "N/A" for null or undefined values
          }

          // Ensure string or number values are wrapped in a span
          if (typeof cellValue === "string" || typeof cellValue === "number") {
            return <span>{String(cellValue)}</span>; // Wrap in a span for consistency
          }

          // If cellValue is an object, render its properties in a structured way
          if (typeof cellValue === "object") {
            return (
              <div>
                {Object.entries(cellValue).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{String(value)}</span> {/* Convert value to string */}
                  </div>
                ))}
              </div>
            );
          }

          // Fallback to rendering the value as a string
          return <span>{String(cellValue)}</span>;
        }
      }
    },
    [statusColorMap]
  );

  if (classLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <DataFetchErrorPage error={classError} isNotFound />;
  }

  return (
    <div>
      <BreadcrumbsComponent links={[{ name: "Classes", path: "/classes" }]} />
      <DataTablePage
        page={page}
        setLimit={setLimit}
        setPage={setPage}
        handlePageChange={handlePageChange}
        total={users?.totalPages as number}
        data={users?.classes as Course[]}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        columns={columns}
        renderCell={(user, columnKey) =>
          isFetching
            ? renderClassSkeletonCell(columnKey)
            : renderCell(user, columnKey)
        }
        isLoading={isLoading}
        statusOptions={statusOptions}
        entityName="Class"
        statusColorMap={statusColorMap}
        createLink="/classes/form"
        removeFile={removeFile}
        file={file}
        setFile={setFile}
        error={error}
        setError={setError}
        handleImport={handleImport}
        importProgress={importProgress}
        importing={importing}
      />
      <DeleteAccountModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onDelete={deleteClassHandler}
        isLoading={isLoading}
        studentName={classToDelete?.name || ""}
      />
    </div>
  );
}
