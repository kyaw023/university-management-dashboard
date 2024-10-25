import { Spinner } from "@nextui-org/react";

const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="lg" color="primary" />
    </div>
  );
};

export default LoadingComponent;
