import WorkspaceDropdown from "../components/dropdown/WorkspaceDropdown";
import CenteredMessage from "../components/CenteredMessage";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <WorkspaceDropdown />
      <CenteredMessage icon='😴' message="No tasks yet!" />
      <div>

      </div>
    </div>
  )
}