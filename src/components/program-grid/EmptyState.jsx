import { Button } from "@/components/ui/button";

const EmptyState = ({ onGoToNearestDate }) => (
  <div className="flex flex-col items-center justify-center h-full bg-zinc-100 dark:bg-zinc-900 text-center p-8">
    <svg
      className="w-16 h-16 text-zinc-400 dark:text-zinc-600 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 17v-6h6v6m-3-6v6m-9 3h18M4 6h16M4 10h16"
      />
    </svg>
    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
      No Programs Available
    </h2>
    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
      There are no programs scheduled for this date.
    </p>
    <Button
      onClick={onGoToNearestDate}
      className="bg-indigo-600 hover:bg-indigo-700 text-white"
    >
      Go to Nearest Date with Data
    </Button>
  </div>
);

export default EmptyState;