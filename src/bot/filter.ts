
import {Event, EventFilterInterface} from "./types";

export class MessageFilter implements EventFilterInterface {
  filter(event: Event): boolean {
    return (event.payload.text && event.payload.text.length > 0);
  }
};

export class CommandFilter extends MessageFilter {
  static COMMAND_PREFIXES = ["/", "."];
  filter(event: Event): boolean {
    if (!super.filter(event)) {
      return false;
    }
    const trimmedText = event.payload.text.trim();
    return (
      trimmedText.startsWith(CommandFilter.COMMAND_PREFIXES[0]) ||
      trimmedText.startsWith(CommandFilter.COMMAND_PREFIXES[1])
    );
  }
};

export class RegexFilter extends MessageFilter {
  pattern: RegExp;
  constructor(private regexp: string) {
    super();
    this.pattern = new RegExp(regexp);
  }
  filter(event: Event): boolean {
    return this.pattern.test(event.payload.text);
  }
};
