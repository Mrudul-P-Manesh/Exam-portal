import { useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';

export const useAntiCheat = (isActive) => {
  const eventsQueue = useRef([]);
  const flushQueue = useCallback(() => {
    if (!isActive || eventsQueue.current.length === 0) return;

    const payload = { events: [...eventsQueue.current] };
    eventsQueue.current = [];

    api.post('/log-event', payload).catch(() => {
      eventsQueue.current = [...payload.events, ...eventsQueue.current];
      console.error("Failed to sync anti-cheat logs.");
    });
  }, [isActive]);

  const logEvent = useCallback((type, metadata = {}) => {
    if (!isActive) return;
    
    eventsQueue.current.push({
      type,
      metadata,
      timestamp: Date.now()
    });
  }, [isActive]);

  // Sync loop
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      flushQueue();
    }, 5000); // 5 seconds

    return () => {
      clearInterval(interval);
      flushQueue();
    };
  }, [isActive, flushQueue]);

  useEffect(() => {
    if (!isActive) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(()=>{});
      }
      return;
    }

    // Force Fullscreen
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          logEvent('fullscreen_fail', { reason: err.message });
        });
      }
    };
    enterFullscreen();

    // Handlers
    const handleContextMenu = (e) => {
      e.preventDefault();
      logEvent('context_menu', { target: e.target.tagName });
    };

    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        logEvent('devtools_attempt', { key: 'F12' });
      }
      // Ctrl+Shift+I / J / C
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        logEvent('devtools_attempt', { key: `Ctrl+Shift+${e.key}` });
      }
      // Ctrl+U
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        logEvent('devtools_attempt', { key: 'Ctrl+U' });
      }
      // Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88)) {
        e.preventDefault();
        logEvent(`disallowed_key`, { key: `Ctrl+${e.key}` });
      }
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      logEvent(e.type + '_attempt', { textLength: window.getSelection().toString().length });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logEvent('tab_switch', { state: 'hidden' });
      } else {
        logEvent('tab_switch', { state: 'visible' });
      }
    };

    const handleWindowBlur = () => {
      logEvent('tab_switch', { type: 'blur' });
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logEvent('fullscreen_exit', {});
      }
    };

    const handlePageHide = () => {
      flushQueue();
    };

    // Attach listeners
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('copy', handleCopyPaste);
    window.addEventListener('paste', handleCopyPaste);
    window.addEventListener('cut', handleCopyPaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('pagehide', handlePageHide);

    // Disable selection via CSS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('copy', handleCopyPaste);
      window.removeEventListener('paste', handleCopyPaste);
      window.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('pagehide', handlePageHide);
      
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, [isActive, logEvent, flushQueue]);

  return { logEvent };
};
