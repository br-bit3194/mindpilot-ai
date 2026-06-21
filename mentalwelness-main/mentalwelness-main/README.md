# MindMate AI — Exam Wellness Companion

GenAI-powered mental wellness for **NEET, JEE, CUET, CAT, GATE, UPSC** and board exam aspirants.

## Core Features (Problem Statement Aligned)

| Feature | Description |
|---------|-------------|
| **AI Journal** | Analyzes open-ended daily journaling — uncovers hidden stress triggers & emotional patterns standard trackers miss |
| **Mood Logs** | Quick emoji check-ins feed stress/confidence trends |
| **Wellness Coach** | Conversational AI with hyper-personalized coping strategies, mindfulness exercises & motivation |
| **Crisis Safety** | Auto-detects crisis language → surfaces Indian helplines (Tele-MANAS 14416) |
| **Offline AI** | **Works without any API key** — powerful local intelligence engine |

## No API Key Required

Chat and journal analysis run **entirely client-side** using MindMate's local AI engine:
- 20+ exam-specific wellness topics (NEET biology overload, JEE physics pressure, UPSC marathon fatigue, CAT time anxiety, etc.)
- 10 deep stress-trigger detectors with hidden pattern analysis
- Context-aware coach that remembers conversation history
- Exam-specific coping strategies & mindfulness recommendations

Optional: Add `GEMINI_API_KEY` in `.env.local` for enhanced server-side Gemini responses.

## Crisis Safety

MindMate detects crisis language in journal entries and coach chats, surfacing Indian helplines:

- Tele-MANAS: **14416** (24/7)
- Vandrevala Foundation: **1860-2662-345** (24/7)
- iCall: **+91-9152987821**

## Project Structure

```
app/              Next.js app router + API routes
components/       UI components
lib/              AI, safety, stats, ambient audio, tests
```

## Accessibility

- Skip-to-main-content link
- ARIA labels on interactive controls
- `role="alert"` for crisis banners
- Keyboard-focusable navigation
- Semantic landmarks (`main`, `nav`, `header`)

## License

Private — VHITS submission project.
