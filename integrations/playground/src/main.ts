import { createFilter, enterprisePreset, socialMediaPreset, strictPreset } from "@textguard/all";
import "./styles.css";

type PresetName = "strict" | "enterprise" | "socialMedia";

const inputElement = document.querySelector<HTMLTextAreaElement>("#input");
const presetElement = document.querySelector<HTMLSelectElement>("#preset");
const scanElement = document.querySelector<HTMLButtonElement>("#scan");
const matchCountElement = document.querySelector<HTMLElement>("#match-count");
const statusElement = document.querySelector<HTMLElement>("#status");
const filteredElement = document.querySelector<HTMLElement>("#filtered");
const matchesElement = document.querySelector<HTMLOListElement>("#matches");
const explainCountElement = document.querySelector<HTMLElement>("#explain-count");
const explanationsElement = document.querySelector<HTMLOListElement>("#explanations");

if (
  !inputElement ||
  !presetElement ||
  !scanElement ||
  !matchCountElement ||
  !statusElement ||
  !filteredElement ||
  !matchesElement ||
  !explainCountElement ||
  !explanationsElement
) {
  throw new Error("TextGuard playground failed to initialize.");
}

const input = inputElement;
const preset = presetElement;
const scan = scanElement;
const matchCount = matchCountElement;
const status = statusElement;
const filtered = filteredElement;
const matches = matchesElement;
const explainCount = explainCountElement;
const explanations = explanationsElement;

function getPreset(name: PresetName) {
  if (name === "enterprise") return enterprisePreset;
  if (name === "socialMedia") return socialMediaPreset;
  return strictPreset;
}

function renderEmpty(list: HTMLOListElement, message: string): void {
  const empty = document.createElement("li");
  empty.className = "empty";
  empty.textContent = message;
  list.append(empty);
}

function render(): void {
  const text = input.value;
  const selectedPreset = preset.value as PresetName;
  const filter = createFilter(getPreset(selectedPreset));
  const result = filter.filter(text);
  const explanation = filter.explain(text);

  matchCount.textContent = String(result.matches.length);
  status.textContent = result.matches.length > 0 ? "Matches found" : "Clean";
  filtered.textContent = result.filteredText;
  matches.replaceChildren();
  explanations.replaceChildren();
  explainCount.textContent = `${explanation.summary.matchCount} explanation${explanation.summary.matchCount === 1 ? "" : "s"}`;

  if (result.matches.length === 0) {
    renderEmpty(matches, "No matches found.");
  } else {
    for (const match of result.matches) {
      const item = document.createElement("li");
      const word = document.createElement("strong");
      const range = document.createElement("span");
      word.textContent = match.matchedText;
      range.textContent = `[${match.start}-${match.end}]`;
      item.append(word, range);
      matches.append(item);
    }
  }

  if (explanation.matches.length === 0) {
    renderEmpty(explanations, "No explanations available for clean text.");
    return;
  }

  for (const explained of explanation.matches) {
    const item = document.createElement("li");
    item.className = "explanation-card";

    const top = document.createElement("div");
    top.className = "explanation-top";

    const word = document.createElement("strong");
    word.textContent = explained.match.matchedText;

    const source = document.createElement("code");
    source.textContent = `${explained.source.plugin} · ${explained.source.rule.id}`;

    const reason = document.createElement("p");
    reason.textContent = explained.reason.message;

    const meta = document.createElement("span");
    meta.className = "explanation-meta";
    meta.textContent = `range ${explained.match.start}-${explained.match.end}`;

    top.append(word, source);
    item.append(top, reason, meta);
    explanations.append(item);
  }
}

scan.addEventListener("click", render);
preset.addEventListener("change", render);
render();
