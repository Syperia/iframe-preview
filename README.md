# My Addon

## Installation

First, install the package.

```sh
npm install --save-dev storybook-iframe-preview
```

Then, register it as an addon in `.storybook/main.js`.

```js
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // ...rest of config
  addons: [
    '@storybook/addon-essentials',
    'withIframeParentControls',
  ],
};

export default config;
```

## Usage

The primary way to use this addon is to have control over iframed story from the parent window.
```ts
// usage.ts
function handleMessage(
  event: MessageEvent<{ type: string; payload: any }>,
): void {
  if (event.origin !== 'http://localhost:6006') {
    // Ensure the message is coming from the expected origin
    return;
  } else {
    try {
      if (
        event.data?.type === 'status' &&
        event.data?.payload?.status === 'loaded'
      ) {
        console.log(event.data);
        this.iframe.nativeElement.contentWindow?.postMessage(
          {
            type: 'updateArgs',
            payload: { primary: false, label: 'Button!' },
          },
          'http://localhost:6006',
        );
      }
    } catch (error) {
      console.error('Error parsing message data:', error);
    }
  }
}
```