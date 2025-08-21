export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-30">
      {children}
    </div>
  );
}
