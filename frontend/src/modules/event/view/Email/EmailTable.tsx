import { Paper, Table, TableBody, TableContainer } from '@mui/material';

import { Email } from '#modules/account/email.type';
import { EmailRowSkeleton } from '#modules/event/view/Email/EmailRowSkeleton';

import { EmailRow } from './EmailRow';

export function EmailTable({
  emails,
  isLoading,
  setDeleteModalEmail,
  setNewMainEmail,
  changeVisibility,
}: {
  emails?: Email[];
  isLoading: boolean;
  setDeleteModalEmail: (email: Email) => void;
  setNewMainEmail: (email: Email) => void;
  changeVisibility: (emailUuid: string, isVisible: boolean) => void;
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {isLoading ? (
            <EmailRowSkeleton />
          ) : (
            emails?.map((email) => (
              <EmailRow
                email={email}
                key={email.uuid}
                setDeleteModalEmail={setDeleteModalEmail}
                setNewMainEmail={setNewMainEmail}
                changeVisibility={changeVisibility}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
