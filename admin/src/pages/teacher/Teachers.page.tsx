import React, { useState } from "react";
import {
  Chip,
  ChipProps,
  User,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { columns, statusOptions } from "../../data/teacherData";
import { capitalize } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import ScheduleTable from "../../components/ScheduleTable";
import DataTablePage from "../DataTable.page";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import {
  useDeleteTeacherMutation,
  useGetAllTeachersQuery,
  useImportTeacherMutation,
} from "@/store/endpoints/teacherEndpoints";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { toast } from "sonner";
import { TeacherType } from "@/types/teachers.type";
import { renderStudentSkeletonCell } from "@/components/SkeletonTable";
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
  "employment_status",
  "address",
  "phone",
  "actions",
  "schedule",
];

export default function TeachersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: teacherData,
    isFetching,
    isLoading: teacherLoading,
    isError,
    error: teacherError,
  } = useGetAllTeachersQuery({
    page,
    limit,
  });
  const [deleteTeacher, { isLoading }] = useDeleteTeacherMutation();
  const navigate = useNavigate();

  const [teacherToDelete, setTeacherToDelete] = useState<TeacherType | null>(
    null
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTeachers] = useImportTeacherMutation();

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

    const response = await importTeachers(formData).unwrap();

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

  const handleDeleteClick = (teacher: TeacherType) => {
    setTeacherToDelete(teacher);
    onOpen();
  };

  const deleteStudentHandler = async () => {
    if (teacherToDelete) {
      const response = await deleteTeacher(teacherToDelete._id as string);

      setTeacherToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/teachers?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  const renderCell = React.useCallback(
    (user: TeacherType, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof TeacherType];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user?.image as string }}
              description={user.email}
              name={user.name}
            >
              {user.email}
            </User>
          );

        case "employment_status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.employment_status]}
              size="sm"
              variant="flat"
            >
              {capitalize(user.employment_status)}
            </Chip>
          );

        case "schedule":
          return <ScheduleTable schedules={user.schedule as any} />;

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/teachers/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit user">
                <Link to={`/teachers/edit-teacher/${user._id}`}>
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

  if (isError) {
    return <DataFetchErrorPage error={teacherError} />;
  }

  if (teacherLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <BreadcrumbsComponent links={[{ name: "Teachers", path: "/teachers" }]} />
      <DataTablePage
        page={page}
        setPage={setPage}
        total={teacherData?.totalPages as number}
        handleImport={handleImport}
        importProgress={importProgress}
        importing={importing}
        data={(teacherData?.teachers as TeacherType[]) || []}
        file={file}
        setFile={setFile}
        error={error}
        setError={setError}
        removeFile={removeFile}
        isLoading={isLoading}
        renderCell={(user, columnKey) =>
          isFetching
            ? renderStudentSkeletonCell(columnKey)
            : renderCell(user as TeacherType, columnKey)
        }
        columns={columns}
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        statusOptions={statusOptions}
        entityName="Teacher"
        statusColorMap={statusColorMap}
        createLink="/teachers/form"
        handlePageChange={handlePageChange}
        setLimit={setLimit}
      />
      <DeleteAccountModal
        onDelete={deleteStudentHandler}
        isLoading={isLoading}
        studentName={teacherToDelete?.name as string}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
