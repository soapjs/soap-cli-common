import { ElementSchema } from "../components";

export type MetaObject = {
  _isMeta: true;
  flags: string[];
  conditions: MetaCondition[];
  providers: MetaDataProvider[];
};

export type InstructionObject = {
  instruction_type: string;
  source_type: string;
  where: string;
  source_path: string;
  source_operator: string;
  source_value: string;
  path: string;
  command: string;
  target: string;
};

export type MetaCondition = {
  _isCondition: true;
  instruction: InstructionObject;
};

export type MetaDataProviderInstruction = {
  _isProvider: true;
  instruction: InstructionObject;
  placeholder?: string;
};

export type MetaDataProvider = {
  _isProvider: true;
  instructions: MetaDataProviderInstruction[];
  value?: any;
};

export type MetaProcessorContext = {
  addons: { [key: string]: unknown };
  dependencies: any[];
  element: ElementSchema;
  [key: string]: unknown;
};

export abstract class MetaProcessor {
  abstract process(metaObject: MetaObject, context: MetaProcessorContext): void;
}
