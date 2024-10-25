import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

const AnnouncementsComponent = () => {
  const recentAnnouncements = [
    { id: 1, title: "Faculty Meeting", date: "2023-06-15", priority: "high" },
    {
      id: 2,
      title: "Grading Deadline Reminder",
      date: "2023-06-18",
      priority: "medium",
    },
    {
      id: 3,
      title: "New Research Opportunity",
      date: "2023-06-20",
      priority: "low",
    },
  ];
  return (
    <Card className="col-span-2">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Announcements</h2>
        <Button size="sm" color="primary">
          View All
        </Button>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table aria-label="Recent announcements">
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>PRIORITY</TableColumn>
          </TableHeader>
          <TableBody>
            {recentAnnouncements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>{announcement.title}</TableCell>
                <TableCell>{announcement.date}</TableCell>
                <TableCell>
                  <Chip
                    color={
                      announcement.priority === "high"
                        ? "danger"
                        : announcement.priority === "medium"
                        ? "warning"
                        : "success"
                    }
                    size="sm"
                  >
                    {announcement.priority}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default AnnouncementsComponent;
