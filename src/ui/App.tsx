import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
	const [selectionCount, setSelectionCount] = useState(0);

	useEffect(() => {
		// Listen for messages from the plugin code
		window.onmessage = (event: MessageEvent) => {
			const msg = event.data.pluginMessage;
			if (!msg) return;

			switch (msg.type) {
				case "selection-change":
					setSelectionCount(msg.count);
					break;
			}
		};
	}, []);

	const createRectangle = () => {
		parent.postMessage({ pluginMessage: { type: "create-rectangle" } }, "*");
	};

	const closePlugin = () => {
		parent.postMessage({ pluginMessage: { type: "close" } }, "*");
	};

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="text-lg font-semibold">Figma Plugin</h1>

			<p className="text-sm text-muted-foreground">
				{selectionCount === 0
					? "No items selected"
					: `${selectionCount} item${selectionCount > 1 ? "s" : ""} selected`}
			</p>

			<div className="flex flex-col gap-2">
				<Button onClick={createRectangle}>Create Rectangle</Button>
				<Button variant="outline" onClick={closePlugin}>
					Close
				</Button>
			</div>
		</div>
	);
}

export default App;
