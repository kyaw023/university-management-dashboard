import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import {
  useDeleteEventMutation,
  useGetAllEventsQuery,
  useImportEventsMutation,
} from "@/store/endpoints/eventEndpoints";
import { Event } from "@/types/event.types";
import { ChipProps, Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DataFetchErrorPage from "../DataFetchError.page";
import DataTablePage from "../DataTable.page";
import { renderStudentSkeletonCell } from "@/components/SkeletonTable";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { eventColumns, eventStatusOptions } from "@/data/eventData";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["title", "description", "location", "actions"];

const EventsPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: events,
    isLoading: studentLoading,
    isFetching,
    isError,
    error: eventError,
    refetch,
  } = useGetAllEventsQuery({ page, limit });

  const [deleteExam, { isLoading }] = useDeleteEventMutation();

  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const [importExam] = useImportEventsMutation();
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
        refetch();
        toast.success("Students imported successfully");
      }
    }

    onOpenChange();
    removeFile();
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    onOpen();
  };

  const deleteEventHandler = async () => {
    if (eventToDelete) {
      const response = await deleteExam(eventToDelete._id as string);
      setEventToDelete(null);
      if ("data" in response) {
        toast.success(response.data?.message);
      } else {
        toast.error("Something went wrong");
      }
      onOpenChange();
    }
  };

  const renderCell = React.useCallback(
    (user: Event, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof Event];

      switch (columnKey) {
        case "date":
          return <h1>{new Date(user.date).toLocaleDateString()}</h1>;
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Details">
                <Link to={`/events/${user._id}`}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Edit User">
                <Link to={`/events/edit-event/${user._id}`}>
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
    navigate(`/events?page=${newPage}&limit=${limit}`);
    setPage(newPage);
  };

  if (studentLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DataFetchErrorPage error={eventError} />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbsComponent
        links={[{ name: "Exam Management", path: "/exam-management" }]}
      />

      <DataTablePage
        data={events?.events as Event[]}
        handlePageChange={handlePageChange}
        setLimit={setLimit}
        renderCell={(user, columnKey) =>
          isFetching
            ? renderStudentSkeletonCell(columnKey)
            : renderCell(user, columnKey)
        }
        total={events?.totalPages as number}
        statusOptions={eventStatusOptions}
        statusColorMap={statusColorMap}
        entityName="Exam"
        initialVisibleColumns={INITIAL_VISIBLE_COLUMNS}
        columns={eventColumns}
        createLink="/events/form"
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
        onDelete={deleteEventHandler}
        isLoading={isLoading}
        studentName={eventToDelete?.title || ""}
      />
    </>
  );
};

export default EventsPage;
