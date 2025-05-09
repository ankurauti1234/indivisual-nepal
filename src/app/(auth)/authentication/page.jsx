"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryVerticalEnd, ArrowRight, Users, Shield } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="grid min-h-svh p-2 shadow-lg bg-gray-200">
      <div className="relative grid lg:grid-cols-2 border-2 rounded-2xl overflow-hidden">
        <motion.div
          className="flex flex-col gap-6 p-8 md:p-12 bg-card"
          animate={{
            order: isLogin ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/" className="flex items-center gap-2">
              <img src="/images/indi.png" alt="logo" className="h-12" />
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, x: isLogin ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 1, x: isLogin ? 100 : -100 }}
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="w-full max-w-sm"
              >
                {isLogin ? (
                  <LoginForm onToggle={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onToggle={() => setIsLogin(true)} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="relative hidden lg:block overflow-hidden "
          animate={{
            order: isLogin ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-section" : "register-section"}
              className="absolute inset-0 h-full w-full gradient"
              initial={{ x: isLogin ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="relative flex flex-col h-full w-full p-16 text-white">
                <motion.div
                  key={isLogin ? "login-content" : "register-content"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {isLogin ? (
                    <>
                      <div className="space-y-4">
                        <h2 className="text-4xl font-semibold tracking-tight">
                          Welcome Back
                        </h2>
                        <p className="text-xl font-light leading-relaxed text-white/90">
                          Sign in to access your personalized dashboard and
                          continue your journey.
                        </p>
                      </div>
                      <div className="mt-auto flex justify-center">
                        <motion.img
                          src="/assets/Idea.svg"
                          alt="Login illustration"
                          className="h-[40vh] w-auto object-contain"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h2 className="text-4xl font-semibold tracking-tight">
                          Start Your Journey
                        </h2>
                        <p className="text-xl font-light leading-relaxed text-white/90">
                          Create an account to unlock all features and join our
                          community.
                        </p>
                      </div>
                      <div className="mt-auto flex justify-center">
                        <motion.img
                          src="/assets/Meeting.svg"
                          alt="Register illustration"
                          className="h-[40vh] w-auto object-contain"
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}