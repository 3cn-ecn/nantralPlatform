import { PrimaryButton } from '#shared/components/Button/PrimaryButton';

import { SidebarBox } from './SidebarBox';

export function OfflineFooter() {
  return (
    <SidebarBox>
      <p className="mb-2 uppercase text-xs">Already have an account?</p>
      <p className="mb-4">
        Retrouve tes espaces, événements et associations depuis un seul endroit.
      </p>
      <PrimaryButton fullWidth={true}>Se connecter</PrimaryButton>
    </SidebarBox>
  );
}
