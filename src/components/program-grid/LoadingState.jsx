const LoadingState = () => (
  <div className="flex items-center justify-center h-full bg-zinc-100/50 dark:bg-zinc-900/50">
    <div className="flex flex-col items-center">
      <svg
        className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      <span className="mt-2 text-zinc-600 dark:text-zinc-400">Loading...</span>
    </div>
  </div>
);

export default LoadingState;