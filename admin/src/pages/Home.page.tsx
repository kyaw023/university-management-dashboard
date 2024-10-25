import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Library,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  FileText,
  Calendar,
  BarChart,
  Flag,
} from "lucide-react";
import { DashboardHeaderComponent } from "@/components";

const siderLinks = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Teachers", path: "/teachers", icon: GraduationCap },
  { name: "Classes", path: "/classes", icon: Layers },
  { name: "Subjects", path: "/subjects", icon: BookOpen },
  { name: "Library", path: "/library", icon: Library },
  { name: "Activity Log", path: "/activity-log", icon: FileText },
  { name: "Events", path: "/events", icon: Flag },
  { name: "Settings", path: "/settings", icon: Settings },
  {
    name: "Report and Analytics",
    path: "/reports-analytics",
    icon: BarChart,
  },
  {
    name: "exam-management",
    path: "/exam-management",
    icon: Calendar,
  },
];

const sidebarVariants = {
  open: { width: "16rem", transition: { duration: 0.3 } },
  closed: { width: "4rem", transition: { duration: 0.3 } },
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80">
      {/* Sidebar */}
      <motion.aside
        className="bg-background/95 backdrop-blur-md border-r border-divider"
        initial={isOpen ? "open" : "closed"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between p-4">
          <AnimatePresence>
            {isOpen && (
              <motion.h2
                className="text-xl font-bold text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Riverstone Admin
              </motion.h2>
            )}
          </AnimatePresence>
          <Button
            isIconOnly
            variant="light"
            onPress={toggle}
            className="text-foreground"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <nav className="space-y-1 p-2">
            {siderLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/90 hover:text-slate-100 ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                <link.icon size={20} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-background/95 backdrop-blur-md border-b border-divider">
          <div className="flex items-center justify-between px-4 py-3">
            <DashboardHeaderComponent />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="container mx-auto px-6 py-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
