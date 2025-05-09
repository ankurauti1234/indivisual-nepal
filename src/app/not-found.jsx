'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, Compass, ArrowRight, Sparkles, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  useEffect(() => {
    const followMouse = () => {
      setCursorPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
    };

    const intervalId = setInterval(followMouse, 16);
    return () => clearInterval(intervalId);
  }, [mousePosition]);

  const numbers = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-primary to-secondary"
          style={{
            left: `${cursorPosition.x - 400}px`,
            top: `${cursorPosition.y - 400}px`,
            transform: "translate(-50%, -50%)",
            transition: "all 0.1s ease-out",
          }}
        />
      </div>

      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 -z-10"
        )}
      />

      {/* Floating numbers */}
      {/* {numbers.map((num, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10 font-bold text-4xl pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {Math.random() > 0.5 ? "4" : "0"}
        </motion.div>
      ))} */}

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-medium border-primary/20 bg-background/50"
          >
            <Radar className="w-4 h-4 mr-2 text-primary" />
            Page Not Found
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <h1 className="text-[12rem] font-bold leading-none tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </h1>

          <motion.div
            className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mt-8 mb-4"
        >
          Oops! Looks like you're lost in space
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground text-lg mb-8"
        >
          The page you're looking for has drifted into another dimension. Let's
          get you back on track!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button size="lg" className="shadow-lg group">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
