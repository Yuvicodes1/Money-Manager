import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children, title }) {
  return (
    <div
      className="min-h-screen
      bg-lightBg dark:bg-darkBg
      text-lightText dark:text-darkText
      transition-colors duration-500"
    >
      {/* ── On mobile: Sidebar stacks on top as a header+dropdown ─────────
           On desktop: Sidebar sits in a flex row alongside main content ── */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar is hidden on mobile since Sidebar renders its own top bar */}
          <div className="hidden md:block">
            <Topbar title={title} />
          </div>

          {/* Mobile page title */}
          <div className="md:hidden px-5 py-3 border-b
            border-gray-200 dark:border-darkBorder
            bg-white dark:bg-darkCard"
          >
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>

          <main className="flex-1 p-5 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}