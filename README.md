# LLM Eval — IRAS Tax FAQ Chatbot

Evaluates LLM responses for a Singapore IRAS tax FAQ assistant using [promptfoo](https://promptfoo.dev). Tests two providers (Claude Haiku and GPT-4o mini) against 10 tax-domain test cases covering key IRAS topics.

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

## Notes

- The assistant prompt instructs the model to **never provide personalised tax advice** and to refer users to [mytax.iras.gov.sg](https://mytax.iras.gov.sg) or a qualified tax professional for complex matters.
- All test assertions use case-insensitive matching (`icontains`) to accommodate natural variation in phrasing.
- Tax rules and thresholds are subject to change — verify figures against the latest IRAS publications before use in production.
