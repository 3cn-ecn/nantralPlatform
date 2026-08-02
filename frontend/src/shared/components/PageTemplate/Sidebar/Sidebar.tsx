import { ReactNode, useEffect } from 'react';
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

  useEffect(() => {
    const logBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint = 'sm';

      if (width >= 1536) {
        breakpoint = '2xl';
      } else if (width >= 1280) {
        breakpoint = 'xl';
      } else if (width >= 1024) {
        breakpoint = 'lg';
      } else if (width >= 768) {
        breakpoint = 'md';
      }

      console.log('[Sidebar] breakpoint:', breakpoint, `(${width}px)`);
    };

    logBreakpoint();
    window.addEventListener('resize', logBreakpoint);

    return () => window.removeEventListener('resize', logBreakpoint);
  }, []);

  const sidebarWidth = open ? `${defaultWidth}px` : '0px';

  return (
    <aside
      className={`
        absolute inset-y-0 left-0 z-30 overflow-hidden border-r-2
        border-white bg-[#eef2f7] text-slate-700
        shadow-[inset_-1px_0_0_rgba(255,255,255,0.62)]
        transition-[width] duration-300 ease-in-out
        lg:relative lg:z-auto lg:shrink-0
      `}
      style={{ width: sidebarWidth }}
    >
      <div
        className={`
          flex h-full min-h-0 w-[280px] flex-col overflow-y-auto
          bg-[#eef2f7] transition-opacity duration-200 ease-in-out
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex-1 px-3 pt-4">
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
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

        <div className="pb-10">
          {!isAuthenticated && <OfflineFooter />}
          <LegalFooter />
        </div>
      </div>
    </aside>
  );
}
