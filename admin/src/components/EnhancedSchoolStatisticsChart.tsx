import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { motion } from "framer-motion";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";

// Sample data - replace with actual data from your API or database
const overviewData = [
  { name: "Students", count: 1200, color: "#FF6B6B" },
  { name: "Teachers", count: 80, color: "#4ECDC4" },
  { name: "Courses", count: 50, color: "#45B7D1" },
  { name: "Classes", count: 60, color: "#FFA07A" },
];

const genderData = [
  { name: "Male", value: 650, color: "#4361EE" },
  { name: "Female", value: 550, color: "#F72585" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
};

export default function ImprovedSchoolStatisticsChart() {
  return (
    <Card
      as={motion.div}
      className="w-full my-10"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <CardBody className="p-8">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          University Statistics Dashboard
        </h1>
        <p className="text-lg text-default-500 mb-8">
          Comprehensive overview of University metrics
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="space-y-4" variants={chartVariants}>
            <Card>
              <CardBody>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Overall Statistics
                </h3>
                <ChartContainer
                  config={Object.fromEntries(
                    overviewData.map((item) => [
                      item.name.toLowerCase(),
                      { label: item.name, color: item.color },
                    ])
                  )}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overviewData}>
                      <XAxis
                        dataKey="name"
                        stroke="currentColor"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="currentColor"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ fill: "rgba(100,100,100,0.1)" }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {overviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardBody>
              <Divider />
              <CardFooter className="text-default-500">
                <p>+15% increase in overall metrics</p>
              </CardFooter>
            </Card>
          </motion.div>
          <motion.div className="space-y-4" variants={chartVariants}>
            <Card>
              <CardBody>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Student Gender Distribution
                </h3>
                <ChartContainer
                  config={Object.fromEntries(
                    genderData.map((item) => [
                      item.name.toLowerCase(),
                      { label: item.name, color: item.color },
                    ])
                  )}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm font-medium text-default-500">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardBody>
              <Divider />
              <CardFooter className="text-default-500">
                <p>Gender ratio balanced within 5%</p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </CardBody>
    </Card>
  );
}
