import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import { useGetSingleEventQuery } from "@/store/endpoints/eventEndpoints";
import { Event } from "@/types/event.types";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  AlertCircleIcon,
  ShareIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import DataFetchErrorPage from "../DataFetchError.page";
import EventDetailSkeleton from "@/components/EventDetailSkeleton";

export default function EventDetailPage() {
  const { eventID } = useParams();
  const { data, isLoading, isFetching, isError, error } =
    useGetSingleEventQuery(eventID as string);

  const eventDetail = data || ({} as Event);

  const startDate = new Date(eventDetail?.date);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <DataFetchErrorPage error={error} />;
  }

  if (isFetching) {
    return <EventDetailSkeleton />;
  }

  return (
    <>
      <BreadcrumbsComponent
        links={[
          { name: "Events", path: "/events" },
          { name: "Event Detail", path: `/events/${eventDetail._id}` },
        ]}
      />
      <div
        className={`dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-blue-100 to-purple-100
      `}
      >
        <Card className="">
          <CardHeader className="relative h-64 overflow-hidden p-0">
            <div
              className={`absolute inset-0 bg-primary bg-opacity-70 flex items-center justify-center`}
            >
              <h1 className="text-4xl font-bold text-white text-center px-4">
                {eventDetail.title}
              </h1>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-default-500 mb-4">
                  <CalendarIcon className="w-5 h-5" />
                  <span>
                    {startDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-default-500 mb-4">
                  <ClockIcon className="w-5 h-5" />
                  <span>
                    {startDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-default-500 mb-6">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{eventDetail.location}</span>
                </div>
                <p className="text-default-700 mb-6">
                  {eventDetail.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {eventDetail?.attendees?.map((tag) => (
                    <Chip key={tag.attendeeId} color="primary" variant="flat">
                      {tag.role}
                    </Chip>
                  ))}
                </div>
                <Divider className="my-6" />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-default-500" />
                    <span className="text-sm text-default-500">
                      {eventDetail?.attendees?.length} attendees
                    </span>
                  </div>
                  <Chip
                    color={
                      eventDetail.status === "Scheduled" ? "success" : "warning"
                    }
                  >
                    {eventDetail.status}
                  </Chip>
                </div>
                <div className="flex -space-x-2 overflow-hidden mb-6">
                  {eventDetail?.attendees?.slice(0, 5)?.map((attendee) => (
                    <Tooltip
                      key={attendee.attendeeId}
                      content={`${attendee.role} (${attendee.role})`}
                    >
                      <Avatar
                        isBordered
                        color="primary"
                        src={"https://i.pravatar.cc/300"}
                        name={attendee.role}
                      />
                    </Tooltip>
                  ))}
                  {/* {eventDetail?.attendees?.length > 5 && (
                    <Avatar
                      isBordered
                      color="primary"
                      name={`+${eventDetail.attendees.length - 5}`}
                    />
                  )} */}
                </div>
              </div>
              <div className="flex flex-col gap-4 md:w-64">
                <Card>
                  <CardBody>
                    <Button color="primary" className="w-full mt-4">
                      Register Now
                    </Button>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-lg mb-2">Organizer</h3>
                    <p className="text-default-500">{eventDetail.organizer}</p>
                    <Button
                      color="secondary"
                      variant="bordered"
                      className="w-full mt-4"
                    >
                      Contact Organizer
                    </Button>
                  </CardBody>
                </Card>
                <div className="flex gap-2">
                  <Button color="primary" variant="flat" className="flex-1">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button color="danger" variant="flat" className="flex-1">
                    <AlertCircleIcon className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
