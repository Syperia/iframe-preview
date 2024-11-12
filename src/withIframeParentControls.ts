import { useGlobals, useArgs } from "storybook/internal/preview-api";
import type {
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from "storybook/internal/types";

let isEventListenerAdded = false;

export const withIframeParentControls = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
) => {
  if (context.viewMode !== "story") {
    return StoryFn();
  }

  const [globals, updateGlobals] = useGlobals();
  const [args, updateArgs] = useArgs();
  console.log(globals);
  console.log(args);


  if (window.parent !== window) {
    // Prepare the message
    const message = {
      type: 'status',
      payload: {
        status: 'loaded',
        globals: JSON.parse(JSON.stringify(globals)),
        args: JSON.parse(JSON.stringify(args))
      }
    };

    // Listen for messages from the host window
    if (!isEventListenerAdded) {
      console.log('isEventListenerAdded', isEventListenerAdded);
      isEventListenerAdded = true;

      window.addEventListener('message', (event) => {
        console.log("Received message", event.origin);
        try {
          switch (event.data?.type) {
            case 'updateGlobals':
              console.log("Updating globals");
              updateGlobals(event.data.payload);
              break;
            case 'updateArgs':
              console.log("Updating args");
              updateArgs(event.data.payload);
              break;
            default:
              break;
          }
        } catch (error) {
          console.error("Error parsing message data:", error);
        }
      });

      // Send the message to the host window
      window.top.postMessage(message, '*');
    }
  }

  return StoryFn();
};
