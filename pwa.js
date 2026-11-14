(() => {
  'use strict';
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  const bar = document.createElement('aside');
  bar.setAttribute('aria-label', 'Noor app installation and offline status');
  bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:10000;max-width:540px;margin:auto;padding:12px 16px;background:#143e30;color:#fff;border:1px solid #b99b55;border-radius:14px;box-shadow:0 4px 24px #0005;font:14px system-ui;display:none;align-items:center;gap:12px;';
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  status.style.flex = '1';
  const install = document.createElement('button');
  install.textContent = 'Install'; install.hidden = true;
  const close = document.createElement('button');
  close.textContent = '×'; close.setAttribute('aria-label', 'Dismiss app status');
  for (const button of [install, close]) button.style.cssText = 'font:inherit;color:#fff;background:#245d47;border:1px solid #729381;border-radius:8px;padding:6px 10px;cursor:pointer;';
  bar.append(status, install, close); document.body.append(bar);
  let dismissed = false;
  let promptEvent = null;
  let ready = false;
  const show = message => { status.textContent = message; if (!dismissed) bar.style.display = 'flex'; };
  const update = () => {
    if (!navigator.onLine) show(ready ? 'Offline: Quran text, duas and saved content are available. Audio, AI and fresh prayer times need internet.' : 'Offline setup is not complete. Connect once to download core content.');
    else if (ready) show('Core content is ready offline. Audio, AI and live services need internet.');
  };
  close.addEventListener('click', () => { dismissed = true; bar.style.display = 'none'; });
  window.addEventListener('online', update); window.addEventListener('offline', () => { dismissed = false; update(); });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event; install.hidden = false;
    if (!ready) show('Install Noor for quick access from your home screen.'); else update();
  });
  install.addEventListener('click', async () => {
    if (!promptEvent) return;
    await promptEvent.prompt(); await promptEvent.userChoice;
    promptEvent = null; install.hidden = true;
  });
  window.addEventListener('appinstalled', () => { promptEvent = null; install.hidden = true; });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope: './', updateViaCache: 'none'})
      .then(() => navigator.serviceWorker.ready)
      .then(() => { ready = true; update(); })
      .catch(error => { console.warn('Noor offline setup failed:', error); show('Offline setup could not finish. Reopen Noor online to retry.'); });
  });
})();
