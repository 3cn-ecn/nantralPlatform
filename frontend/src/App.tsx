import React from 'react';
import { useTranslation } from 'react-i18next';
import './App.scss';

function App() {
  const { t } = useTranslation();
  return (
    <div className="App">
      <header className="App-header">
        <img src='/static/img/logo/' className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('learn')}
        </a>
      </header>
    </div>
  );
}

export default App;
