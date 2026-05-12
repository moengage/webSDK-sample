/**
 * @file widget/index.jsx
 * @description React entry point — mounts the root `<App />` component into
 *   the `#app` div provided by `public/food-widget.html`.
 */

import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import './styles/index.css';

const container = document.getElementById('app');
if (!container) {
  throw new Error('[Widget] Mount target #app not found in DOM');
}
const root = createRoot(container);
root.render(<App />);
