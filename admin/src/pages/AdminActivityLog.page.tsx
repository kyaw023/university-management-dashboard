import { useState } from "react";
import { useGetActivityLogsQuery } from "@/store/endpoints/activityLogEndpoints";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  User,
  Pagination,
  Spinner,
  Input,
} from "@nextui-org/react";
import { CheckCircle, XCircle } from "lucide-react";
import { IActivityLog } from "@/types/activityLog.types";
import { useNavigate } from "react-router-dom";

const getColorForAction = (
  action: IActivityLog["action"]
): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
  switch (action) {
    case "create":
      return "success";
    case "read":
      return "primary";
    case "update":
      return "warning";
    case "delete":
      return "danger";
    case "import":
      return "secondary";
    case "login":
    case "logout":
      return "default";
    default:
      return "default";
  }
};

export default function ActivityLog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useGetActivityLogsQuery({
    page,
    limit: 5,
    search,
  });

  const navigate = useNavigate();

  const activityLogLists = data?.activityLogs || [];

  const handlePageChange = (newPage: number) => {
    navigate(`/activity-log?page=${newPage}&limit=${5}`);
    setPage(newPage);
  };

  const filteredLogs =
    activityLogLists.filter(
      (log) =>
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.userName.toLowerCase().includes(search.toLowerCase())
    ) || [];
    
  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Activity Log</h1>
      <Input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table aria-label="Activity log table" className="min-h-[400px]">
        <TableHeader>
          <TableColumn>ACTION</TableColumn>
          <TableColumn>USER</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TIMESTAMP</TableColumn>
          <TableColumn>IP ADDRESS</TableColumn>
          <TableColumn>PERFORM BY</TableColumn>
        </TableHeader>
        <TableBody
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={isLoading ? " " : "No activity logs found"}
          isLoading={isLoading}
        >
          {filteredLogs &&
            filteredLogs.map((log: IActivityLog) => (
              <TableRow key={log._id}>
                <TableCell>
                  <Chip color={getColorForAction(log.action)} variant="flat">
                    {log.action}
                  </Chip>
                </TableCell>
                <TableCell>
                  <User
                    name={log.userName}
                    description={log.performBy}
                    avatarProps={{
                      src: `https://i.pravatar.cc/150?u=${log.userId}`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip
                    content={`Resource: ${log.resource}, ID: ${log.resourceId}`}
                  >
                    <span className="cursor-help">{log.description}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    startContent={
                      log?.status === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )
                    }
                    color={log?.status === "success" ? "success" : "danger"}
                    variant="flat"
                  >
                    {log?.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Tooltip content={"Created At"}>
                    <span className="cursor-help">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip content={log.ipAddress}>
                    <span className="cursor-help">{log.ipAddress}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip content={log.performBy}>
                    <span className="cursor-help">{log.performBy}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {data && (
        <div className="flex justify-center">
          <Pagination
            total={data.totalPages}
            initialPage={page}
            page={page}
            variant="light"
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
