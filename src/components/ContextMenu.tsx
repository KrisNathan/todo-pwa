// import { MdDelete, MdEdit, MdShare } from "react-icons/md";

// const menuItems: MenuItem[] = [
//   {
//     label: 'Edit',
//     onClick: () => {
//       console.log('Edit');
//       onClose();
//     },
//     icon: <MdEdit size={20} />
//   },
//   {
//     label: 'Delete',
//     onClick: () => {
//       console.log('Delete');
//       onClose();
//     },
//     icon: <MdDelete size={20} />
//   },
//   {
//     label: 'Share',
//     onClick: () => {
//       console.log('Share');
//       onClose();
//     },
//     icon: <MdShare size={20} />
//   },
// ];

export interface MenuItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const MenuButton = ({ label, onClick, icon }: MenuItem) => (
  <button
    className="w-full text-left px-4 py-2 hover:bg-bg-secondary-hover active:animate-(--anim-click) rounded-2xl flex flex-row gap-2 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) {
        onClick();
      }
    }}
  >
    {icon || <></>}
    {label}
  </button>
)

const DesktopMenu = ({ items, position, onClose }: { items: MenuItem[]; position?: { x: number; y: number }, onClose: () => void }) => {
  const menuWidth = 192; // min-w-48 = 12rem = 192px
  const menuHeight = items.length * 44 + 16; // Approximate height based on items

  let left = position?.x || 0;
  let top = (position?.y || 0) - 10;
  let transform = 'translate(-50%, -100%)';

  // Adjust horizontal position if menu would go off-screen
  if (left - menuWidth / 2 < 10) {
    left = 10;
    transform = 'translate(0, -100%)';
  } else if (left + menuWidth / 2 > window.innerWidth - 10) {
    left = window.innerWidth - 10;
    transform = 'translate(-100%, -100%)';
  }

  // Adjust vertical position if menu would go off-screen
  if (top - menuHeight < 10) {
    top = (position?.y || 0) + 10;
    transform = transform.replace('-100%', '0');
  }

  return (
    <div
      className="hidden md:block bg-bg-secondary p-1 rounded-2xl shadow-2xl min-w-48"
      style={{
        position: 'fixed',
        left,
        top,
        transform
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <MenuButton
              label={item.label}
              icon={item.icon}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                }
                onClose();
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const MobileDrawer = ({ items, onClose }: { items: MenuItem[], onClose: () => void }) => (
  <div
    className="bg-bg-secondary p-4 shadow-lg rounded-t-2xl w-full max-w-md mb-0"
    onClick={(e) => e.stopPropagation()}
  >
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index}>
          <MenuButton
            label={item.label}
            icon={item.icon}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              onClose();
            }}
          />
        </li>
      ))}
    </ul>
  </div>
)

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
  items: MenuItem[];
}

export default function ContextMenu({ isOpen, onClose, position, items }: ContextMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="hidden md:block fixed inset-0 z-50" onClick={onClose}>
        <DesktopMenu items={items} position={position} onClose={onClose} />
      </div>
      <div className="md:hidden fixed inset-0 flex items-end justify-center bg-black/50 z-50" onClick={onClose}>
        <MobileDrawer items={items} onClose={onClose} />
      </div>
    </>
  );
}