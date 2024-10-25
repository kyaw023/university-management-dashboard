import React, { useState } from "react";
import { Chip, ChipProps, User, Tooltip, Spinner } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { columns, statusOptions } from "../../data/data";
import { capitalize } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import EmergencyContactDetails from "../../components/EmergencyContactDetails";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import DataTablePage from "../DataTable.page";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import {
  useDeleteStudentMutation,
  useGetAllStudentsQuery,
  useImportStudentsMutation,
} from "@/store/endpoints/studentEndpoints";
import { toast } from "sonner";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { renderStudentSkeletonCell } from "@/components/SkeletonTable";
import { Student } from "@/types/students.types";
import DataFetchErrorPage from "../DataFetchError.page";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "role",
  "gender",
  "status",
  "address",
  "class",
  "actions",
];

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: users,
    isLoading: studentLoading,
    isFetching,
    isError,
    error: studentError,
  } = useGetAllStudentsQuery({ page, limit, search: "" });
  console.log(users);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteStudent, { isLoading }] = useDeleteStudentMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStudents] = useImportStudentsMutation();

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

    const response = await importStudents(formData).unwrap();

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

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    onOpen();
  };

  const deleteStudentHandler = async () => {
    if (studentToDelete) {
      const response = await deleteStudent(studentToDelete._id as string);
      setStudentToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const renderCell = React.useCallback(
    (user: Student, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Student];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.image as string }}
              description={user.email}
              name={user.name}
            >
              {user.email}
            </User>
          );

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

        case "emergency_contact":
          return (
            <EmergencyContactDetails
              emergency_contact={{
                name: user.emergency_contact.name,
                phone: user.emergency_contact.phone,
              }}
            />
          );

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/students/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit user">
                <Link to={`/students/edit-student/${user._id}`}>
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
                  <li key={index}>{item}</li>
                ))}
              </ul>
            );
          }

          if (typeof cellValue === "object") {
            return (
              <div>
                {Object.entries(cellValue).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <strong>{key}:</strong>
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
    navigate(`/students?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  if (studentLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <DataFetchErrorPage error={studentError} />;
  }

  return (
    <>
      <BreadcrumbsComponent links={[{ name: "Students", path: "/students" }]} />
      <DataTablePage
        data={users?.students as Student[]}
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
        entityName="Student"
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        columns={columns}
        createLink="/students/form"
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
        onDelete={deleteStudentHandler}
        isLoading={isLoading}
        studentName={studentToDelete?.name || ""}
      />
    </>
  );
}
