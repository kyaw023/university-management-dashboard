import { Card, CardBody } from "@nextui-org/react";

export default function SubjectDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
      <div className="h-8 w-64 mb-8 bg-white/50 rounded animate-pulse"></div>
      <Card className="bg-white/80 backdrop-blur-md border border-white/50 shadow-xl">
        <CardBody className="p-0">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-1 bg-gradient-to-br from-purple-500 to-blue-500 p-6 rounded-l-xl">
              <div className="h-10 w-3/4 bg-white/30 rounded mb-2 animate-pulse"></div>
              <div className="h-6 w-1/2 bg-white/30 rounded mb-4 animate-pulse"></div>
              <div className="h-48 w-full bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="md:col-span-2 p-6">
              <div className="h-20 w-full bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="mt-6 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="mt-8 flex justify-between items-center">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-x-4">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse inline-block"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse inline-block"></div>
        </div>
      </div>
    </div>
  );
}
