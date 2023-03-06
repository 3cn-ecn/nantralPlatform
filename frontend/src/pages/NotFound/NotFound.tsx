import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
/**
 * The 404 error page when the requested page is not found.
 *
 * @returns The NotFound component
 */
function NotFound() {
  return (
    <Box className="container">
      <Box
        sx={{
          borderWidth: 2,
          borderColor: 'red',
          border: '2px dashed red',
          padding: 2,
        }}
      >
        <h1 className="card-title">Erreur 404 - Page introuvable</h1>
        <p className="card-text">
          Désolé, il semblerait que cette page n&#39;existe pas...
        </p>
      </Box>
      <p>
        Ce que vous pouvez faire maintenant :
        <ul>
          <li>
            Si vous pensez que c&#39;est un bug, vous pouvez{' '}
            <Link to="/">nous le signaler ici</Link>
          </li>
          <li>
            Sinon, retournez à la page d&#39;accueil en cliquant sur le mouton :
          </li>
        </ul>
      </p>
      <Link to="/">
        <img
          alt=""
          src="/static/img/sheep.png"
          width={130}
          height={130}
          style={{ margin: 20 }}
        />
      </Link>
    </Box>
  );
}

export default NotFound;
