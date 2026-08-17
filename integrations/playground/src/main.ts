import {
  createFilter,
  defaultPreset,
  enterprisePreset,
  socialMediaPreset,
} from "@textguard/all";
import { creditCardPlugin } from "@textguard/plugin-credit-card";
import { emailPlugin } from "@textguard/plugin-email";
import { ibanPlugin } from "@textguard/plugin-iban";
import { ipPlugin } from "@textguard/plugin-ip";
import { phonePlugin } from "@textguard/plugin-phone";
import { urlPlugin } from "@textguard/plugin-url";
import { uuidPlugin } from "@textguard/plugin-uuid";
import "./styles.css";

type PresetName = "default" | "enterprise" | "socialMedia";
type ExampleName = "contact" | "identifiers" | "multilingual" | "clean";
type DetectorName = "email" | "url" | "phone" | "ip" | "uuid" | "credit-card" | "iban";
type ExampleScenario = { preset: PresetName; text: string };

const examples: Record<ExampleName, ExampleScenario> = {
  contact: { preset: "enterprise", text: "Contact user at demo [at] example [dot] test and review https://example.invalid/profile." },
  identifiers: { preset: "enterprise", text: "Request demo-id-1234 came from test-host.local." },
  multilingual: { preset: "socialMedia", text: "Hello team. سلام دوستان. مرحبا بالجميع. This is a multilingual message." },
  clean: { preset: "default", text: "TextGuard helps developers inspect text filtering behavior in a reproducible way." },
};

const presetDescriptions: Record<PresetName, string> = {
  default: "Balanced default for profanity, multilingual moderation, and official structured-data detectors using TextGuard's defaultPreset API.",
  enterprise: "Adds structured-data detectors for email, URL, phone, IP, UUID, credit card, and IBAN use cases.",
  socialMedia: "Moderation-focused preset for social and multilingual text with language dictionaries enabled.",
};

const inputElement = document.querySelector<HTMLTextAreaElement>("#input");
const presetElement = document.querySelector<HTMLSelectElement>("#preset");
const presetHelpElement = document.querySelector<HTMLElement>("#preset-help");
const exampleElement = document.querySelector<HTMLSelectElement>("#example");
const loadExampleElement = document.querySelector<HTMLButtonElement>("#load-example");
const detectorControlsElement = document.querySelector<HTMLFieldSetElement>("#detector-controls");
const detectorElements = document.querySelectorAll<HTMLInputElement>("[data-detector]");
const scanElement = document.querySelector<HTMLButtonElement>("#scan");
const shareElement = document.querySelector<HTMLButtonElement>("#share");
const shareStatusElement = document.querySelector<HTMLElement>("#share-status");
const matchCountElement = document.querySelector<HTMLElement>("#match-count");
const statusElement = document.querySelector<HTMLElement>("#status");
const filteredElement = document.querySelector<HTMLElement>("#filtered");
const matchesElement = document.querySelector<HTMLOListElement>("#matches");
const explainCountElement = document.querySelector<HTMLElement>("#explain-count");
const explanationsElement = document.querySelector<HTMLOListElement>("#explanations");
const debugCountElement = document.querySelector<HTMLElement>("#debug-count");
const debugEventsElement = document.querySelector<HTMLOListElement>("#debug-events");
const debugTimelineElement = document.querySelector<HTMLElement>("#debug-timeline");

if (!inputElement || !presetElement || !presetHelpElement || !exampleElement || !loadExampleElement || !detectorControlsElement || !scanElement || !shareElement || !shareStatusElement || !matchCountElement || !statusElement || !filteredElement || !matchesElement || !explainCountElement || !explanationsElement || !debugCountElement || !debugEventsElement || !debugTimelineElement) {
  throw new Error("TextGuard playground failed to initialize.");
}

const input = inputElement;
const preset = presetElement;
const presetHelp = presetHelpElement;
const example = exampleElement;
const loadExample = loadExampleElement;
const detectorControls = detectorControlsElement;
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
  return value === "default" || value === "enterprise" || value === "socialMedia";
}
function normalizeSharedPreset(value: string | null): PresetName | null {
  if (value === "strict") return "default";
  return isPresetName(value) ? value : null;
}
function isExampleName(value: string): value is ExampleName { return value in examples; }
function isDetectorName(value: string | undefined): value is DetectorName {
  return value === "email" || value === "url" || value === "phone" || value === "ip" || value === "uuid" || value === "credit-card" || value === "iban";
}

