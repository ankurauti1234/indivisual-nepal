'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const CircularCursor = ({ position, isClicked, onAnimationComplete }) => {
  return (
    <motion.div 
      className="fixed pointer-events-none z-50 bg-primary/15 backdrop-filter backdrop-blur-3xl rounded-full"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ width: 48, height: 48 }}
      animate={{
        width: isClicked ? '200vw' : 48,
        height: isClicked ? '200vh' : 48,
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
      }}
      onAnimationComplete={() => {
        if (isClicked) {
          onAnimationComplete();
        }
      }}
    >
      <div className="relative w-full h-full">
        {!isClicked && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -left-4 -top-4 -inset-2 bg-primary/10 size-20 rounded-full animate-ping" />
              <div className="relative bg-primary rounded-full p-2">
                <ArrowUpRight className="w-8 h-8 text-background" />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ReportCard = ({ image, title, lastUpdated, page, subpage, slug, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isHovered) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isHovered]);

  const handleMouseMove = (e) => {
    if (isHovered) {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleClick = () => {
    setIsClicked(true);
  };
  const href=`/dashboard/${page}/${subpage}/${slug}`

  const handleAnimationComplete = () => {
    window.location.href =  href;
  };

  return (
    <>
      {isHovered && (
        <CircularCursor 
          position={position}
          isClicked={isClicked}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      <div 
        className="w-full h-96  relative hover:shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <Card
          className="w-full h-full overflow-hidden rounded-lg rounded-tr-[1rem] bg-muted border-0 shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-0 relative h-full">
            <motion.div
              className="w-full h-full"
              animate={{
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={image}
                alt="Project Image"
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
            <AnimatePresence>
              {isHovered && !isClicked && (
                <motion.div
                  initial={{ y: 150, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 150, opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    exit: { duration: 0.25 },
                  }}
                  className="absolute inset-0 flex items-end justify-end p-4"
                >
                  <Card className="w-full h-44 overflow-hidden rounded-lg rounded-tr-[1rem] flex flex-col justify-between">
                    <CardContent className="p-4">
                      <p className="text-xl font-bold text-foreground/75 mb-2">
                       {title}
                      </p>
                      <p className="text-sm text-foreground/45">
                     {description}
                     {slug}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-foreground/45">
                          Published
                        </p>
                        <p className="text-foreground/75 font-bold text-sm">{lastUpdated}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
        <div className="absolute top-0 right-0 project-card-custom-corner">
          <div className="project-card-custom-corner-label">
            <div className="absolute top-[-24rem] right-0 bg-background text-sm rounded-lg rounded-br-none rounded-tl-none w-20 h-8 flex items-center justify-center p-2">
              <span className="text-background bg-foreground rounded-full w-full text-center">
                report
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportCard;