import WorkspaceDropdown from "../components/dropdown/WorkspaceDropdown";
import FullPageMessage from "../components/FullPageMessage";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full h-full">
      <WorkspaceDropdown />
      <FullPageMessage icon='😴' message="No tasks yet!" />
    </div>
  )
}