import { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useGetClasslistQuery } from "@/store/endpoints/classEndpoints";
import { Course } from "@/types/classes.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: classes, isLoading, isError } = useGetClasslistQuery();

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error loading classes</p>;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Array(35);
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    let date_ = 1;
    for (let i = 0; i < 35; i++) {
      if (i >= firstDay && date_ <= lastDate) {
        days[i] = date_++;
      } else {
        days[i] = null;
      }
    }
    return days;
  };

  const getEventsForDate = (date: number) => {
    if (!date) return [];
    const fullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    return (
      classes?.filter((classItem: Course) => {
        const startDate = new Date(classItem.start_date);
        const endDate = new Date(classItem.end_date);
        return fullDate >= startDate && fullDate <= endDate;
      }) || []
    );
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  return (
    <Card className="">
      <CardHeader className="flex justify-between items-center px-4 py-2">
        <Button isIconOnly variant="light" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <Button isIconOnly variant="light" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardBody className="px-2 py-4 ">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentDate).map((day, index) => (
            <Card
              key={index}
              className={`h-24 ${
                day ? "bg-content1" : "bg-content2 opacity-50"
              }`}
            >
              <CardBody className="p-1 overflow-hidden">
                <p className="font-semibold">{day}</p>
                <div className=" space-y-1">
                  {getEventsForDate(day).map(
                    (event: Course, eventIndex: number) => (
                      <p
                        key={eventIndex}
                        className="text-xs text-gray-700 dark:text-white/70 truncate"
                      >
                        {event.name}
                      </p>
                    )
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
