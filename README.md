# Figma Plugin Scaffold

A modern Figma plugin development scaffold built with Vite, React, Tailwind CSS v4, and shadcn/ui.

## Tech Stack

- **Vite** - Fast build tool with HMR
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS with native CSS variables
- **shadcn/ui** - Accessible, customizable component library
- **vite-plugin-singlefile** - Bundles UI into a single HTML file (required by Figma)

## Project Structure

```
figma-scaffold/
├── manifest.json           # Figma plugin manifest
├── package.json
├── components.json         # shadcn/ui configuration
├── vite.config.ts          # Vite config (dual build: plugin + UI)
├── tsconfig.json
└── src/
    ├── plugin/
    │   └── code.ts         # Figma sandbox code (no DOM access)
    ├── ui/
    │   ├── index.html      # UI entry point
    │   ├── main.tsx        # React entry
    │   ├── App.tsx         # Main app component
    │   └── index.css       # Tailwind styles + CSS variables
    ├── components/
    │   └── ui/             # shadcn/ui components
    ├── lib/
    │   └── utils.ts        # cn() utility
    └── hooks/              # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Figma desktop app

### Installation

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build
```

### Loading in Figma

1. Open Figma desktop app
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select `dist/manifest.json`
4. Your plugin will appear in the Development section

## Development

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Build and watch for changes |
| `pnpm build` | Production build |
| `pnpm build:plugin` | Build plugin code only |
| `pnpm build:ui` | Build UI only |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |

### Development Workflow

1. Run `pnpm dev` to start watching for changes
2. In Figma, enable **Plugins** → **Development** → **Hot reload plugin**
3. Make changes to your code - the plugin will automatically rebuild
4. Re-run your plugin in Figma to see changes

## Architecture

Figma plugins run in two separate contexts:

### Plugin Code (`src/plugin/code.ts`)

- Runs in Figma's **sandbox** environment
- Has access to the Figma API (`figma.*`)
- **No access** to DOM, browser APIs, or npm packages
- Communicates with UI via `figma.ui.postMessage()` and `figma.ui.onmessage`

### UI Code (`src/ui/`)

- Runs in an **iframe** within Figma
- Full access to DOM, React, and npm packages
- Communicates with plugin via `parent.postMessage()` and `window.onmessage`
- Must be bundled as a single HTML file (handled by vite-plugin-singlefile)

### Communication Example

```typescript
// In UI (App.tsx) - Send message to plugin
parent.postMessage({ pluginMessage: { type: "create-rectangle" } }, "*");

// In Plugin (code.ts) - Receive message from UI
figma.ui.onmessage = (msg) => {
  if (msg.type === "create-rectangle") {
    const rect = figma.createRectangle();
    // ...
  }
};

// In Plugin (code.ts) - Send message to UI
figma.ui.postMessage({ type: "selection-change", count: 5 });

// In UI (App.tsx) - Receive message from plugin
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (msg.type === "selection-change") {
    setCount(msg.count);
  }
};
```

## Adding shadcn/ui Components

This scaffold is pre-configured for shadcn/ui. Add components using the CLI:

```bash
# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add card dialog input

# Add all components
npx shadcn@latest add --all
```

Components are installed to `src/components/ui/`.

## Customization

### Plugin Manifest

Edit `manifest.json` to configure your plugin:

```json
{
  "name": "Your Plugin Name",
  "id": "your-unique-plugin-id",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "index.html",
  "editorType": ["figma"],
  "documentAccess": "dynamic-page",
  "networkAccess": {
    "allowedDomains": ["none"]
  }
}
```

### UI Size

Adjust the plugin window size in `src/plugin/code.ts`:

```typescript
figma.showUI(__html__, {
  width: 320,
  height: 480,
  themeColors: true,
});
```

### Theming

The scaffold includes CSS variables for light/dark mode that respect Figma's theme. Customize colors in `src/ui/index.css`:

```css
@theme {
  --color-primary: hsl(240 5.9% 10%);
  --color-primary-foreground: hsl(0 0% 98%);
  /* ... */
}
```

## Figma API Reference

- [Plugin API Documentation](https://www.figma.com/plugin-docs/)
- [Plugin API Reference](https://www.figma.com/plugin-docs/api/api-reference/)
- [Plugin Samples](https://github.com/figma/plugin-samples)

## License

MIT
