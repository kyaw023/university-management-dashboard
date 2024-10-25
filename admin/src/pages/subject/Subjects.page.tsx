import DataTablePage from "../DataTable.page";
import { columns } from "@/data/SubjectData";
import { ChipProps, Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import {
  useDeleteSubjectMutation,
  useGetAllSubjectsQuery,
  useImportSubjectMutation,
} from "@/store/endpoints/subjectEndpoints";
import { toast } from "sonner";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { SubjectType } from "@/types/subjects.types";
import DataFetchErrorPage from "../DataFetchError.page";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "code",
  "description",
  "department",
  "actions",
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Completed", uid: "completed" },
];

const SubjectsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const {
    data,
    isError,
    error: subjectError,
    isLoading: subjectLoading,
  } = useGetAllSubjectsQuery({ page, limit });
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectType | null>(
    null
  );

  const navigate = useNavigate();

  const [deleteClass, { isLoading }] = useDeleteSubjectMutation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importSubject] = useImportSubjectMutation();

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

    try {
      const response = await importSubject(formData).unwrap();

      console.log(response);

      if (response.progress) {
        setImportProgress(response.progress);

        if (response.progress === 100) {
          toast.success("Students imported successfully");
          onOpenChange();
          removeFile();
        }
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Import failed. Please try again.");
      setError("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteClick = (subject: SubjectType) => {
    setSubjectToDelete(subject);
    onOpen();
  };

  const deleteSubjectHandler = async () => {
    if (subjectToDelete) {
      console.log(subjectToDelete._id);
      const response = await deleteClass(subjectToDelete._id as string);

      setSubjectToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/subjects?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  const renderCell = React.useCallback(
    (user: SubjectType, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof SubjectType];

      switch (columnKey) {
        case "name":
          return <p>{user.name}</p>;

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/subjects/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit user">
                <Link to={`/subjects/edit-subject/${user && user?._id}`}>
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

          // Check if cellValue is a string or a number
          if (typeof cellValue === "string" || typeof cellValue === "number") {
            return <span>{String(cellValue)}</span>; // Wrap in a span
          }

          // If cellValue is an array, render it as a list
          if (Array.isArray(cellValue)) {
            return (
              <ul className="list-disc pl-5">
                {cellValue.map((item, index) => (
                  <li key={index}>{String(item)}</li> // Ensure item is a string
                ))}
              </ul>
            );
          }

          // If cellValue is an object, render its properties in a structured way
          if (typeof cellValue === "object") {
            return (
              <div>
                {Object.entries(cellValue).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <strong>{key}:</strong>
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
    [statusColorMap] // Include dependencies if applicable
  );

  if (subjectLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <DataFetchErrorPage error={subjectError} />;
  }

  return (
    <div>
      <BreadcrumbsComponent links={[{ name: "Subjects", path: "/subjects" }]} />
      <DataTablePage
        total={data?.totalPages as number}
        page={page}
        setLimit={setLimit}
        handlePageChange={handlePageChange}
        setPage={setPage}
        handleImport={handleImport}
        importProgress={importProgress}
        importing={importing}
        setFile={setFile}
        error={error}
        setError={setError}
        removeFile={removeFile}
        file={file}
        statusColorMap={statusColorMap}
        data={(data?.subjects as SubjectType[]) || []}
        columns={columns}
        statusOptions={statusOptions}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        entityName="Subject"
        renderCell={renderCell}
        createLink="/subjects/form"
        isLoading={isLoading}
      />
      <DeleteAccountModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onDelete={deleteSubjectHandler}
        isLoading={isLoading}
        studentName={subjectToDelete?.name || ""}
      />
    </div>
  );
};

export default SubjectsPage;
