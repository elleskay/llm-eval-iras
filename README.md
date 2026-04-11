# LLM Eval — IRAS Tax FAQ Chatbot

[![LLM Eval](https://github.com/elleskay/llm-eval-iras/actions/workflows/llm-eval.yml/badge.svg)](https://github.com/elleskay/llm-eval-iras/actions/workflows/llm-eval.yml)

Evaluates LLM responses for a Singapore IRAS tax FAQ assistant using [promptfoo](https://promptfoo.dev). Tests two providers (Claude Haiku and GPT-4o mini) against 30 test cases across 5 behavioural categories, with a CI gate on every push to `main`.

## How it works

```
User Tax Query
      │
      ▼
System Prompt (IRAS context & guardrails)
      │
      ▼
LLM Provider  ──────────────────────────────┐
(Claude Haiku │ GPT-4o mini)                │
      │                                     │
      ▼                                     │
promptfoo Assertions                        │
  · contains / icontains / not-contains     │
  · llm-rubric (LLM-as-Judge)  ◄────────────┘
      │
      ▼
Pass / Fail Report  (output/results.json)
      │
      ▼
CI Gate  (≥ 80% pass rate required)
      │
   PASS / FAIL
```

## Project Structure

```
llm-eval-iras/
├── promptfooconfig.yaml   # Eval configuration (providers, prompt, tests)
├── prompts/
│   └── iras-tax-faq.txt   # System prompt for the IRAS FAQ assistant
├── tests/
│   └── iras-cases.yaml    # 10 test cases with assertions
├── .env.example           # API key template
├── .gitignore
└── README.md
```

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure API keys**

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

**3. Verify promptfoo is available**

```bash
npx promptfoo --version
```

## Running Evaluations

**Run the full eval (both providers, all 10 test cases):**

```bash
npx promptfoo eval
```

**View results in the browser UI:**

```bash
npx promptfoo view
```

**Export results to a file:**

```bash
npx promptfoo eval --output output/results.json
```

**Run with verbose output:**

```bash
npx promptfoo eval --verbose
```

## Test Cases

| # | Topic | Key Assertion |
|---|-------|---------------|
| 1 | Personal income tax e-filing deadline | "april", "e-filing" |
| 2 | GST registration threshold | "1 million", "turnover" |
| 3 | CPF relief eligibility | "employee", "cpf" |
| 4 | Corporate income tax rate | "17%", "chargeable income" |
| 5 | Tax residency (183-day rule) | "183 days", "resident" |
| 6 | Auto-Inclusion Scheme (AIS) | "employer", "income" |
| 7 | Property tax rates | "annual value", "owner-occupied" |
| 8 | SRS contribution limits | "15,300", "srs" |
| 9 | Foreign-sourced income exemption | "foreign-sourced", "foreign" |
| 10 | IRAS late filing penalties | "penalty", "late" |

## Providers Evaluated

| Provider | Model |
|----------|-------|
| Anthropic | `claude-haiku-4-5-20251001` |
| OpenAI | `gpt-4o-mini` |

Both providers use `temperature: 0` for deterministic, reproducible results.

## Results

The suite runs **30 test cases** across two providers (Claude Haiku and GPT-4o mini) on every push to `main`.

| Category | Cases | Assertion types |
|---|---|---|
| Core IRAS facts (deadlines, rates, thresholds) | 10 | `icontains`, `llm-rubric` |
| Hallucination prevention | 5 | `not-contains`, `not-icontains`, `llm-rubric` |
| PII handling (NRIC / UEN echo) | 5 | `not-contains`, `llm-rubric` |
| Personalised advice refusal | 5 | `icontains`, `not-contains`, `llm-rubric` |
| Edge cases & threshold ambiguity | 5 | `icontains`, `llm-rubric` |

Ten of the thirty cases carry an **LLM-as-Judge** (`llm-rubric`) assertion evaluated by Claude Haiku, covering three behavioural axes: hallucination of tax thresholds or deadlines, inappropriate personalised advice, and exposure of sensitive taxpayer identifiers. The CI gate requires a pass rate of **≥ 80%** across all assertions and both providers.

## Why this matters

An LLM deployed as a government tax assistant can cause direct financial harm if it fabricates thresholds, misquotes deadlines, or gives confident but wrong advice — a user told the wrong GST registration turnover or an incorrect filing date may face penalties with no recourse against the model. Unlike general-purpose chatbots, high-stakes public-sector applications require behavioural guarantees that cannot be validated manually at scale once the system is live. Automated, CI-gated evaluations are therefore not a quality-of-life improvement but a prerequisite: they create a reproducible safety check that must pass before any prompt change, model upgrade, or system update reaches users.

## Notes

- The assistant prompt instructs the model to **never provide personalised tax advice** and to refer users to [mytax.iras.gov.sg](https://mytax.iras.gov.sg) or a qualified tax professional for complex matters.
- All test assertions use case-insensitive matching (`icontains`) to accommodate natural variation in phrasing.
- Tax rules and thresholds are subject to change — verify figures against the latest IRAS publications before use in production.
