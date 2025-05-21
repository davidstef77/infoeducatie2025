export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p className="text-gray-600 font-medium animate-pulse">Se încarcă...</p>
    </div>
  );
}