import StatCard from "../components/StatCard";

export default function StatsPage() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <h1 className="typography-large select-none">Your Journey</h1>
      <StatCard title="Tasks Done" icon="✅" value={100} />
      <StatCard title="Day Streak" icon="🔥" value={100} />
    </div>
  )
}