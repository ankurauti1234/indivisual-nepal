"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserIcon,
  HomeIcon,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Users,
} from "lucide-react";

// Import the question data
import householdQuestions from "./household-questions.json";
import memberQuestions from "./member-questions.json";

const HouseholdSurvey = () => {
  const [step, setStep] = useState("initial");
  const [householdId, setHouseholdId] = useState("");
  const [householdData, setHouseholdData] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [error, setError] = useState("");
  const [currentHouseholdStep, setCurrentHouseholdStep] = useState(1);
  const [householdFormData, setHouseholdFormData] = useState({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalSteps = Object.keys(householdQuestions).length + memberCount;
    const completedSteps =
      currentHouseholdStep - 1 + members.filter(Boolean).length;
    setProgress((completedSteps / totalSteps) * 100);
  }, [currentHouseholdStep, members, memberCount]);

  const generateHouseholdId = () => {
    const id = "HH" + Math.random().toString(36).substr(2, 6).toUpperCase();
    setHouseholdId(id);
    setStep("household");
  };

  const handleHouseholdStepSubmit = (e, isSkipping = false) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newData = Object.fromEntries(formData.entries());

    setHouseholdFormData((prev) => ({
      ...prev,
      ...newData,
    }));

    if (currentHouseholdStep === Object.keys(householdQuestions).length) {
      const finalData = {
        ...householdFormData,
        ...newData,
        id: householdId,
      };
      setHouseholdData(finalData);
      const selectedMemberCount = parseInt(finalData.memberCount || "1");
      setMemberCount(selectedMemberCount);
      setMembers(new Array(selectedMemberCount).fill(null));
      setStep("members");
    } else {
      setCurrentHouseholdStep((prev) => prev + 1);
    }

    // If skipping, ensure member count is set
    if (isSkipping && currentHouseholdStep === 1) {
      const selectedMemberCount = parseInt(newData.memberCount || "1");
      setMemberCount(selectedMemberCount);
      setMembers(new Array(selectedMemberCount).fill(null));
    }
  };

  const handleMemberSubmit = (data) => {
    const newMembers = [...members];
    newMembers[currentMember - 1] = {
      ...data,
      name: data.name || `Member ${currentMember}`,
    };
    setMembers(newMembers);
    setCurrentMember(null);
  };

  const handleFinalSubmit = () => {
    const finalData = {
      household: householdData,
      members: members,
    };
    console.log("Complete survey data:", finalData);
    setShowSuccessDialog(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const renderInitialStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8"
    >
      <div className="relative w-32 h-32 mx-auto">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        />
        <HomeIcon className="w-20 h-20 text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <h2 className="text-4xl font-bold text-foreground">Household Survey</h2>
      <p className="text-xl text-muted-foreground max-w-md mx-auto">
        Embark on a journey to understand your household better. Your insights
        shape our community.
      </p>
      <Button
        size="lg"
        onClick={generateHouseholdId}
        className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground text-lg py-6 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Start Your Household Journey
      </Button>
    </motion.div>
  );

  const renderHouseholdForm = () => {
    const sections = Object.entries(householdQuestions);
    const currentSection = sections[currentHouseholdStep - 1];

    if (!currentSection) return null;

    const [sectionKey, sectionData] = currentSection;

    return (
      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleHouseholdStepSubmit}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">
            Household ID: {householdId}
          </h3>
          <p className="text-sm text-muted-foreground">
            Step {currentHouseholdStep} of {sections.length}
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent p-6">
            <h4 className="text-3xl font-semibold text-primary-foreground">
              {sectionData.title}
            </h4>
          </div>
          <CardContent className="p-6 bg-card">
            <div className="space-y-6">
              {sectionData.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label
                    htmlFor={question.id}
                    className="text-lg font-medium text-gray-700"
                  >
                    {question.label}
                  </Label>
                  <Select
                    name={question.id}
                    required={!sectionData.skipable}
                    defaultValue={householdFormData[question.id]}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={`Select ${question.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          {currentHouseholdStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentHouseholdStep((prev) => prev - 1)}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          <div className="flex-1 mx-4">
            <Progress value={progress} className="w-full" />
          </div>
          <div className="flex space-x-2">
            {sectionData.skipable && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleHouseholdStepSubmit(e, true)}
                className="flex items-center"
              >
                Skip
              </Button>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center"
            >
              {currentHouseholdStep === sections.length
                ? "Continue to Member Details"
                : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.form>
    );
  };

  const renderMembersStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">
          Household Members
        </h3>
        <p className="text-sm text-muted-foreground">
          {members.filter(Boolean).length} of {memberCount} members completed
        </p>
      </div>

      {currentMember ? (
        <MemberForm
          memberNumber={currentMember}
          onSubmit={handleMemberSubmit}
          onBack={() => setCurrentMember(null)}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: memberCount }, (_, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="link"
                  className={`w-full h-auto py-8 px-4 relative bg-card shadow-lg rounded-xl border-2 transition-all duration-300 ${
                    members[index]
                      ? "border-green-500 hover:border-green-600"
                      : "border-muted hover:border-primary"
                  }`}
                  onClick={() => setCurrentMember(index + 1)}
                >
                  <div className="flex flex-col items-center space-y-4 relative">
                    {members[index] ? (
                      <div className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                        <motion.div
                          className="absolute inset-0 bg-green-500 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative w-16 h-16">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-80"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 4,
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: Infinity,
                          }}
                        />
                        <UserIcon className="w-10 h-10 text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    )}
                    <div className="text-center">
                      <span className="text-lg font-medium text-foreground block">
                        {members[index]
                          ? members[index].name || `Member ${index + 1}`
                          : `Member ${index + 1}`}
                      </span>
                      {members[index] && (
                        <span className="text-sm text-green-600 mt-1 block">
                          Details Complete
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {members.filter(Boolean).length === memberCount && (
            <Button
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground text-lg py-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={handleFinalSubmit}
            >
              Submit Complete Household Survey
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl shadow-2xl overflow-hidden">
        <CardContent className="p-8 bg-card">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {step === "initial" && renderInitialStep()}
            {step === "household" && renderHouseholdForm()}
            {step === "members" && renderMembersStep()}
          </AnimatePresence>
        </CardContent>
      </Card>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Survey Completed Successfully
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-8"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                }}
              />
              <CheckCircle className="w-16 h-16 text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-2xl font-semibold text-foreground mb-4">
              Thank you for completing the survey!
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Your responses have been recorded and will help shape our
              community.
            </p>
            <Button
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground text-lg py-4 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => {
                setShowSuccessDialog(false);
                // Reset the form here
                setStep("initial");
                setHouseholdId("");
                setHouseholdData(null);
                setMemberCount(0);
                setMembers([]);
                setCurrentMember(null);
                setCurrentHouseholdStep(1);
                setHouseholdFormData({});
              }}
            >
              Start New Survey
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MemberForm = ({ memberNumber, onSubmit, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  // Add basic member details to first step
  const basicDetails = {
    title: "Basic Details",
    questions: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "age",
        label: "Age",
        type: "text",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
          { value: "prefer_not_to_say", label: "Prefer not to say" },
        ],
      },
    ],
    skipable: false,
  };

  // Combine basic details with other member questions
  const steps = [
    basicDetails,
    ...Object.entries(memberQuestions).map(([key, value]) => ({
      title: value.title,
      fields: value.questions,
      skipable: value.skipable,
    })),
  ];

  const handleStepSubmit = (e) => {
    e.preventDefault();
    const newData = new FormData(e.target);
    setFormData((prev) => ({
      ...prev,
      ...Object.fromEntries(newData.entries()),
    }));

    if (step === steps.length) {
      onSubmit({
        ...formData,
        ...Object.fromEntries(newData.entries()),
      });
    } else {
      setStep((prev) => prev + 1);
      setActiveTab((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
    setActiveTab((prev) => prev - 1);
  };

  const handleSkip = () => {
    setStep((prev) => prev + 1);
    setActiveTab((prev) => prev + 1);
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            name={field.name}
            required={!steps[step - 1].skipable && field.required}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
            defaultValue={formData[field.name] || ""}
          />
        );
      case "select":
        return (
          <Select
            name={field.name}
            required={!steps[step - 1].skipable && field.required}
            defaultValue={formData[field.name]}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
        </Button>
        <h3 className="text-2xl font-bold text-foreground">
          Member {memberNumber} Details
        </h3>
      </div>

      <Tabs
        value={steps[activeTab].title}
        onValueChange={(value) =>
          setActiveTab(steps.findIndex((s) => s.title === value))
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {steps.map((s, index) => (
            <TabsTrigger
              key={s.title}
              value={s.title}
              disabled={index + 1 > step}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {s.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((s, index) => (
          <TabsContent key={s.title} value={s.title}>
            <Card>
              <CardContent className="p-6 bg-card">
                <form onSubmit={handleStepSubmit} className="space-y-6">
                  {s.questions
                    ? s.questions.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label
                            htmlFor={field.name}
                            className="text-lg font-medium text-gray-700"
                          >
                            {field.label}
                          </Label>
                          {renderField(field)}
                        </div>
                      ))
                    : s.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label
                            htmlFor={field.name}
                            className="text-lg font-medium text-gray-700"
                          >
                            {field.label}
                          </Label>
                          {renderField(field)}
                        </div>
                      ))}
                  <div className="flex justify-between pt-4">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                    )}
                    <div className="flex space-x-2 ml-auto">
                      {s.skipable && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSkip}
                          className="flex items-center"
                        >
                          Skip
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center"
                      >
                        {index === steps.length - 1
                          ? "Save Member Details"
                          : "Next"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

// // In the member card section of renderMembersStep, update the display to show name:
// <span className="text-lg font-medium text-foreground block">
//   {members[index]
//     ? members[index].name || `Member ${index + 1}`
//     : `Member ${index + 1}`}
// </span>;
// {
//   members[index] && (
//     <span className="text-sm text-green-600 mt-1 block">Details Complete</span>
//   );
// }


export default HouseholdSurvey;
