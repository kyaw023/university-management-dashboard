import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import { AnnouncementsComponent, QuickLinksComponent, UpcomingClassesComponent } from "../components";

const TeacherHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <UpcomingClassesComponent />

          {/* Quick Links */}
          <QuickLinksComponent />

          {/* Recent Announcements */}
          <AnnouncementsComponent />

          {/* Teaching Load Summary */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Teaching Load Summary</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Courses
                  </p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">120</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Office Hours
                  </p>
                  <p className="text-2xl font-bold">10 hrs/week</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherHomepage;
