import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Button,
  Progress,
  Avatar,
} from "@nextui-org/react";
import {
  Book,
  Laptop,
  DoorOpen,
  Calendar,
  Clock,
  MapPin,
  Info,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetLibraryDetailQuery } from "@/store/endpoints/LibraryEndpoints";
import { Library } from "@/types/library.types";
import { useParams } from "react-router-dom";
import { BreadcrumbsComponent } from "@/components";

const getStatusColor = (status: "available" | "borrowed" | "reserved") => {
  switch (status) {
    case "available":
      return "success";
    case "borrowed":
      return "warning";
    case "reserved":
      return "secondary";
    default:
      return "default";
  }
};

const getTypeIcon = (type: "book" | "equipment" | "room") => {
  switch (type) {
    case "book":
      return <Book className="text-primary" />;
    case "equipment":
      return <Laptop className="text-primary" />;
    case "room":
      return <DoorOpen className="text-primary" />;
    default:
      return <Info className="text-primary" />;
  }
};

export default function LibraryDetailBeautiful() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { bookID } = useParams<string>();

  const { data } = useGetLibraryDetailQuery(bookID as string, {
    skip: !bookID,
  });

  console.log(data);

  const item = data || ({} as Library);

  console.log(item);

  // Random library item data

  return (
    <div className="">
      <BreadcrumbsComponent
        links={[
          { name: "Library", path: "/library" },
          { name: "Library Detail", path: `/library/${bookID}` },
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gradient-to-r from-purple-500 to-blue-500">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Avatar
                icon={getTypeIcon(item.type)}
                className="w-20 h-20 text-white bg-black/20"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">{item.name}</h1>
                <p className="text-lg text-white/80">{item.category}</p>
              </div>
            </div>
            <Chip
              color={getStatusColor(item.availability_status)}
              variant="shadow"
              size="lg"
              className="capitalize"
            >
              {item.availability_status}
            </Chip>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Info size={20} />
                    Description
                  </h2>
                  <p
                    className={`text-default-600 ${
                      isExpanded ? "" : "line-clamp-3"
                    }`}
                  >
                    {item.description}
                  </p>
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    className="mt-2"
                    onPress={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </Button>
                </motion.div>
              </div>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <MapPin size={20} />
                    Location
                  </h2>
                  <p className="text-default-600">{item.location}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Info size={20} />
                    Availability
                  </h2>
                  <Progress
                    label={`${item.quantity} of ${item.quantity} available`}
                    value={100}
                    className="max-w-md"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Calendar size={20} />
                    Borrow Details
                  </h2>
                  <p className="text-default-600">
                    Limit: {item.borrow_limit} days
                  </p>
                  <p className="text-default-600">
                    Late Fee: $
                    {item.late_fee_per_day
                      ? item.late_fee_per_day.toFixed(2)
                      : 0}
                    /day
                  </p>
                </motion.div>
              </div>
            </div>
            <Divider className="my-6" />
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center gap-2 text-small text-default-400">
                <Clock size={16} />
                <span>
                  Last updated: {new Date(item.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        className="mt-6 flex justify-end gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Button
          color="primary"
          variant="flat"
          startContent={<Edit size={18} />}
        >
          Edit
        </Button>
      </motion.div>
    </div>
  );
}
