export default function Loading() {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-white dark:bg-gray-925">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-800">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-gray-100 dark:bg-gray-900" />
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-200 border-b border-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 dark:divide-gray-800 dark:border-gray-800">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-4 sm:p-6">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-900" />
            <div className="mt-4 h-7 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
      <div className="p-4 sm:p-6">
        <div className="h-80 animate-pulse rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40" />
      </div>
    </div>
  )
}
