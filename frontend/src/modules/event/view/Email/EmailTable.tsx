import { Paper, Table, TableBody, TableContainer } from '@mui/material';

import { Email } from '#modules/account/email.type';
import { EmailRowSkeleton } from '#modules/event/view/Email/EmailRowSkeleton';

import { EmailRow } from './EmailRow';

export function EmailTable({
  emails,
  isLoading,
  setDeleteModalEmail,
  setNewMainEmail,
}: {
  emails?: Email[];
  isLoading: boolean;
  setDeleteModalEmail: (email: Email) => void;
  setNewMainEmail: (email: Email) => void;
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
                key={email.id}
                setDeleteModalEmail={setDeleteModalEmail}
                setNewMainEmail={setNewMainEmail}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
