import {
  Cloud,
  MessageSquareText,
  FileText,
  History,
  Bookmark,
  Settings,
  SunMedium,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: MessageSquareText, label: "Chat", path: "/" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: History, label: "History", path: "/history" },
  { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col rounded-[30px] border border-white/70 bg-[#eef6ff]/90 p-4 shadow-[0_18px_50px_rgba(109,141,212,0.12)] backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 py-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#f8d9ef] shadow-[inset_0_-6px_10px_rgba(255,255,255,0.55),0_8px_20px_rgba(214,100,174,0.2)]">
          <Cloud className="h-5 w-5 text-[#ff6fa5]" />
        </div>

        <div className="flex items-center gap-1 text-[1.95rem] font-black leading-none">
          <span className="font-['Poppins'] text-[#f75f9a]">RAG</span>
          <span className="text-[#f4a2c7]">Chat</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-7 flex flex-col gap-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-[#f8dce5] text-[#ff5c96] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]"
                    : "text-[#4d5d7b] hover:bg-white/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${
                      isActive
                        ? "bg-[#fff7fa] text-[#ff5c96]"
                        : "bg-[#f4f7ff] text-[#7a8eb7]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="text-[1.02rem] font-medium">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Yomiko Card */}
      <div className="mt-auto rounded-[22px] border border-[#f8dfe8] bg-[#f8f2f6] p-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[2rem] shadow-[0_8px_20px_rgba(154,181,218,0.18)]">
          🐱
        </div>

        <p className="mt-3 text-lg font-semibold text-[#f95fa4]">
          Yomiko
        </p>

        <p className="mt-2 text-[12px] leading-5 text-[#7a89a6]">
          Upload a PDF and ask anything about your documents.
        </p>
      </div>

      {/* Theme Toggle */}
      <div className="mt-4 flex items-center justify-between rounded-[18px] bg-[#f6f9ff] px-3 py-2 text-sm text-[#586d8d] shadow-inner">
        <div className="flex items-center gap-2">
          <SunMedium className="h-4 w-4 text-[#f4a64b]" />
          <span>Light Mode</span>
        </div>

        <button className="relative h-7 w-12 rounded-full bg-[#1d2f46] p-1">
          <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;