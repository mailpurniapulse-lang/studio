export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center w-full">
           <div className="w-full overflow-x-auto px-4 md:px-8">
        <div className="min-w-[1200px] max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
