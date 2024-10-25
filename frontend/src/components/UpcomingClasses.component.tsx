import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { useGetTeacherClassesQuery } from "../store/endpoints/teacherEndpoint";
import { Schedule } from "../types/user.types";

const UpcomingClassesComponent = () => {
  const {  user } = useSelector((state: RootState) => state.auth);

  const { data } = useGetTeacherClassesQuery(user?._id as string);
  return (
    <Card className="col-span-2">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Upcoming Classes</h2>
        
        <Button size="sm" color="primary">
          View All
        </Button>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table aria-label="Upcoming classes">
          <TableHeader>
            <TableColumn>CLASS</TableColumn>
            <TableColumn>TIME</TableColumn>
            <TableColumn>SUBJECT</TableColumn>
          </TableHeader>
          <TableBody>
            {data &&
              data.schedule &&
              data?.schedule?.map((cls: Schedule, index: number) => (
                <TableRow key={index}>
                  <TableCell>{cls.class.name}</TableCell>
                  <TableCell>
                    {cls.start_time} - {cls.end_time}
                  </TableCell>
                  <TableCell>{cls.subject.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default UpcomingClassesComponent;
