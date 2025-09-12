# ⚖️ NeethiSaarathi  
*"Your Rights. Your Voice. Your Power."*  
*(Know your rights instantly — anytime, anywhere.)*

---

🌟 Inspiration

Millions of Indian citizens are unaware of their rights, welfare benefits, and government schemes because the information is hidden in PDFs, overloaded portals, and legal jargon. This gap often leaves vulnerable groups dependent on middlemen, lawyers, or misinformation.

We were inspired to build NeethiSaarathi as an AI-powered legal buddy that brings clarity and accessibility to every citizen — empowering people to know and claim their rights instantly.

⚖️ What it does

Answers legal and welfare queries in plain, everyday language.

Explains government schemes, acts, and policies instantly.

Works offline after initial sync — no constant internet required.

Provides trustworthy, source-linked answers without jargon, lawyers, or fees.

👉 A citizen can simply ask: “Am I eligible for widow pension?” and NeethiSaarathi will provide a clear explanation along with source references.

🛠️ How we built it

Data Collection: Scraped laws, government portals, and official PDFs.

Preprocessing: Chunked and embedded documents using all-MiniLM-L6-v2.

AI Core: Used OpenAI models for summarization, Q&A, and plain-language translation of legal text.

Backend: FastAPI for serving queries.

Frontend: React (Vite) + Tailwind for a minimal, mobile-friendly citizen interface.

Deployment: GitHub Actions + Vercel for previews and rapid iteration.

🚧 Challenges we ran into

Parsing unstructured PDFs with inconsistent formatting.

Handling legal jargon while keeping explanations accurate but simple.

Optimizing responses to work in low-connectivity or offline settings.

Balancing accuracy vs. accessibility — ensuring that simplification doesn’t distort the meaning of legal texts.

🏆 Accomplishments that we're proud of

Built an end-to-end AI system that makes legal rights accessible to anyone.

Designed a lightweight, citizen-first interface that works across devices.

Integrated OpenAI models to bridge the gap between complex laws and human-friendly answers.

Demonstrated the potential to reach millions of underserved citizens with legal awareness.

📚 What we learned

How to combine AI + embeddings + retrieval to simplify real-world complex data.

The importance of user-centered design in legal tech — accessibility matters as much as accuracy.

How to balance performance with fairness, ensuring the system doesn’t misrepresent rights.

That AI can be a powerful tool for social justice, not just productivity.

🔮 What's next for NeethiSaarathi

Adding multilingual voice support for Indian regional languages.

Deploying as a WhatsApp bot to reach rural communities.

Creating a personalized eligibility checker for schemes.

Partnering with NGOs and government agencies to scale adoption.

⚖️ NeethiSaarathi is more than a hackathon project — it’s a mission to ensure that every citizen can understand and claim their rights with the power of AI.


## How to use

```
git clone https://github.com/KirthanNB/NeethiSaarathi.git 
cd NeethiSaarathi
cd app
pip install -m requirements.txt
npm run dev
```

Don't forget to star this repo if you found something new!!