function hydrateFromUrl(): void {
  const params = new URLSearchParams(window.location.search);
  const text = params.get("text");
  const sharedPreset = normalizeSharedPreset(params.get("preset"));
  if (text !== null) input.value = text;
  if (sharedPreset) preset.value = sharedPreset;
}
function updatePresetHelp(name: PresetName): void { presetHelp.textContent = presetDescriptions[name]; }
function updateShareUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.set("preset", preset.value);
  url.searchParams.set("text", input.value);
  window.history.replaceState(null, "", url);
  shareStatus.textContent = "Share URL updated. Copy it from the address bar.";
}
function loadSelectedExample(): void {
  if (!isExampleName(example.value)) return;
  const scenario = examples[example.value];
  preset.value = scenario.preset;
  input.value = scenario.text;
  shareStatus.textContent = "";
  render();
}
function createDetector(name: DetectorName) {
  if (name === "email") return emailPlugin();
  if (name === "url") return urlPlugin();
  if (name === "phone") return phonePlugin();
  if (name === "ip") return ipPlugin();
  if (name === "uuid") return uuidPlugin();
  if (name === "credit-card") return creditCardPlugin();
  return ibanPlugin();
}
function getSelectedEnterprisePlugins() {
  return Array.from(detectorElements)
    .filter((element) => element.checked && isDetectorName(element.dataset.detector))
    .map((element) => createDetector(element.dataset.detector as DetectorName));
}
function getFilterOptions(name: PresetName) {
  detectorControls.disabled = name !== "enterprise";
  if (name === "enterprise") return { ...enterprisePreset, plugins: getSelectedEnterprisePlugins() };
  if (name === "socialMedia") return socialMediaPreset;
  return defaultPreset;
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
  updatePresetHelp(selectedPreset);
  const filter = createFilter(getFilterOptions(selectedPreset));
  const result = filter.filter(text);
  const explanation = filter.explain(text);
  const debugSession = filter.debug(text);
  const rawEvents = debugSession.getEvents();
  const events = debugSession.getSignalEvents();
  const timeline = debugSession.timeline({ includeEmptyRules: false });
  const timelineProjection = timeline.plugins.map((plugin) => ({
    plugin: plugin.name,
    matchedRules: plugin.rules.map((rule) => ({
      rule: rule.name,
      matchCount: rule.matches.length,
      ranges: rule.matches.map((match) => [match.start, match.end]),
    })),
  }));
  matchCount.textContent = String(result.matches.length);
  status.textContent = result.matches.length > 0 ? "Matches found" : "Clean";
  filtered.textContent = result.filteredText;
  matches.replaceChildren();
  explanations.replaceChildren();
  debugEvents.replaceChildren();
  explainCount.textContent = `${explanation.summary.matchCount} explanation${explanation.summary.matchCount === 1 ? "" : "s"}`;
  debugCount.textContent = `${events.length} signal event${events.length === 1 ? "" : "s"} · ${rawEvents.length} raw`;
  debugTimeline.textContent = JSON.stringify(timelineProjection, null, 2);
  if (result.matches.length === 0) renderEmpty(matches, "No matches found.");
  else for (const match of result.matches) {
    const item = document.createElement("li");
    const word = document.createElement("strong");
    const range = document.createElement("span");
    word.textContent = match.matchedText;
    range.textContent = `[${match.start}-${match.end}]`;
    item.append(word, range);
    matches.append(item);
  }
  if (explanation.matches.length === 0) renderEmpty(explanations, "No explanations available for clean text.");
  else for (const explained of explanation.matches) {
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
  if (events.length === 0) { renderEmpty(debugEvents, "No debug events recorded."); return; }
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
loadExample.addEventListener("click", loadSelectedExample);
scan.addEventListener("click", render);
share.addEventListener("click", updateShareUrl);
preset.addEventListener("change", render);
detectorElements.forEach((detector) => detector.addEventListener("change", render));
render();
