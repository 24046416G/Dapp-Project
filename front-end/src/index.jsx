import React from 'react'
import { createRoot } from 'react-dom/client';
import LoginTable from "./components/LoginTable/Index.jsx"

function main(){
    const root = createRoot(document.getElementById("app"));
    root.render(
        <LoginTable />
    );
}

main()

