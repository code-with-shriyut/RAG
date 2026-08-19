import Sidebar from "../sidebar/Sidebar";

type AppLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AppLayout = ({ title, subtitle, children }: AppLayoutProps) => {
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-[#EEF7FF] via-[#A8BDF8] to-[#F8A7CE] p-4">
      <div className="flex h-full gap-6">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col rounded-[36px] border border-white/60 bg-white/45 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(255,182,213,0.12)]">
          {/* Page Header */}
          <div className="shrink-0">
            <h1 className="text-4xl font-bold text-slate-700">{title}</h1>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>

          {/* Dynamic Content */}
          <div className="mt-6 min-h-0 flex-1">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default AppLayout;