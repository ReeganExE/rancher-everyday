export default () => {
  const s = document.createElement('script');
  if (process.env.BROWSER === 'firefox') {
    s.src = browser.extension.getURL('exec.js');
  } else {
    s.src = chrome.extension.getURL('exec.js');
  }

  s.onload = () => {
    s.remove();
  };

  (document.head || document.documentElement).appendChild(s);
};
