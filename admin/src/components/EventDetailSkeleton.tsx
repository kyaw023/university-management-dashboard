
import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";

export default function EventDetailSkeleton() {
  return (
    <div
      className={`dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-blue-100 to-purple-100`}
    >
      <Card className="">
        <CardHeader className="relative h-64 overflow-hidden p-0">
          <Skeleton className="w-full h-full rounded-none" />
        </CardHeader>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 rounded-lg mb-4" />
              <Skeleton className="h-6 w-2/3 rounded-lg mb-4" />
              <Skeleton className="h-6 w-5/6 rounded-lg mb-6" />
              <Skeleton className="h-24 w-full rounded-lg mb-6" />
              <div className="flex flex-wrap gap-2 mb-6">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <Skeleton className="h-px w-full mb-6" />
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-1/3 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="flex -space-x-2 overflow-hidden mb-6">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 md:w-64">
              <Card>
                <CardBody>
                  <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
                  <Skeleton className="h-8 w-1/2 rounded-lg mb-4" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
                  <Skeleton className="h-6 w-5/6 rounded-lg mb-4" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardBody>
              </Card>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-1/2 rounded-lg" />
                <Skeleton className="h-10 w-1/2 rounded-lg" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
