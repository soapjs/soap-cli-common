export const use_template_regex = /{{TEMPLATE\s*\(([a-zA-Z0-9-_.]+)\)\s*}}/i;

export type BodyData = {
  instruction?: string;
  template?: string;
  content?: any;
  options?: any;
};

export class BodyTemplateModel {
  static create(body: string | BodyData) {
    let instruction;
    let template;
    let content;
    let options;

    if (!body) {
      return new BodyTemplateModel(template, instruction, "", {});
    }

    if (typeof body === "string") {
      const templateMatch = body.match(use_template_regex);

      if (templateMatch) {
        instruction = templateMatch[0];
        template = templateMatch[1];
      }
    } else if (typeof body === "object") {
      template = body.template;
      instruction = body.instruction;
      content = body.content;
      options = body.options;
    }

    return new BodyTemplateModel(template || 'body', instruction, content, options);
  }

  protected constructor(
    public readonly template,
    public readonly instruction: string,
    public readonly content: any,
    public readonly options: any
  ) {}
}
