// components/LogStream.jsx
import React, { useEffect, useRef } from 'react';

const LogStream = ({ podName, lokiIP, onClose }) => {
  const logsRef = useRef(null);

  useEffect(() => {
    const logsEl = logsRef.current;
    const eventSource = new EventSource(`http://localhost:6060/deployment/stream-logs?loki_ip=${lokiIP}&pod_name=${podName}`);

    eventSource.onmessage = (event) => {
      logsEl.textContent += event.data + '\n';
      logsEl.scrollTop = logsEl.scrollHeight;
    };

    eventSource.onerror = () => {
      logsEl.textContent += '\n❌ Lost connection to log stream.';
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [lokiIP, podName]);

  return (
    <div style={{
      position: 'fixed',
      top: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '80%',
      backgroundColor: '#000',
      color: '#0f0',
      border: '2px solid #1cc300',
      borderRadius: '8px',
      zIndex: 1000,
      overflow: 'hidden',
      padding: '15px',
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3>🔍 Logs for <code>{podName}</code></h3>
        <button onClick={onClose} style={{
          background: 'transparent',
          color: '#0f0',
          border: '1px solid #0f0',
          padding: '4px 10px',
          cursor: 'pointer'
        }}>✖ Close</button>
      </div>
      <pre ref={logsRef} style={{ overflowY: 'scroll', height: '90%', whiteSpace: 'pre-wrap' }} />
    </div>
  );
};

export default LogStream;
