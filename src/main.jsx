import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import Modal from "react-modal";
import { IsEditorProvider } from "./context/IsEditor.jsx";
import { ContentEditorProvider } from "./context/ContentEditor.jsx";

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContentEditorProvider>
            <IsEditorProvider>
                <App />
            </IsEditorProvider>
        </ContentEditorProvider>
    </React.StrictMode>
);
