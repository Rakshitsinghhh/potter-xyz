// components/SwapTerminal.jsx
import { useEffect } from 'react';

const SwapTerminal = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v2.js';
    script.async = true;

    script.onload = () => {
      if (window.Jupiter) {
        window.Jupiter.init({
          displayMode: 'widget',
          integratedTargetId: 'jupiter-terminal',
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      const terminal = document.getElementById('jupiter-terminal');
      if (terminal) terminal.innerHTML = '';
    };
  }, []);

  return <div id="jupiter-terminal" style={{ width: '100%', height: '600px' }}></div>;
};

export default SwapTerminal;
