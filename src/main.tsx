import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./main.css";

import { Game } from "./game";

const rootElement = document.getElementById("main");

// Check if the root element exists
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<Game />
		</StrictMode>,
	);
} else {
	console.error("Root element not found");
}
