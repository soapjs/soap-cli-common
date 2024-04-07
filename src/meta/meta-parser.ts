import { MetaObject, MetaProcessor, MetaProcessorContext } from "./types";

export class MetaParser {
  private metaProcessor: MetaProcessor;

  constructor(metaProcessor: MetaProcessor) {
    this.metaProcessor = metaProcessor;
  }

  public processElement(element: any, context: MetaProcessorContext): void {
    if (element._isMeta) {
      this.metaProcessor.process(element as MetaObject, context);
      return;
    }

    Object.values(element).forEach((value) => {
      if (typeof value === "object" && value !== null) {
        this.processElement(value, context);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "object" && item !== null) {
            this.processElement(item, context);
          }
        });
      }
    });
  }
}
