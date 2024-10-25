import React, { useState } from "react";
import { Chip, Tooltip, useDisclosure, ChipProps } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import DataTablePage from "../DataTable.page";
import {
  useDeleteExamMutation,
  useGetAllExamsQuery,
  useImportExamMutation,
} from "@/store/endpoints/examEndpoints";
import { toast } from "sonner";
import { capitalize } from "../utils";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { renderStudentSkeletonCell } from "@/components/SkeletonTable";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { Exam } from "@/types/exam.types";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { columns, statusOptions } from "../../data/examData";
import DataFetchErrorPage from "../DataFetchError.page";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "examName",
  "startDate",
  "endDate",
  "class",
  "subjects",
  "status",
  "actions",
];

export default function ExamManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: users,
    isLoading: studentLoading,
    isFetching,
    isError,
    error: examError,
  } = useGetAllExamsQuery({ page, limit, search: "" });

  console.log(users);

  const [deleteExam, { isLoading }] = useDeleteExamMutation();

  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const [importExam] = useImportExamMutation();
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

    const response = await importExam(formData).unwrap();

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

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
    onOpen();
  };

  const deleteExamHandler = async () => {
    if (examToDelete) {
      const response = await deleteExam(examToDelete._id as string);
      setExamToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const renderCell = React.useCallback(
    (user: Exam, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Exam];

      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="flat"
            >
              {user.status ? capitalize(user.status) : "N/A"}
            </Chip>
          );

        case "subjects":
          return (
            <div className="flex flex-col items-center gap-2">
              {user.subjects && user.subjects.length > 0 ? (
                user.subjects.map((subject, index) => (
                  <div key={subject?._id || index}>
                    <span className="p-2 rounded-full bg-default-100 text-default-600">
                      {subject?.subject?.name || "N/A"}
                    </span>
                    <span className="p-2 rounded-full bg-default-100 text-default-600">
                      {subject?.teacher?.name || "N/A"}
                    </span>
                    <span className="p-2 rounded-full bg-default-100 text-default-600">
                      {subject?.startTime || "N/A"}
                    </span>
                    <span className="p-2 rounded-full bg-default-100 text-default-600">
                      {subject?.endTime || "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p>N/A</p>
              )}
            </div>
          );

        case "class":
          return <h1>{user?.class?.name || "N/A"}</h1>;

        case "startDate":
          return (
            <h1>
              {user.startDate
                ? new Date(user.startDate).toLocaleDateString()
                : "N/A"}
            </h1>
          );

        case "endDate":
          return (
            <h1>
              {user.endDate
                ? new Date(user.endDate).toLocaleDateString()
                : "N/A"}
            </h1>
          );

        case "examName":
          return <h1>{user?.name || "N/A"}</h1>;

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/exam-management/detail-exam/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit User">
                <Link to={`/exam-management/edit-exam/${user._id}`}>
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

          if (Array.isArray(cellValue)) {
            return (
              <ul className="list-disc pl-5">
                {cellValue.map((item, index) => (
                  <li key={index}>{item?.subject?.name || "N/A"}</li>
                ))}
              </ul>
            );
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
    navigate(`/exam-management?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  if (studentLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DataFetchErrorPage error={examError} />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbsComponent
        links={[{ name: "Exam Management", path: "/exam-management" }]}
      />

      <DataTablePage
        data={users?.exams as Exam[]}
        handlePageChange={handlePageChange}
        setLimit={setLimit}
        renderCell={(user, columnKey) =>
          isFetching
            ? renderStudentSkeletonCell(columnKey)
            : renderCell(user, columnKey)
        }
        total={users?.totalPages as number}
        statusOptions={statusOptions}
        statusColorMap={statusColorMap}
        entityName="Exam"
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        columns={columns}
        createLink="/exam-management/form"
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
        onDelete={deleteExamHandler}
        isLoading={isLoading}
        studentName={examToDelete?.name || ""}
      />
    </>
  );
}
