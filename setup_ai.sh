# ================================
# NUMEROBUDDY AI INGESTION SETUP
# ================================

# 1. Create core folders
mkdir -p numerobuddy-ai/knowledge numerobuddy-ai/rules numerobuddy-ai/ai_context numerobuddy-ai/modules numerobuddy-ai/logs

# 2. Knowledge folders (documents go here)
mkdir -p numerobuddy-ai/knowledge/core_numbers
mkdir -p numerobuddy-ai/knowledge/business_numerology
mkdir -p numerobuddy-ai/knowledge/personal_years
mkdir -p numerobuddy-ai/knowledge/compatibility
mkdir -p numerobuddy-ai/knowledge/missing_numbers
mkdir -p numerobuddy-ai/knowledge/compound_numbers
mkdir -p numerobuddy-ai/knowledge/kua_fengshui
mkdir -p numerobuddy-ai/knowledge/health_kabala

# 3. Rules output folder
mkdir -p numerobuddy-ai/rules

# 4. AI context & control files
cat << 'EOF' > numerobuddy-ai/ai_context/numerobuddy_rules.md
You are NOT a numerologist.
You are a rule-extraction and logic-building system.

Hard rules:
- You must NOT invent numerology knowledge.
- You must ONLY use information present in uploaded documents.
- If logic is unclear or conflicting, STOP and ask for clarification.
- Do NOT simplify compound numbers, compatibility, remedies, or warnings.
- Every output must be deterministic or explicitly marked non-deterministic.
EOF

cat << 'EOF' > numerobuddy-ai/ai_context/question_policy.md
Before giving any advice or output, the system MUST confirm:
1. Is the context: personal / business?
2. Is the intent: short-term / long-term?
3. Domain involved: career / marriage / finance / health / education?
4. Date context available for Personal Year calculation?

If any answer is missing, DO NOT PROCEED.
EOF

cat << 'EOF' > numerobuddy-ai/ai_context/expert_mode.md
When Expert Mode is enabled:
- Show all calculations
- Show rejected options
- Show conflict resolution logic
- Show warnings and remedies explicitly
EOF

cat << 'EOF' > numerobuddy-ai/ai_context/forbidden_behavior.md
Forbidden behaviors:
- No guarantees or absolute claims
- No spiritual or motivational language
- No predictions without warnings
- Always flag risky numbers: 4, 8, 13, 16, 26, 28
EOF

# 5. Log folder
mkdir -p numerobuddy-ai/logs

echo "✅ Numerobuddy AI ingestion structure ready"
