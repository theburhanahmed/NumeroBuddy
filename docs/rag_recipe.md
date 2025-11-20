# QODER IDE / RAG INGESTION & PROMPT RECIPE

This recipe is optimized for clean ingestion and RAG of the Mega Numerology Encyclopedia.

## Preprocessing / Chunking

* Token target: **~600–900 tokens per chunk** (in practice: 800 chars is fine).
* Overlap: **100 tokens** to preserve context between chunks.
* Metadata per chunk: `title`, `section`, `system`, `version`, `source` (e.g., "numerology_encyclopedia.json").

## Embedding & Vector DB

* Embedding model: use your platform's high-quality embedding model (OpenAI `text-embedding-3-large` or equivalent).
* Vector DB: any (Pinecone/Weaviate/Chromadb/Milvus). Use namespace `numerology_v1`.
* Store per chunk: `id`, `text`, `metadata`, `embedding`.

## Retrieval Strategy

* Use hybrid retrieval:
  * **1. Semantic**: top K=8 by embedding similarity.
  * **2. Filter**: match metadata `system` if user chose Pythagorean/Chaldean/Vedic.
  * **3. Re-rank**: by exact-match priority for numeric definitions (e.g., "life path algorithm").

## Prompting (system + user)

* **System prompt** (use as LLM system):

  ```
  You are a deterministic numerology engine. Use only retrieved facts to compute and explain numbers. For any calculation, show steps. If a required rule is missing, fallback to canonical 'reduce' algorithm. Always produce a JSON output with deterministic fields and human explanations.
  ```

* **User prompt template**:

  ```
  INPUT:
  - name: {name}
  - birthdate: {YYYY-MM-DD}
  - system: {pythagorean|chaldean|vedic}
  TASKS:
  1) Return deterministic numbers: life_path, expression, soul_urge, personality, birthday, maturity.
  2) Provide pinnacles and challenges.
  3) List karmic debts and missing numbers (karmic lessons).
  4) Provide a short (1 sentence), medium (50 words), long (3 paragraphs) interpretation for each number.
  5) Provide 'recommended actions' (3 bullets) and 'timing windows' (best months next year).
  OUTPUT: JSON with fields: computed, interpretations, recommended_actions, timing_windows, explanation_steps.
  ```

## Safety / Sanity checks

* Always compute deterministically; do not invent numbers.
* Return both calculation steps and final reduced numbers.
* If name contains non-Latin characters, transliterate first (store transliteration in metadata).
* Respect privacy: strip PII if required or encrypt before embedding.

## Ingestion Script

See `backend/core/rag_ingestion.py` for a Python implementation of the ingestion and query flow.
