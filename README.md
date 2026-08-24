# Mac-Decision

Helping people decide whether they actually need a Mac.

## Problem

Many students, developers, creators, and professionals are unsure whether they need a MacBook, Windows laptop, Linux machine, or cloud-based workflow.

Mac-Decision aims to provide honest recommendations based on user needs rather than marketing.

## Initial Features

- 🎯 Mac suitability assessment - Determine if a Mac is right for you, through a guided chat-style flow
- ☁️ Cloud Mac options - Explore MacInCloud and similar services for occasional macOS/iOS dev access
- 💰 Budget-conscious guidance - Including secondhand and refurbished Mac options
- 🤖 AI-generated verdicts - A short, honest, personalized recommendation powered by Groq (Llama 3.3)

## Future Ideas

- 🔍 OS Museum - Retro-styled exploration of historical operating systems, starting with Haiku
- 📚 OS documentaries - Learn OS evolution and capabilities
- 📦 Open-source iOS dev guide - Building iOS apps without owning a Mac (Flutter, React Native, KMP)
- 🗳️ Community roadmap poll - Vote on what gets built next
- 🧠 Multi-agent decision systems - Advanced AI-powered recommendations

## Tech Stack

- **Frontend:** Next.js (static export)
- **Backend:** Cloudflare Pages Functions
- **AI:** Groq API (Llama 3.3 70B) — used once per session for the final verdict, not open-ended chat
- **Planned database:** Neon (serverless Postgres)

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Hey-Abhiram/Mac-decision.git
cd Mac-decision
npm install
```

Get a free Groq API key from [console.groq.com](https://console.groq.com), then create a `.dev.vars` file in the project root:

```
GROQ_API_KEY=your_key_here
```

**Important:** `.dev.vars` is already in `.gitignore` — never commit your real API key.

### Running locally

This project uses Cloudflare Pages Functions for the backend, so it needs to run through Wrangler rather than the plain Next.js dev server:

```bash
npm install -g wrangler
npm run build
npx wrangler pages dev out
```

Open [http://127.0.0.1:8788](http://127.0.0.1:8788) in your browser.

> Note: plain `npm run dev` will show the UI but the AI verdict step won't work, since that command doesn't run the Cloudflare function.

## Deployment

Deployed via Cloudflare Pages, connected directly to this repository. Add `GROQ_API_KEY` as an environment variable in the Cloudflare Pages dashboard under **Settings → Environment variables**.

## Contributing

Contributions are welcome! Feel free to:

- Submit issues for bugs or feature requests
- Open pull requests with improvements
- Share feedback and suggestions

## License

This project is open source. *(license to be added)*

## Support

For questions or support, please open an issue on the repository.

---

*Mac-Decision: Making the right choice, one comparison at a time. 🍎* No