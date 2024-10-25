import { ResponseeSchedule } from "@/types/types";

const ScheduleTable: React.FC<{ schedules: ResponseeSchedule[] }> = ({
  schedules,
}) => {
  return (
    <div>
      <div>
        {schedules.map((schedule) => (
          <div className="grid grid-cols-5" key={schedule.day}>
            <h1>{schedule.day}</h1>
            <p>{schedule.start_time}</p>
            <p>{schedule.end_time}</p>
            <p>{schedule.class?.name}</p>
            <p>{schedule.subject?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTable;
