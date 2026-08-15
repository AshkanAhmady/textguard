import type { Match } from "../../domain/match";
import type { DebugSession } from "../models/DebugSession";
import type { Timeline } from "../models/Timeline";
import type { TimelineRule } from "../models/TimelineRule";

interface MutableTimelinePlugin {
  name: string;
  rules: TimelineRule[];
}

interface ActiveRuleExecution {
  plugin: string;
  rule: string;
  matches: Match[];
}

export interface TimelineBuildOptions {
  readonly includeEmptyRules?: boolean;
}

export class TimelineBuilder {
  public build(
    session: DebugSession,
    options: TimelineBuildOptions = {},
  ): Timeline {
    const includeEmptyRules = options.includeEmptyRules ?? true;
    const pluginMap = new Map<string, MutableTimelinePlugin>();
    let activeRule: ActiveRuleExecution | undefined;

    const appendRule = (execution: ActiveRuleExecution): void => {
      if (!includeEmptyRules && execution.matches.length === 0) {
        return;
      }

      let plugin = pluginMap.get(execution.plugin);

      if (!plugin) {
        plugin = {
          name: execution.plugin,
          rules: [],
        };
        pluginMap.set(execution.plugin, plugin);
      }

      plugin.rules.push({
        name: execution.rule,
        matches: execution.matches,
      });
    };

    for (const event of session.getEvents()) {
      if (event.type === "rule:started") {
        activeRule = {
          plugin: event.plugin,
          rule: event.rule,
          matches: [],
        };
        continue;
      }

      if (event.type === "match:found" && activeRule) {
        if (
          event.plugin === activeRule.plugin &&
          event.rule === activeRule.rule
        ) {
          activeRule.matches.push(event.match);
        }
        continue;
      }

      if (event.type === "rule:finished" && activeRule) {
        if (
          event.plugin === activeRule.plugin &&
          event.rule === activeRule.rule
        ) {
          appendRule(activeRule);
          activeRule = undefined;
        }
      }
    }

    return {
      plugins: [...pluginMap.values()],
    };
  }
}
