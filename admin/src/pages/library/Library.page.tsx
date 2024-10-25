import React, { useState } from "react";
import { Tooltip, useDisclosure, ChipProps } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import DataTablePage from "../DataTable.page";
import { toast } from "sonner";

import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { renderStudentSkeletonCell } from "@/components/SkeletonTable";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import DataFetchErrorPage from "../DataFetchError.page";
import {
  useDeleteLibraryMutation,
  useGetAllLibraryQuery,
  useImportLibraryMutation,
} from "@/store/endpoints/LibraryEndpoints";
import { Library } from "@/types/library.types";
import { availabilityStatusOptions, libraryColumns } from "@/data/libraryData";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "type",
  "category",
  "availability_status",
  "location",
  "actions",
];

export default function LibraryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: users,
    isLoading: libraryLoading,
    isFetching,
    isError,
    error: libraryError,
  } = useGetAllLibraryQuery({ page, limit, search: "" });

  const [deleteLibrary, { isLoading }] = useDeleteLibraryMutation();

  const [libraryToDelete, setLibraryToDelete] = useState<Library | null>(null);

  const [importLibrary] = useImportLibraryMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const navigate = useNavigate();

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

    const response = await importLibrary(formData).unwrap();

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

  const handleDeleteClick = (exam: any) => {
    setLibraryToDelete(exam);
    onOpen();
  };

  const deleteLibraryHandler = async () => {
    if (libraryToDelete) {
      const response = await deleteLibrary(libraryToDelete._id as any);
      setLibraryToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const renderCell = React.useCallback(
    (user: Library, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Library];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/library/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit User">
                <Link to={`/library/edit-form/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <button
                  onClick={() => {
                    onOpen();
                    handleDeleteClick(user);
                  }}
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                  <DeleteIcon />
                </button>
              </Tooltip>
            </div>
          );

        default: {
          if (cellValue === null || cellValue === undefined) {
            return <span>N/A</span>;
          }

          if (typeof cellValue === "string" || typeof cellValue === "number") {
            return <span>{String(cellValue)}</span>;
          }

          if (typeof cellValue === "object") {
            return (
              <div>
                {Object.entries(cellValue).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            );
          }

          return <span>{String(cellValue)}</span>;
        }
      }
    },
    [statusColorMap]
  );

  const handlePageChange = (newPage: number) => {
    navigate(`/library?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  if (libraryLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DataFetchErrorPage error={libraryError} />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbsComponent links={[{ name: "Library", path: "/library" }]} />

      <DataTablePage
        data={users?.libraries as Library[]}
        handlePageChange={handlePageChange}
        setLimit={setLimit}
        renderCell={(user, columnKey) =>
          isFetching
            ? renderStudentSkeletonCell(columnKey)
            : renderCell(user, columnKey)
        }
        total={users?.totalPages as number}
        statusOptions={availabilityStatusOptions}
        statusColorMap={statusColorMap}
        entityName="Library"
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        columns={libraryColumns}
        createLink="/library/form"
        isLoading={isLoading}
        handleImport={handleImport}
        importProgress={importProgress}
        importing={importing}
        file={file}
        setFile={setFile}
        removeFile={removeFile}
        setError={setError}
        error={error}
        page={page}
        setPage={setPage}
      />

      <DeleteAccountModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onDelete={deleteLibraryHandler}
        isLoading={isLoading}
        studentName={libraryToDelete?.name || ""}
      />
    </>
  );
}
