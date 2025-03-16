import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const rootElement = document.getElementById("main");

// Check if the root element exists
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
} else {
	console.error("Root element not found");
}