import { Link } from 'react-router-dom';

export function LegalFooter() {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase text-11px">
        AECN - Tous droits réservés
      </p>
      <div className="flex flex-row items-center justify-center text-inherit no-underline">
        <p className="mx-4 text-sm">
          <Link to="/legal-notice/" className="mx-[5px] text-inherit">
            À propos
          </Link>
          -
          <Link
            to="https://docs.nantral-platform.fr/"
            className="mx-[5px] text-inherit"
          >
            Docs
          </Link>
        </p>
      </div>
    </div>
  );
}
