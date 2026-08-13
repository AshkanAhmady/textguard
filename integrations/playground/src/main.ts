import { createFilter, enterprisePreset, socialMediaPreset, strictPreset } from "@textguard/all";
import "./styles.css";

type PresetName = "strict" | "enterprise" | "socialMedia";

const input = document.querySelector<HTMLTextAreaElement>("#input");
const preset = document.querySelector<HTMLSelectElement>("#preset");
const scan = document.querySelector<HTMLButtonElement>("#scan");
const matchCount = document.querySelector<HTMLElement>("#match-count");
const status = document.querySelector<HTMLElement>("#status");
const filtered = document.querySelector<HTMLElement>("#filtered");
const matches = document.querySelector<HTMLOListElement>("#matches");

if (!input || !preset || !scan || !matchCount || !status || !filtered || !matches) {
  throw new Error("TextGuard playground failed to initialize.");
}

function getPreset(name: PresetName) {
  if (name === "enterprise") return enterprisePreset;
  if (name === "socialMedia") return socialMediaPreset;
  return strictPreset;
}

function render(): void {
  const text = input.value;
  const selectedPreset = preset.value as PresetName;
  const result = createFilter(getPreset(selectedPreset)).filter(text);

  matchCount.textContent = String(result.matches.length);
  status.textContent = result.matches.length > 0 ? "Matches found" : "Clean";
  filtered.textContent = result.filteredText;
  matches.replaceChildren();

  if (result.matches.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No matches found.";
    matches.append(empty);
    return;
  }

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

scan.addEventListener("click", render);
preset.addEventListener("change", render);
render();
