import * as os from 'os';

export type MessageBuilderConfig = {

};

export class MessageBuilder {
  text = '';

  // default
  config: MessageBuilderConfig = {};

  constructor(config: MessageBuilderConfig = {}) {
    this.config = config;
  }

  addText(text: string): MessageBuilder {
    this.text = `${this.text}${text}`;
    return this;
  }

  newLine(text: string): MessageBuilder {
    this.text = `${this.text}${os.EOL}`;
    this.addText(text);
    return this;
  }

  toSring(): string {
    return this.text;
  }
}
