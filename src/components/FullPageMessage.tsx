interface FullPageMessageProps {
  message: string;
  icon?: React.ReactNode;
}

export default function FullPageMessage({ message, icon }: FullPageMessageProps) {
  return <div className="flex-1 flex flex-col w-full items-center justify-center gap-2 select-none">
    <div className="text-5xl">
      {icon}
    </div>
    <div className="typography-regular">{message}</div>
  </div>
}