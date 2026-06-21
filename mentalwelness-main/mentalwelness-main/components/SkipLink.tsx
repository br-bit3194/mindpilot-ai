export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-indigo-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
}
