/**
 * @file widget/hooks/useMCPBridge.js
 * @description React hook implementing the MCP Apps Bridge protocol.
 *
 * The bridge communicates with the ChatGPT host via JSON-RPC 2.0 messages
 * sent over `window.postMessage`.  It handles:
 *   - Outgoing RPC requests and notifications to the host.
 *   - Incoming responses keyed by `id`.
 *   - Incoming tool-result notifications dispatched to a callback.
 *
 * The hook automatically initialises the bridge on mount and tears down the
 * `message` listener on unmount.
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that manages the MCP Apps Bridge (JSON-RPC over postMessage).
 *
 * @param {object}   options
 * @param {function} [options.onToolResult] - Callback invoked with the
 *   `params` payload whenever the host sends a `ui/notifications/tool-result`
 *   notification.  The callback ref is stable — it can be swapped at any time
 *   without re-running the effect.
 *
 * @returns {{
 *   callTool:    (name: string, args: object) => Promise<void>,
 *   bridgeReady: Promise<void>,
 * }}
 */
export default function useMCPBridge({ onToolResult } = {}) {
  /** Auto-incrementing JSON-RPC request id. */
  const rpcIdRef = useRef(0);

  /** Map of pending RPC request ids to their resolve/reject handlers. */
  const pendingRef = useRef(new Map());

  /**
   * Mutable ref holding the latest `onToolResult` callback so the
   * message listener always invokes the current version without needing
   * to re-register.
   */
  const onToolResultRef = useRef(onToolResult);
  onToolResultRef.current = onToolResult;

  /**
   * Flag indicating standalone mode: bridge init failed (no ChatGPT parent).
   * In standalone mode, callTool uses HTTP API instead of MCP bridge.
   */
  const standaloneModeRef = useRef(false);

  /**
   * Stable reference to the bridge-ready promise.  Resolved once the
   * `ui/initialize` handshake completes (or rejected on error).
   */
  const bridgeReadyRef = useRef(null);
  const bridgeReadyResolveRef = useRef(null);

  // Lazily create the promise on first access so it is stable across renders.
  if (!bridgeReadyRef.current) {
    bridgeReadyRef.current = new Promise((resolve) => {
      bridgeReadyResolveRef.current = resolve;
    });
  }

  // ── Low-level RPC helpers ─────────────────────────────────────────────────

  /**
   * Send a JSON-RPC 2.0 notification (no `id`, no response expected).
   * @param {string} method
   * @param {object} [params]
   */
  const rpcNotify = useCallback((method, params) => {
    window.parent.postMessage({ jsonrpc: '2.0', method, params }, '*');
  }, []);

  /**
   * Send a JSON-RPC 2.0 request and return a Promise that resolves with the
   * `result` field of the response.
   * @param {string} method
   * @param {object} [params]
   * @returns {Promise<*>}
   */
  const rpcRequest = useCallback((method, params) => {
    return new Promise((resolve, reject) => {
      const id = ++rpcIdRef.current;
      pendingRef.current.set(id, { resolve, reject });
      window.parent.postMessage({ jsonrpc: '2.0', id, method, params }, '*');
    });
  }, []);

  // ── Message listener + bridge init (runs once on mount) ───────────────────

  useEffect(() => {
    /**
     * Handle incoming `message` events from the ChatGPT host.
     * @param {MessageEvent} event
     */
    function handleMessage(event) {
      if (event.source !== window.parent) return;
      const msg = event.data;
      if (!msg || msg.jsonrpc !== '2.0') return;

      // ── Response to an outgoing request ──
      if (typeof msg.id === 'number') {
        const pending = pendingRef.current.get(msg.id);
        if (!pending) return;
        pendingRef.current.delete(msg.id);
        if (msg.error) {
          pending.reject(msg.error);
        } else {
          pending.resolve(msg.result);
        }
        return;
      }

      // ── Tool-result notification from MCP host ──
      if (msg.method === 'ui/notifications/tool-result') {
        if (typeof onToolResultRef.current === 'function') {
          const params = msg.params;
          if (!params) {
            console.warn('[MCP Bridge] Received tool-result with empty params, skipping:', msg);
            return;
          }
          if (process.env.NODE_ENV === 'development') {
            console.log('[MCP Bridge] ChatGPT mode: tool-result received:', params);
          }
          onToolResultRef.current(params);
        }
      }
    }

    window.addEventListener('message', handleMessage, { passive: true });

    // ── Initialise the bridge (non-blocking) ──
    (async () => {
      try {
        await rpcRequest('ui/initialize', {
          appInfo: { name: 'moe-sample-chatgpt-app', version: '2.0.0' },
          appCapabilities: {},
          protocolVersion: '2026-01-26',
        });
        rpcNotify('ui/notifications/initialized', {});
      } catch (err) {
        console.warn('MCP bridge unavailable (standalone mode):', err);
        standaloneModeRef.current = true;
      } finally {
        // Always resolve so callTool never hangs.
        bridgeReadyResolveRef.current?.();
      }
    })();

    // ── Cleanup ──
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [rpcNotify, rpcRequest]);

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Call an MCP tool via the bridge.
   *
   * Waits for the bridge handshake to finish before sending, then dispatches
   * the response through `handleToolResult`.
   *
   * @param {string} name - Tool name (e.g. `'browse_restaurants'`).
   * @param {object} args - Tool arguments.
   * @returns {Promise<void>}
   */
  const callTool = useCallback(
    async (name, args) => {
      try {
        await bridgeReadyRef.current;

        // Standalone mode: use HTTP API instead of MCP bridge
        if (standaloneModeRef.current) {
          const endpoint = name.replace(/_/g, '-'); // view_menu → view-menu
          try {
            const res = await fetch(`/api/${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(args),
            });
            if (!res.ok) {
              console.warn(`[MCP Bridge] API error (${endpoint}): ${res.status} ${res.statusText}`);
              return;
            }
            const data = await res.json();
            if (!data || typeof data !== 'object') {
              console.warn(`[MCP Bridge] Invalid response from /api/${endpoint}:`, data);
              return;
            }
            if (typeof onToolResultRef.current === 'function') {
              if (process.env.NODE_ENV === 'development') {
                console.log(`[MCP Bridge] Standalone mode: API call (${endpoint}) → response:`, data);
              }
              onToolResultRef.current(data);
            } else {
              console.warn('[MCP Bridge] onToolResultRef.current is not a function!');
            }
          } catch (error) {
            console.warn(`[MCP Bridge] Fetch error (${endpoint}):`, error);
          }
          return;
        }

        // ChatGPT MCP bridge mode
        const response = await rpcRequest('tools/call', { name, arguments: args });
        if (!response) {
          console.warn('[MCP Bridge] Empty response from MCP tools/call');
          return;
        }
        if (typeof onToolResultRef.current === 'function') {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[MCP Bridge] ChatGPT mode: MCP call (${name}) → response:`, response);
          }
          onToolResultRef.current(response);
        }
      } catch (e) {
        console.warn('Tool call failed:', e);
      }
    },
    [rpcRequest],
  );

  return {
    callTool,
    bridgeReady: bridgeReadyRef.current,
  };
}
