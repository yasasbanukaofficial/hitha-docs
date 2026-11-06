import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

async function testSearch() {
  const chrome = spawn('/usr/bin/chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1440,900',
    '--remote-debugging-port=9222',
    'http://localhost:4789/'
  ]);

  await new Promise(r => setTimeout(r, 3500));

  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');

    if (!pageTarget) {
      console.log('No page target found');
      chrome.kill();
      return;
    }

    const wsUrl = pageTarget.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const onMessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', onMessage);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', onMessage);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('DOM.enable');

    // Trigger keyboard '/'
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: '/',
      code: 'Slash',
      windowsVirtualKeyCode: 191
    });

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/tmp/qa_screens/search_modal_open.png', Buffer.from(shot.data, 'base64'));
    console.log('✅ Screenshot saved to /tmp/qa_screens/search_modal_open.png');

    ws.close();
  } catch (err) {
    console.error('Error testing search:', err);
  } finally {
    chrome.kill();
  }
}

testSearch();
