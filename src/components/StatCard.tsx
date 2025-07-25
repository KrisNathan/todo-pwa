interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-row gap-2 p-4 bg-secondary rounded-xl select-none items-center">
      <div className="typography-large">{icon}</div>
      <div className="flex-1 flex flex-col">
        <div className="typography-regular">{value}</div>
        <div className="typography-small text-text-secondary">{title}</div>
      </div>
    </div>
  )
}