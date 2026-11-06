import { spawn } from 'child_process';
import fs from 'fs';

const OUT_DIR = '/home/bezerk/.gemini/antigravity/brain/2f79ebe9-e1d0-4d78-b6b1-86079b0bebcb';

async function run() {
  const chrome = spawn('/usr/bin/chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1440,900',
    '--remote-debugging-port=9222',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');

    if (!pageTarget) {
      console.log('No page target found');
      chrome.kill();
      return;
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
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
    await send('Page.enable');

    // 1. PayHere Escrow Settlement
    console.log('Navigating to PayHere...');
    await send('Page.navigate', { url: 'http://localhost:4789/docs/financial/payhere-escrow-settlement' });
    await new Promise(r => setTimeout(r, 2500));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT_DIR}/qa_payhere_fixed.png`, Buffer.from(shot.data, 'base64'));
    console.log('Saved qa_payhere_fixed.png');

    // 2. Dual-Plane Logging
    console.log('Navigating to Dual-Plane Logging...');
    await send('Page.navigate', { url: 'http://localhost:4789/docs/logging-audit/dual-plane-architecture' });
    await new Promise(r => setTimeout(r, 2500));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT_DIR}/qa_dual_plane_fixed.png`, Buffer.from(shot.data, 'base64'));
    console.log('Saved qa_dual_plane_fixed.png');

    // 3. Search Modal Trigger via '/'
    console.log('Navigating to Home and opening Search Modal...');
    await send('Page.navigate', { url: 'http://localhost:4789/' });
    await new Promise(r => setTimeout(r, 2000));
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: '/',
      code: 'Slash',
      windowsVirtualKeyCode: 191
    });
    await new Promise(r => setTimeout(r, 800));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT_DIR}/qa_search_modal_fixed.png`, Buffer.from(shot.data, 'base64'));
    console.log('Saved qa_search_modal_fixed.png');

    // 4. Dictionary
    console.log('Navigating to Dictionary...');
    await send('Page.navigate', { url: 'http://localhost:4789/docs/reference/technical-terms-dictionary' });
    await new Promise(r => setTimeout(r, 2500));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT_DIR}/qa_dictionary_fixed.png`, Buffer.from(shot.data, 'base64'));
    console.log('Saved qa_dictionary_fixed.png');

    ws.close();
  } catch (err) {
    console.error('Error during QA captures:', err);
  } finally {
    chrome.kill();
  }
}

run();
