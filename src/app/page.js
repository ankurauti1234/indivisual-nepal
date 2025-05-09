"use client";
import React, { useState } from "react";
import {
  BarChart2,
  Target,
  Tv,
  Users,
  Radio,
  PieChart,
  LineChart,
  Activity,
  Zap,
  ArrowRight,
  Sparkles,
  Globe,
  ArrowRightIcon,
  Brain,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import MorphingText from "@/components/ui/morphing-text";
import { motion } from "framer-motion";
import AnalyticsCardStack from "@/components/card/AnalyticsCardStack";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Add these stats arrays at the top of your component, outside of the JSX
  const surveyStats = [
    { label: "Questions", value: "15+" },
    { label: "Time", value: "5 min" },
    { label: "Topics", value: "5" },
    { label: "Reward", value: "Yes" },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description:
        "Advanced machine learning algorithms process viewer behavior patterns and predict content performance with unprecedented accuracy.",
      stats: [
        { label: "Prediction Accuracy", value: "96%" },
        { label: "Data Points", value: "1M+" },
        { label: "Processing Time", value: "<1s" },
      ],
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: Globe,
      title: "Real-Time Monitoring",
      description:
        "Track audience engagement across multiple channels simultaneously with live updates and instant notifications.",
      stats: [
        { label: "Update Frequency", value: "Live" },
        { label: "Channel Support", value: "50+" },
        { label: "Data Lag", value: "<2ms" },
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Audience Insights",
      description:
        "Deep dive into demographic data and viewer preferences to optimize content strategy and targeting.",
      stats: [
        { label: "Demographics", value: "25+" },
        { label: "Segments", value: "100+" },
        { label: "Accuracy", value: "99%" },
      ],
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Activity,
      title: "Performance Metrics",
      description:
        "Comprehensive analytics dashboard with customizable KPIs and automated reporting capabilities.",
      stats: [
        { label: "Metrics", value: "200+" },
        { label: "Reports", value: "50+" },
        { label: "Templates", value: "30+" },
      ],
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const ActiveFeatureIcon = features[activeFeature].icon;

  const texts = ["Broadcasters", "Advertisers", "Brand"];

  const solutions = [
    {
      icon: Tv,
      title: "Broadcasters",
      description:
        "Real-time audience measurement and content performance analytics for TV networks and streaming platforms",
      features: [
        "Viewer Demographics",
        "Content Performance",
        "Ad Impact Analysis",
      ],
      gradient: "from-blue-400 to-indigo-400",
    },
    {
      icon: Target,
      title: "Advertisers",
      description:
        "Optimize campaign performance with precise targeting and measurement across all broadcasting channels",
      features: ["Campaign Analytics", "Audience Targeting", "ROI Measurement"],
      gradient: "from-orange-400 to-red-400",
    },
    {
      icon: PieChart,
      title: "Brands",
      description:
        "Track brand visibility and audience engagement across multiple broadcasting channels",
      features: ["Brand Impact", "Audience Insights", "Competition Analysis"],
      gradient: "from-green-400 to-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="min-h-screen relative">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute inset-0">
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute  top-0 left-1/3  w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <nav className="container mx-auto px-6 py-8 relative">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <img src="/images/indi.png" alt="logo" className="h-20" />
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#solutions"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Solutions
              </a>
              <a
                href="#peoplemeter"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                PeopleMeter
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
            <a href="/authentication">
              <Button className="shadow-lg">Get Started</Button>
            </a>
          </div>
        </nav>

        <div className=" px-6 lg:px-32 flex items-center justify-center min-h-[calc(100vh-120px)] relative">
          <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
            <div className="space-y-8 flex flex-col items-start h-full ">
              <div className="z-10 flex items-center justify-center">
                <div
                  className={cn(
                    "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  )}
                >
                  <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>✨ Introducing INDI-VISUAL</span>
                    <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                  </AnimatedShinyText>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="flex flex-row gap-2 items-center">
                  Submersive{" "}
                  {/* <WordRotate
                    className="text-4xl md:text-6xl font-bold text-primary"
                    words={["Broadcasters", "Advertisers", "Brand"]}
                    duration={2500}
                  /> */}
                  <MorphingText
                    texts={texts}
                    className="text-4xl md:text-6xl font-bold text-primary"
                  />
                </span>
                <span className="text-primary"> Analytics</span> for the Modern
                Era
              </h1>
              <p className="text-xl text-muted-foreground">
                Empower your broadcasting decisions with real-time analytics,
                audience insights, and precise measurement through our advanced
                PeopleMeter technology.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="shadow-lg">
                  Schedule Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            <AnalyticsCardStack />
          </div>
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
      </header>

      {/* features section */}
      <section id="features" className="py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="text-center space-y-4 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-primary/20 bg-background/50"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Powerful Features
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold leading-tight"
            >
              Advanced Analytics
              <span className="block text-5xl mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Made Simple
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={cn(
                      "relative cursor-pointer transition-all duration-300",
                      activeFeature === index
                        ? "bg-primary/10 border-primary/20"
                        : "bg-background/50 border-primary/10 hover:bg-primary/5"
                    )}
                    onClick={() => setActiveFeature(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-3 rounded-lg transition-colors",
                            activeFeature === index
                              ? "bg-primary/20"
                              : "bg-primary/10"
                          )}
                        >
                          {React.createElement(feature.icon, {
                            className: "w-6 h-6 text-primary",
                          })}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "w-5 h-5 transition-transform",
                            activeFeature === index ? "rotate-90" : ""
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stats Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 blur-3xl rounded-full" />

              <Card className="relative bg-background/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-8">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <ActiveFeatureIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        {features[activeFeature].title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground">
                      {features[activeFeature].description}
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                      {features[activeFeature].stats.map((stat, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                        >
                          <div className="text-2xl font-bold text-primary">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full group">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
      </section>

      <section id="solutions" className="py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="text-center space-y-4 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-primary/20 bg-background/50"
              >
                <BarChart2 className="w-4 h-4 mr-2 text-primary" />
                Tailored Solutions
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold leading-tight"
            >
              Powerful Solutions for
              <span className="block text-5xl mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Every Industry
              </span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative h-full bg-background/50 backdrop-blur-sm border-primary/10 overflow-hidden group">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 rounded-lg bg-primary/10 w-fit">
                      <solution.icon className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold">{solution.title}</h3>
                    <p className="text-muted-foreground">
                      {solution.description}
                    </p>

                    <ul className="space-y-2">
                      {solution.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* <Button className="mt-4 w-full group" variant="outline">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button> */}

                    {/* <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${solution.gradient} transform origin-left scale-x-0 transition-transform group-hover:scale-x-100`}
                    /> */}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
      </section>

      {/* Survey Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-primary/20 bg-background/50"
            >
              <Radio className="w-4 h-4 mr-2 text-primary" />
              Analytics Survey
            </Badge>

            <h2 className="text-4xl font-bold leading-tight">
              Help Shape the Future of
              <span className="block text-5xl mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Broadcasting Analytics
              </span>
            </h2>

            <p className="text-xl text-muted-foreground">
              Your insights are valuable to us. Take our quick survey and help
              us improve our services.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-8"
            >
              <Card className="relative bg-background/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">
                            Broadcasting Industry Survey
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Estimated time: 5 minutes
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Radio className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* <div className="grid grid-cols-2 gap-4 py-4">
                        {surveyStats?.map((stat, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-primary/5 text-center"
                          >
                            <div className="text-primary font-bold">
                              {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div> */}

                    <a href="/survey">
                      <Button className="w-full group">
                        Take Survey
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
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
      </section>

      {/* PeopleMeter Section */}
      <section id="peoplemeter" className="py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Content Side */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium border-primary/20 bg-background/50 mb-8"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  Revolutionary Technology
                </Badge>

                <h2 className="text-4xl font-bold leading-tight">
                  Next Generation
                  <span className="block text-5xl mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    PeopleMeter Technology
                  </span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-muted-foreground"
              >
                Our revolutionary PeopleMeter device combines advanced AI and
                machine learning to deliver unparalleled accuracy in audience
                measurement, setting new industry standards.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[
                  {
                    icon: Users,
                    title: "Viewer Detection",
                    description: "Automated recognition with 90% accuracy",
                  },
                  {
                    icon: Zap,
                    title: "Real-time Data",
                    description: "Instant transmission and processing",
                  },
                  {
                    icon: Activity,
                    title: "Non-intrusive",
                    description:
                      "Seamless integration into viewing environment",
                  },
                  {
                    icon: LineChart,
                    title: "Smart Analytics",
                    description: "AI-powered viewing pattern analysis",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative p-6 rounded-lg bg-gradient-to-br from-background/80 to-background/40 border border-primary/10 backdrop-blur-sm group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex gap-4"
              >
                <Button size="lg" className="shadow-lg group">
                  Learn More
                  <motion.span whileHover={{ x: 4 }} className="ml-2">
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10"
                >
                  Request Demo
                </Button>
              </motion.div>
            </div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 blur-3xl rounded-full" />

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative bg-background/50 backdrop-blur-sm border-primary/10 overflow-hidden">
                  <CardContent className="p-2">
                    <div className="relative rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                      <img
                        src="/images/people_meter.png"
                        alt="PeopleMeter Device"
                        className="w-full h-1/2 object-cover rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -left-4 top-1/4 bg-background/50 backdrop-blur-sm border border-primary/10 p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">90% Accuracy</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -right-4 bottom-1/4 bg-background/50 backdrop-blur-sm border border-primary/10 p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      Real-time Analysis
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative grid pattern */}
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
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden" id="contact">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-6"
        >
          <Card className="relative border border-primary/10 shadow-2xl bg-background/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-white/[0.02]" />

            {/* Animated background gradients */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            </motion.div>

            <CardContent className="p-12 relative">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center"
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-1 text-sm font-medium border-primary/20 bg-background/50"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    Trusted by Industry Leaders
                  </Badge>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-4xl font-bold leading-tight">
                    Transform Your Analytics with
                    <span className="block text-5xl mt-2 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                      Intelligent Insights
                    </span>
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
                >
                  {[
                    {
                      icon: BarChart2,
                      title: "Advanced Analytics",
                      description:
                        "Real-time data processing and visualization",
                    },
                    {
                      icon: Globe,
                      title: "Global Coverage",
                      description:
                        "Worldwide audience measurement and insights",
                    },
                    {
                      icon: Sparkles,
                      title: "Real-time Insights",
                      description:
                        "Instant access to viewer behavior analytics",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="relative p-6 rounded-lg bg-gradient-to-br from-background/80 to-background/40 border border-primary/10 backdrop-blur-sm"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-semibold">{feature.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {feature.description}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl text-muted-foreground"
                >
                  Join the leading broadcasters and advertisers who are making
                  data-driven decisions with Indi-Visual Analytics.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex gap-6 justify-center items-center flex-wrap"
                >
                  <Button size="lg" className="shadow-lg group">
                    Schedule Demo
                    <motion.span whileHover={{ x: 4 }} className="ml-2">
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    Contact Sales
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/images/indi.png" alt="logo" className="h-20" />
              </div>
              <p className="text-muted-foreground">
                Leading the future of TV analytics and audience measurement.
              </p>
            </div>
            {[
              {
                title: "Solutions",
                links: ["Broadcasters", "Advertisers", "Brands", "Agencies"],
              },
              {
                title: "Resources",
                links: ["Blog", "Case Studies", "Documentation", "API"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Press"],
              },
            ].map((column, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-bold">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-16 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 INDI-VISUAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
