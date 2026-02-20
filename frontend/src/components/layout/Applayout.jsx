import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children, title }) {
  return (
    <div className="flex min-h-screen
      bg-lightBg dark:bg-darkBg
      text-lightText dark:text-darkText
      transition-colors duration-500"
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar title={title} />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}