import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	// Build plugin code (runs in Figma sandbox)
	if (mode === "plugin") {
		return {
			build: {
				outDir: "dist",
				emptyOutDir: false,
				lib: {
					entry: resolve(__dirname, "src/plugin/code.ts"),
					name: "code",
					fileName: () => "code.js",
					formats: ["iife"],
				},
				rollupOptions: {
					output: {
						extend: true,
					},
				},
			},
		};
	}

	// Build UI (runs in iframe, must be single file)
	return {
		plugins: [react(), tailwindcss(), viteSingleFile()],
		root: resolve(__dirname, "src/ui"),
		resolve: {
			alias: {
				"@": resolve(__dirname, "src"),
			},
		},
		build: {
			outDir: resolve(__dirname, "dist"),
			emptyOutDir: false,
			target: "esnext",
			cssCodeSplit: false,
			rollupOptions: {
				input: resolve(__dirname, "src/ui/index.html"),
			},
		},
	};
});
