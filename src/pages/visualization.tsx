import './visualization.css';

import { Overlay } from "@/components/overlay";
import { KEY_EVENT_STORE, KeyEventStore, useKeyEvent } from "@/stores/key_event";
import { KEY_STYLE_STORE, KeyStyleStore, useKeyStyle } from '@/stores/key_style';
import { listenForUpdates } from '@/stores/sync';
import { EventPayload } from "@/types/event";
import { listen } from "@tauri-apps/api/event";
import { useEffect, } from "react";


function Visualization() {
  const onEvent = useKeyEvent((state) => state.onEvent);
  const tick = useKeyEvent((state) => state.tick);

  // ───────────── input event listener ─────────────
  useEffect(() => {
    const unsubscribe = listen<EventPayload>("input-event", (event) => onEvent(event.payload));
    const id = setInterval(tick, 250);
    return () => {
      clearInterval(id);
      unsubscribe.then(f => f());
    };
  }, []);

  // ───────────── store sync ─────────────
  useEffect(() => {
    const unlistenEvent = listenForUpdates<KeyEventStore>(KEY_EVENT_STORE, useKeyEvent);
    const unlistenStyle = listenForUpdates<KeyStyleStore>(KEY_STYLE_STORE, useKeyStyle);
    return () => { 
      unlistenEvent.then(f => f());
      unlistenStyle.then(f => f());
    };
  }, []);


  return <Overlay />;
}

export default Visualization;
