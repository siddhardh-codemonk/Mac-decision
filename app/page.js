"use client";
import DecisionChat from "../components/DecisionChat";

export default function Home() {
  return (
    <main className="page">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <div className="hero">
        <span className="eyebrow">mac-decision</span>
        <h1>Do you actually need a Mac?</h1>
        <p>
          An honest, no-marketing walkthrough — answer a few quick questions and get a
          straight verdict, plus real alternatives if you don't need one.
        </p>
      </div>

      <div className="chat-wrap">
        <DecisionChat />
      </div>

      <p className="footnote">More coming soon: cloud Mac guides, an OS museum, and open-source iOS dev without a Mac.</p>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 20px 40px;
        }
        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
          pointer-events: none;
        }
        .glow-a {
          width: 480px;
          height: 480px;
          background: #3d5afe;
          top: -180px;
          left: -140px;
        }
        .glow-b {
          width: 420px;
          height: 420px;
          background: #ffb26b;
          bottom: -160px;
          right: -120px;
          opacity: 0.25;
        }
        .hero {
          position: relative;
          z-index: 1;
          max-width: 560px;
          text-align: center;
          margin-bottom: 36px;
        }
        .eyebrow {
          display: inline-block;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #3d5afe;
          margin-bottom: 12px;
        }
        h1 {
          font-family: "Inter", sans-serif;
          font-size: 34px;
          font-weight: 700;
          color: #1c1d21;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        p {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #6b6d76;
          margin: 0;
        }
        .chat-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
        }
        .footnote {
          position: relative;
          z-index: 1;
          margin-top: 28px;
          font-size: 12.5px;
          color: #9a9ca5;
          text-align: center;
          max-width: 420px;
        }
        @media (max-width: 480px) {
          h1 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  );
}