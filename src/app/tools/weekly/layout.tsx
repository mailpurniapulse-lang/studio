export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center w-full">
      {children}
    </section>
  );
}
