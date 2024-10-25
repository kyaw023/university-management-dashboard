import React, { useState, useEffect } from "react";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";

import { IconUsers, IconUserCheck, IconBook } from "@tabler/icons-react";
import { EnhancedSchoolStatisticsChart } from "@/components";
import Calendar from "@/components/Calendar";
import { useGetTeacherListsQuery } from "@/store/endpoints/teacherEndpoints";
import { useGetSubjectListsQuery } from "@/store/endpoints/subjectEndpoints";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className="w-full" isPressable isHoverable>
      <CardBody className="flex flex-row items-center justify-between p-6">
        <div className="flex flex-col">
          <p className="text-default-500">{title}</p>
          <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </CardBody>
      <Divider />
      <CardFooter className="text-default-500">
        <p>+10% from last month</p>
      </CardFooter>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { data } = useGetTeacherListsQuery();
  const { data: classLists } = useGetSubjectListsQuery();

  console.log(data, classLists);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats: StatCardProps[] = [
    {
      title: "Students",
      value: 10000,
      icon: <IconUsers size={24} />,
      color: "bg-primary-100 text-primary-500",
    },
    {
      title: "Teachers",
      value: 500,
      icon: <IconUserCheck size={24} />,
      color: "bg-secondary-100 text-secondary-500",
    },
    {
      title: "Courses",
      value: 100,
      icon: <IconBook size={24} />,
      color: "bg-success-100 text-success-500",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <EnhancedSchoolStatisticsChart />
      <Calendar />
    </div>
  );
};

export default DashboardPage;
