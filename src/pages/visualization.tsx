import { KeyOverlay } from "@/components/key-overlay";
import { MouseOverlay } from "@/components/mouse-overlay";
import { KEY_EVENT_STORE, KeyEventStore, useKeyEvent } from "@/stores/key_event";
import { KEY_STYLE_STORE, KeyStyleStore, useKeyStyle } from '@/stores/key_style';
import { listenForUpdates } from '@/stores/sync';
import { EventPayload } from "@/types/event";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, } from "react";

export function Visualization() {
  const monitor = useKeyStyle((state) => state.appearance.monitor);
  const onEvent = useKeyEvent((state) => state.onEvent);
  const setIsStyling = useKeyEvent((state) => state.setIsStyling);
  const tick = useKeyEvent((state) => state.tick);

  useEffect(() => {
    const unlistenPromises = [
      // ───────────── input event listener ─────────────
      listen<EventPayload>("input-event", (event) => onEvent(event.payload)),
      // ───────────── store sync ─────────────
      listenForUpdates<KeyEventStore>(KEY_EVENT_STORE, useKeyEvent.setState),
      listenForUpdates<KeyStyleStore>(KEY_STYLE_STORE, useKeyStyle.setState),
      // ───────────── settings window open/close ─────────────
      listen<boolean>("settings-window", (event) => setIsStyling(event.payload)),
    ];
    const id = setInterval(tick, 150);

    return () => {
      clearInterval(id);
      unlistenPromises.forEach((p) => p.then((f) => f()));
    };
  }, []);

  useEffect(() => {
    invoke("set_main_window_monitor", { monitorName: monitor ?? "" });
  }, [monitor]);

  return <div className="w-screen h-screen relative overflow-hidden">
    <MouseOverlay />
    <KeyOverlay />
  </div>;
}