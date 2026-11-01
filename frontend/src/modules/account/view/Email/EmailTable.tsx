import { Paper, Table, TableBody, TableContainer } from '@mui/material';

import { Email } from '#modules/account/email.type';
import { EmailRowSkeleton } from '#modules/account/view/Email/EmailRowSkeleton';

import { EmailRow } from './EmailRow';

export function EmailTable({
  emails,
  isPending,
  setSelectedEmail,
  changeVisibility,
  setAnchorEl,
}: {
  emails?: Email[];
  isPending: boolean;
  setSelectedEmail: (email: Email) => void;
  changeVisibility: (emailUuid: string, isVisible: boolean) => void;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {isPending ? (
            <EmailRowSkeleton />
          ) : (
            emails?.map((email) => (
              <EmailRow
                email={email}
                key={email.uuid}
                setSelectedEmail={setSelectedEmail}
                changeVisibility={changeVisibility}
                setAnchorEl={setAnchorEl}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
