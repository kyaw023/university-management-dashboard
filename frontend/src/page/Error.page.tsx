import { useRouteError } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { AlertTriangleIcon, HomeIcon } from "lucide-react";

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const errorMessage =
    error?.statusText || error?.message || "An unexpected error occurred";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-default-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex gap-3 justify-center">
          <AlertTriangleIcon size={40} className="text-danger" />
          <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-lg mb-4">
            We're sorry, but we encountered an error while processing your
            request.
          </p>
          <p className="text-default-500">{errorMessage}</p>
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button
            color="primary"
            variant="shadow"
            startContent={<HomeIcon size={18} />}
            as="a"
            href="/"
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
