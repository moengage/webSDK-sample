import { useState, useEffect, useCallback } from 'react';
import useMCPBridge from '../hooks/useMCPBridge.js';
import useMoEngage from '../hooks/useMoEngage.js';
import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx';
import '../styles/index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const moe = useMoEngage();

  const handleTool = useCallback((result) => {
    const data = result?.structuredContent || result?.result?.structuredContent || result?.content?.structuredContent || result;
    if (!data?.action) return;

    const ts = new Date().toLocaleTimeString();
    const actions = {
      moe_identify_user: () => {
        moe.identifyUser(data.userId, data.attributes || {});
        setUser(data.userId);
        setEvents((prev) => [{ ts, name: 'user_identified', data: { userId: data.userId } }, ...prev.slice(0, 9)]);
      },
      moe_track_event: () => {
        moe.trackEvent(data.eventName, data.properties || {});
        setEvents((prev) => [{ ts, name: data.eventName, data: data.properties || {} }, ...prev.slice(0, 9)]);
      },
      moe_set_attribute: () => {
        moe.setAttribute(data.attributeName, data.attributeValue);
        setEvents((prev) => [{ ts, name: 'attribute_set', data: { name: data.attributeName, value: data.attributeValue } }, ...prev.slice(0, 9)]);
      },
    };
    actions[data.action]?.();
  }, [moe]);

  useMCPBridge({ onToolResult: handleTool });

  useEffect(() => {
    moe.trackEvent('app_opened', { source: 'moe_widget' });
    setEvents((prev) => [{ ts: new Date().toLocaleTimeString(), name: 'app_opened', data: {} }, ...prev.slice(0, 9)]);
  }, [moe]);

  return (
    <div className="app">
      <Header user={user} />
      <Dashboard events={events} />
    </div>
  );
}
