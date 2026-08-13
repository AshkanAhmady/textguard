import {
  createFilter,
  enterprisePreset,
  socialMediaPreset,
  strictPreset,
} from "@textguard/all";
import "./styles.css";

type PresetName = "strict" | "enterprise" | "socialMedia";

const inputElement = document.querySelector<HTMLTextAreaElement>("#input");
const presetElement = document.querySelector<HTMLSelectElement>("#preset");
const scanElement = document.querySelector<HTMLButtonElement>("#scan");
const shareElement = document.querySelector<HTMLButtonElement>("#share");
const shareStatusElement = document.querySelector<HTMLElement>("#share-status");
const matchCountElement = document.querySelector<HTMLElement>("#match-count");
const statusElement = document.querySelector<HTMLElement>("#status");
const filteredElement = document.querySelector<HTMLElement>("#filtered");
const matchesElement = document.querySelector<HTMLOListElement>("#matches");
const explainCountElement =
  document.querySelector<HTMLElement>("#explain-count");
const explanationsElement =
  document.querySelector<HTMLOListElement>("#explanations");
const debugCountElement = document.querySelector<HTMLElement>("#debug-count");
const debugEventsElement =
  document.querySelector<HTMLOListElement>("#debug-events");
const debugTimelineElement =
  document.querySelector<HTMLElement>("#debug-timeline");

if (
  !inputElement ||
  !presetElement ||
  !scanElement ||
  !shareElement ||
  !shareStatusElement ||
  !matchCountElement ||
  !statusElement ||
  !filteredElement ||
  !matchesElement ||
  !explainCountElement ||
  !explanationsElement ||
  !debugCountElement ||
  !debugEventsElement ||
  !debugTimelineElement
) {
  throw new Error("TextGuard playground failed to initialize.");
}

const input = inputElement;
const preset = presetElement;
const scan = scanElement;
const share = shareElement;
const shareStatus = shareStatusElement;
const matchCount = matchCountElement;
const status = statusElement;
const filtered = filteredElement;
const matches = matchesElement;
const explainCount = explainCountElement;
const explanations = explanationsElement;
const debugCount = debugCountElement;
const debugEvents = debugEventsElement;
const debugTimeline = debugTimelineElement;

function isPresetName(value: string | null): value is PresetName {
  return (
    value === "strict" || value === "enterprise" || value === "socialMedia"
  );
}

function hydrateFromUrl(): void {
  const params = new URLSearchParams(window.location.search);
  const text = params.get("text");
  const sharedPreset = params.get("preset");

  if (text !== null) input.value = text;
  if (isPresetName(sharedPreset)) preset.value = sharedPreset;
}

function updateShareUrl(): void {
  const url = new URL(window.location.href);

  url.searchParams.set("preset", preset.value);
  url.searchParams.set("text", input.value);

  window.history.replaceState(null, "", url);
  shareStatus.textContent = "Share URL updated. Copy it from the address bar.";
}

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
  const debugSession = filter.debug(text);
  const events = debugSession.getEvents();
  const timeline = debugSession.timeline();

  matchCount.textContent = String(result.matches.length);
  status.textContent = result.matches.length > 0 ? "Matches found" : "Clean";
  filtered.textContent = result.filteredText;
  matches.replaceChildren();
  explanations.replaceChildren();
  debugEvents.replaceChildren();
  explainCount.textContent = `${explanation.summary.matchCount} explanation${explanation.summary.matchCount === 1 ? "" : "s"}`;
  debugCount.textContent = `${events.length} event${events.length === 1 ? "" : "s"}`;
  debugTimeline.textContent = JSON.stringify(timeline, null, 2);

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
  } else {
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

  if (events.length === 0) {
    renderEmpty(debugEvents, "No debug events recorded.");
    return;
  }

  for (const [index, event] of events.entries()) {
    const item = document.createElement("li");
    const position = document.createElement("span");
    const type = document.createElement("code");
    position.textContent = String(index + 1).padStart(2, "0");
    type.textContent = event.type;
    item.append(position, type);
    debugEvents.append(item);
  }
}

hydrateFromUrl();
scan.addEventListener("click", render);

share.addEventListener("click", () => {
  updateShareUrl();
});

preset.addEventListener("change", render);
render();
