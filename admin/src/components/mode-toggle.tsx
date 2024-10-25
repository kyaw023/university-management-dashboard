"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@nextui-org/react";

const iconAnimation = {
  hidden: { opacity: 0, scale: 0.5, rotate: -180 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
};

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!isClient) return null;

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={handleToggle}
      aria-label="Toggle theme"
      className="bg-transparent hover:bg-default-100 active:bg-default-200 transition-all duration-200"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={iconAnimation}
        transition={{ duration: 0.2 }}
        key={theme}
      >
        {theme === "light" ? <SunIcon /> : <MoonIcon />}
      </motion.div>
    </Button>
  );
}

const SunIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-warning"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-default-600"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
