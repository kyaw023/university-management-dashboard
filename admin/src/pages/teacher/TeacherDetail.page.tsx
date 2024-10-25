import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Book,
  Sun,
  Moon,
} from "lucide-react";
import { useGetSingleTeacherQuery } from "@/store/endpoints/teacherEndpoints";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataFetchErrorPage from "../DataFetchError.page";

export default function TeacherDetailPage() {
  const { teacherID } = useParams();
  const { data, isLoading, isError, error } = useGetSingleTeacherQuery(
    teacherID as string
  );
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <DataFetchErrorPage error={error} />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Teacher not found
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <BreadcrumbsComponent
            links={[
              { name: "Teachers", path: "/teachers" },
              { name: "Teacher Detail", path: `/teachers/${teacherID}` },
            ]}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
        <motion.div
          className=""
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="overflow-hidden">
            <CardHeader className="relative h-64 sm:h-80 p-0">
              <motion.img
                src={
                  (data.image as string) ||
                  "/placeholder.svg?height=320&width=640"
                }
                alt={`${data.name} in classroom`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2"
                  variants={itemVariants}
                >
                  {data.name}
                </motion.h1>
                <motion.p
                  className="text-xl sm:text-2xl text-gray-200"
                  variants={itemVariants}
                >
                  {data.gender}
                </motion.p>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <p>{data.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{data.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{data.address}</span>
                </div>
              </div>
              <motion.p
                className="text-muted-foreground mb-8"
                variants={itemVariants}
              >
                Dr. Johnson is a renowned mathematician with over 15 years of
                teaching experience. Her research focuses on number theory and
                cryptography, and she's passionate about making complex
                mathematical concepts accessible to all students.
              </motion.p>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        Office Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Monday: 2:00 PM - 4:00 PM</li>
                        <li>Wednesday: 1:00 PM - 3:00 PM</li>
                        <li>Friday: 10:00 AM - 12:00 PM</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-green-500 dark:text-green-400" />
                        Courses Taught
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>Advanced Calculus</li>
                        <li>Linear Algebra</li>
                        <li>Number Theory</li>
                        <li>Cryptography</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
              <motion.div className="mt-8" variants={itemVariants}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  Awards and Recognitions
                </h2>
                <ul className="space-y-2">
                  {data.qualifications.map((qualification, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-2 bg-muted rounded-lg p-3"
                      variants={itemVariants}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${qualification}`}
                        />
                        <AvatarFallback>{qualification[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">
                        {qualification}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
