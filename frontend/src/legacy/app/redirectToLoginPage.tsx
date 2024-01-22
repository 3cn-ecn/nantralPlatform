import ReactDOM from 'react-dom/client';

async function redirectToLoginPage(): Promise<void> {
  const current_url = window.location.pathname;
  fetch('/doihavetologin?path=' + current_url)
    .then((resp) =>
      resp.json().then((data) => {
        const havetologin = data;
        if (havetologin) {
          window.open('/account/login?next=' + current_url, '_self');
        }
      }),
    )
    .catch(() => {
      const root = ReactDOM.createRoot(
        document.getElementById('footer-offline') as HTMLElement,
      );
      root.render(<div className="offline">Mode Hors-Connexion</div>);
    });
}

export default redirectToLoginPage;
