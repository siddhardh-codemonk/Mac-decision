"use client";

import { useState, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Question tree. Edit this to change the flow — no component logic needed.
// Each node: id, the bot's message, and options (label + next node id).
// A node with next: "END" triggers the verdict call using all collected answers.
// ---------------------------------------------------------------------------
const FLOW = {
  start: {
    bot: "hey. before you drop money on a MacBook, let's figure out why you actually want one.",
    options: [
      { label: "I need it for iOS / Xcode development", key: "primary_reason", value: "ios_dev", next: "ios_check" },
      { label: "My friends / classmates all have one", key: "primary_reason", value: "friend_pressure", next: "pressure_check" },
      { label: "I just want to try macOS", key: "primary_reason", value: "curiosity", next: "curiosity_check" },
      { label: "General dev work (web, backend, etc)", key: "primary_reason", value: "general_dev", next: "budget_check" },
    ],
  },
  ios_check: {
    bot: "makes sense — does it need to be a physical Mac, or would a cloud Mac work for occasional builds/App Store submission?",
    options: [
      { label: "Needs to be physical, I use it daily", key: "ios_dev_needed", value: true, next: "budget_check" },
      { label: "Occasional builds would be fine", key: "ios_dev_needed", value: "occasional", next: "budget_check" },
    ],
  },
  pressure_check: {
    bot: "real talk — if your friends didn't have Macs, would you still want one for something specific?",
    options: [
      { label: "Honestly... probably not", key: "would_want_anyway", value: false, next: "budget_check" },
      { label: "Yeah, there's a real use case too", key: "would_want_anyway", value: true, next: "budget_check" },
    ],
  },
  curiosity_check: {
    bot: "totally fair reason to be curious. do you need to own the hardware, or just poke around the OS?",
    options: [
      { label: "Just want to see what it's like", key: "just_curious", value: true, next: "budget_check" },
      { label: "I'd want to actually own one eventually", key: "just_curious", value: false, next: "budget_check" },
    ],
  },
  budget_check: {
    bot: "last one — how are you thinking about budget here?",
    options: [
      { label: "Trying to spend as little as possible", key: "budget_conscious", value: true, next: "secondhand_check" },
      { label: "Budget isn't really the constraint", key: "budget_conscious", value: false, next: "END" },
    ],
  },
  secondhand_check: {
    bot: "have you looked at secondhand or broken-screen Macs? often 40-60% cheaper and an external monitor fixes the screen issue instantly.",
    options: [
      { label: "No, hadn't considered that", key: "considered_secondhand", value: false, next: "END" },
      { label: "Yeah, already looking", key: "considered_secondhand", value: true, next: "END" },
    ],
  },
};

export default function DecisionChat() {
  const [messages, setMessages] = useState([{ from: "bot", text: FLOW.start.bot }]);
  const [currentNode, setCurrentNode] = useState("start");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleOption(opt) {
    const nextAnswers = { ...answers, [opt.key]: opt.value };
    setAnswers(nextAnswers);
    setMessages((m) => [...m, { from: "user", text: opt.label }]);

    if (opt.next === "END") {
      setLoading(true);
      try {
        const res = await fetch("/api/verdict", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(nextAnswers),
        });
        const data = await res.json();
        setMessages((m) => [
          ...m,
          { from: "bot", text: data.verdict || "Couldn't reach the verdict engine — try again in a bit." },
        ]);
      } catch {
        setMessages((m) => [...m, { from: "bot", text: "Something broke on my end. Mind trying again?" }]);
      } finally {
        setLoading(false);
        setDone(true);
      }
      return;
    }

    const nextNode = FLOW[opt.next];
    setCurrentNode(opt.next);
    setMessages((m) => [...m, { from: "bot", text: nextNode.bot }]);
  }

  const node = FLOW[currentNode];

  return (
    <div className="mdw-window">
      <div className="mdw-titlebar">
        <span className="mdw-dot" />
        <span className="mdw-title">Do you need a Mac?</span>
      </div>

      <div className="mdw-body" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`mdw-bubble mdw-${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="mdw-bubble mdw-bot mdw-typing">writing your verdict…</div>}
      </div>

      {!done && !loading && (
        <div className="mdw-options">
          {node.options.map((opt, i) => (
            <button key={i} className="mdw-option-btn" onClick={() => handleOption(opt)}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {done && (
        <div className="mdw-options">
          <button
            className="mdw-option-btn"
            onClick={() => {
              setMessages([{ from: "bot", text: FLOW.start.bot }]);
              setCurrentNode("start");
              setAnswers({});
              setDone(false);
            }}
          >
            start over
          </button>
        </div>
      )}

      <style jsx>{`
        .mdw-window {
          --bg: #ffffff;
          --panel: #f7f7f8;
          --border: #e5e5e8;
          --ink: #1c1d21;
          --muted: #6b6d76;
          --accent: #3d5afe;
          --bot-bubble: #f2f3f5;
          --user-bubble: var(--accent);
          font-family: "Inter", -apple-system, "Segoe UI", sans-serif;
          max-width: 480px;
          margin: 0 auto;
          border-radius: 14px;
          overflow: hidden;
          background: var(--bg);
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(20, 20, 30, 0.06);
        }
        .mdw-titlebar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .mdw-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
        }
        .mdw-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
        }
        .mdw-body {
          height: 360px;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: var(--bg);
        }
        .mdw-bubble {
          max-width: 82%;
          padding: 11px 14px;
          font-size: 14px;
          line-height: 1.5;
          border-radius: 14px;
        }
        .mdw-bot {
          align-self: flex-start;
          background: var(--bot-bubble);
          color: var(--ink);
          border-bottom-left-radius: 4px;
        }
        .mdw-user {
          align-self: flex-end;
          background: var(--user-bubble);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }
        .mdw-typing {
          color: var(--muted);
          font-style: italic;
        }
        .mdw-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 20px 20px;
          background: var(--panel);
          border-top: 1px solid var(--border);
        }
        .mdw-option-btn {
          text-align: left;
          font-family: inherit;
          font-size: 13.5px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #ffffff;
          cursor: pointer;
          color: var(--ink);
          transition: border-color 0.12s ease, background 0.12s ease;
        }
        .mdw-option-btn:hover {
          border-color: var(--accent);
          background: #f4f6ff;
        }
        .mdw-option-btn:active {
          background: #eaeeff;
        }
      `}</style>
    </div>
  );
}
