"use client";


interface ErrorHandlerProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export default function ErrorHandler({ error, resetErrorBoundary }: ErrorHandlerProps) {



  return (
    <div className="flex flex-col items-center justify-center w-lg mx-auto p-5 border border-red-500 bg-red-50 rounded-md m-5">
      <h2 className="text-xl font-bold text-red-700 mb-8 animate-ping">Something Went Wrong</h2>
      <p className="text-red-600 mb-4">{error instanceof Error ? error.message : String(error)}</p>
      <button onClick={resetErrorBoundary} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reset</button>
    </div>
  );
}