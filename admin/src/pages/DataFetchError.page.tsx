import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { AlertCircleIcon, RefreshCwIcon, ArrowLeftIcon } from "lucide-react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface DataFetchErrorPageProps {
  error?: FetchBaseQueryError | SerializedError;
  isNotFound?: boolean;
}

export default function DataFetchErrorPage({
  error,
  isNotFound = false,
}: DataFetchErrorPageProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const errorMessage =
    error || "An unexpected error occurred while fetching data";
  const title = isNotFound ? "Data Not Found" : "Error Fetching Data";
  const description = isNotFound
    ? `We couldn't find the requested data${id ? ` for ID: ${id}` : ""}.`
    : "We're having trouble fetching the data you requested.";

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-background to-default-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex gap-3 justify-center">
          <AlertCircleIcon size={40} className="text-danger" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-lg mb-4">{description}</p>
          <p className="text-default-500">{errorMessage as string}</p>
        </CardBody>
        <CardFooter className="flex justify-center gap-4">
          <Button
            color="primary"
            variant="flat"
            startContent={<RefreshCwIcon size={18} />}
            onPress={handleRetry}
          >
            Retry
          </Button>
          <Button
            color="default"
            variant="flat"
            startContent={<ArrowLeftIcon size={18} />}
            onPress={handleGoBack}
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
