import {
  MetaObject,
  MetaCondition,
  MetaDataProviderInstruction,
} from "./types";

/*
{{IF DEPENDENCY(WHERE type.isModel IS NOT true).type IS true}}
{{USE DEPENDENCY(WHERE type.type IS input).element.name}}
{{USE DEPENDENCY(WHERE type.type IS input).element.name}}
{{USE DEPENDENCY(WHERE type.type IS input).element.name TO BUILD Array<Param>}}
{{USE ADDONS().table}}

0: "{{USE DEPENDENCY(WHERE type.type IS input).element.name TO BUILD Array<Param>}}"
1: "USE"
2: "DEPENDENCY"
3: "WHERE"
4: "type.type"
5: " IS "
6: "input"
7: "element.name"
8: " TO BUILD "
9: "Array<Param>"
*/
const instruction_regex =
  /{{\s*(USE|IF)\s+(DEPENDENCY|ADDONS|ELEMENT)\(([A-Z]+)?\s*([a-zA-Z.0-9_]+)?(\s+[A-Z=\>\<\! ]+\s+)?([a-zA-Z0-9\"\'\_\- ]+)?\).?([a-z.A-Z0-9\[\]-_\(\)]+)?(\s+[A-Z_ ]+\s+)?([^}]+)?\s*}}/;

const flag_regex = /{{\s*FLAG\s+([a-zA-Z.0-9_,]+)\s*}}/;

export class MetaInstructionParser {
  static hasInstructions(value: string) {
    return new RegExp(/{{\s*(FLAG|USE|IF)\s+.+}}/, "g").test(value);
  }

  private static isMetaCondition(value: any): value is MetaCondition {
    return value && value._isCondition;
  }

  private static isMetaDataProvider(
    value: any
  ): value is MetaDataProviderInstruction {
    return value && value._isProvider;
  }

  private static parseInstruction(
    str: string,
    placeholder?: string
  ): MetaCondition | MetaDataProviderInstruction {
    const [
      ref,
      instruction_type,
      source_type,
      where,
      source_path,
      source_operator,
      source_value,
      path,
      command,
      target,
    ] = str.match(instruction_regex);

    if (instruction_type === "USE") {
      return {
        _isProvider: true,
        instruction: {
          instruction_type,
          source_type,
          where,
          source_path,
          source_operator,
          source_value,
          path,
          command,
          target,
        },
        placeholder,
      } as MetaDataProviderInstruction;
    }

    if (instruction_type === "IF") {
      return {
        _isCondition: true,
        instruction: {
          instruction_type,
          source_type,
          where,
          source_path,
          source_operator,
          source_value,
          path,
          command,
          target,
        },
      } as MetaCondition;
    }
  }

  static parse(instruction: string): MetaObject {
    const meta: MetaObject = {
      _isMeta: true,
      flags: [],
      conditions: [],
      providers: [],
    };
    const instruction_match = instruction.match(
      new RegExp(instruction_regex, "g")
    );
    const flag_match = instruction.match(new RegExp(flag_regex));

    if (Array.isArray(flag_match)) {
      meta.flags.push(...flag_match[1].split(","));
    }

    if (Array.isArray(instruction_match)) {
      if (instruction === instruction_match[0]) {
        const parsed = this.parseInstruction(instruction_match[0]);
        if (this.isMetaCondition(parsed)) {
          meta.conditions.push(parsed);
        } else if (this.isMetaDataProvider(parsed)) {
          meta.providers.push({
            _isProvider: true,
            instructions: [parsed],
          });
        }
      } else {
        const instructions: MetaDataProviderInstruction[] = [];
        let value = instruction;
        instruction_match.forEach((match, i) => {
          const parsed = this.parseInstruction(match, `$${i}`);
          if (this.isMetaDataProvider(parsed)) {
            value = value.replace(match, `$${i}`);
            instructions.push(parsed);
          }
        });
        meta.providers.push({
          _isProvider: true,
          instructions,
          value,
        });
      }
    }

    return meta;
  }
}
