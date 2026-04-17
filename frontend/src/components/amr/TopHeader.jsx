import React, { useEffect, useState } from "react";
import { Search, Bell, Moon, Info, ChevronRight } from "lucide-react";

export const TopHeader = ({ breadcrumb = ["Pages", "Dashboard"], title = "Fleet Operations" }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hhmmss = time.toLocaleTimeString("en-GB");

  return (
    <header
      data-testid="top-header"
      className="sticky top-0 z-40 px-4 md:px-6 pt-4 pb-4 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                <span className={i === breadcrumb.length - 1 ? "text-[#00C2FF]" : ""}>
                  {b}
                </span>
                {i < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
              </React.Fragment>
            ))}
          </div>
          <h1
            data-testid="page-title"
            className="text-2xl md:text-3xl xl:text-[34px] font-extrabold tracking-tight text-white whitespace-nowrap leading-tight"
          >
            {title}
          </h1>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {/* Live clock */}
          <div
            data-testid="live-clock"
            className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/[0.02]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2FF] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00C2FF]" />
            </span>
            <span className="font-mono text-xs text-slate-300 tabular-nums tracking-wider">
              {hhmmss}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              UTC
            </span>
          </div>

          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              data-testid="header-search"
              placeholder="Search robots, tasks…"
              className="w-52 h-9 pl-9 pr-3 rounded-full bg-white/[0.03] border border-white/10
                         text-[13px] text-slate-200 placeholder:text-slate-500
                         focus:outline-none focus:border-[#0066FF]/60 focus:bg-white/[0.05]
                         transition-all"
            />
          </div>

          <IconBtn testid="notifications-btn">
            <Bell className="h-4 w-4" strokeWidth={1.6} />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#0A0A0B]" />
          </IconBtn>
          <IconBtn testid="theme-btn">
            <Moon className="h-4 w-4" strokeWidth={1.6} />
          </IconBtn>
          <IconBtn testid="info-btn">
            <Info className="h-4 w-4" strokeWidth={1.6} />
          </IconBtn>

          {/* Avatar */}
          <div
            data-testid="user-avatar"
            className="ml-1 h-9 w-9 rounded-full bg-gradient-to-br from-[#0066FF] to-[#001A4D] flex items-center justify-center ring-2 ring-white/10"
          >
            <span className="text-[11px] font-extrabold text-white">NH</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const IconBtn = ({ children, testid }) => (
  <button
    data-testid={testid}
    className="relative h-9 w-9 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#0066FF]/40 hover:bg-[#0066FF]/10 transition-all"
  >
    {children}
  </button>
);

export default TopHeader;
