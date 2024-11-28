//Entry Point

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/Index.jsx';

function main() {
    const root = createRoot(document.getElementById("app"));
    root.render(<App />);
}

main();

// 添加热更新支持
if (module.hot) {
    module.hot.accept();
}

