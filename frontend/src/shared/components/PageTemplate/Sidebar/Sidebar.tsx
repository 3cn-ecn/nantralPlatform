import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import {
  ChatBubbleOutline as FeedbackIcon,
  EventNoteOutlined as EventIcon,
  GroupsOutlined as GroupIcon,
  HomeOutlined as HomeIcon,
  MapOutlined as MapIcon,
  SchoolOutlined as StudentIcon,
  DrawOutlined as SignatureIcon,
} from '@mui/icons-material';

import { useAuth } from '#shared/context/Auth.context';

import { LegalFooter } from './components/LegalFooter';
import { OfflineFooter } from './components/OfflineFooter';
import { SidebarButton } from './components/SidebarButton';

interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
  matches: (pathname: string) => boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Accueil',
    path: '/',
    icon: <HomeIcon fontSize="small" />,
    matches: (pathname) => pathname === '/',
  },
  {
    label: 'Campus Map',
    path: '/map?type=colocs',
    icon: <MapIcon fontSize="small" />,
    matches: (pathname) => pathname.startsWith('/map'),
  },
  {
    label: 'Événements',
    path: '/event',
    icon: <EventIcon fontSize="small" />,
    matches: (pathname) => pathname.startsWith('/event'),
  },
  {
    label: 'Associations',
    path: '/group',
    icon: <GroupIcon fontSize="small" />,
    matches: (pathname) => pathname.startsWith('/group'),
  },
  {
    label: 'Étudiants',
    path: '/student',
    icon: <StudentIcon fontSize="small" />,
    matches: (pathname) => pathname.startsWith('/student'),
  },
  {
    label: 'Feedback',
    path: '/feedback',
    icon: <FeedbackIcon fontSize="small" />,
    matches: (pathname) => pathname.startsWith('/feedback'),
  },
  {
    label: 'Signature',
    path: '/signature',
    icon: <SignatureIcon fontSize="small" />,
    matches: (pathname) => pathname.startsWith('/signature'),
  },
];

export function Sidebar({
  open,
  defaultWidth,
}: Readonly<{ open: boolean; defaultWidth: number }>) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <aside
      style={{ width: open ? `${defaultWidth}px` : '0px' }}
      className={`
        absolute lg:relative lg:z-auto z-10 bottom-0 h-full overflow-hidden
        border-r border-solid border-r-[rgba(255,255,255,0.65)]
        bg-gradient-to-b from-(--sidebar-background) to-(--app-background)
        shadow-[inset_-1px_0_0_rgba(255,255,255,0.35)]
        transition-[width] duration-300 ease-in-out
      `}
    >
      <div
        className={`
          w-[279px] h-full min-h-0 flex flex-col overflow-y-auto
          transition-opacity duration-200 ease-in-out
          ${open ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Navigation items */}
        <div className="flex-1 mt-4 px-3 relative">
          <ul className="flex flex-col gap-3 p-0 m-0 list-none">
            {sidebarItems.map((item) => {
              const selected = item.matches(pathname);

              return (
                <SidebarButton
                  key={item.path}
                  to={item.path}
                  selected={selected}
                  labelReference={item.label}
                  icon={item.icon}
                />
              );
            })}
          </ul>
        </div>

        {/* Sidebar footer */}
        <div className="pb-10">
          {!isAuthenticated && <OfflineFooter />}
          <LegalFooter />
        </div>
      </div>
    </aside>
  );
}
