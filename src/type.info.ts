import { Config } from "./config";
import { BasicType } from "./enums";

export type TypeInfoObject = {
  name: string;
  ref: string;
  tag: string;
  isArray?: boolean;
  isSet?: boolean;
  isMap?: boolean;
  isIterable?: boolean;
  isPrimitive?: boolean;
  isUnknownType?: boolean;
  isDatabaseType?: boolean;
  isFrameworkDefaultType?: boolean;
  isMultiType?: boolean;
  isComponentType?: boolean;
  isInterface?: boolean;
  isClass?: boolean;
  isEntity?: boolean;
  isToolset?: boolean;
  isDataContext?: boolean;
  isModel?: boolean;
  isSource?: boolean;
  isRepository?: boolean;
  isRepositoryImpl?: boolean;
  isRepositoryFactory?: boolean;
  isUseCase?: boolean;
  isController?: boolean;
  isMapper?: boolean;
  isRoute?: boolean;
  isRouteIO?: boolean;
  isRouteModel?: boolean;
  isRouteSchema?: boolean;
  isContainer?: boolean;
  isLauncher?: boolean;
  isRouter?: boolean;
  isConfig?: boolean;
  isService?: boolean;
  isConfigInstructionType?: boolean;
  isTestSuite?: boolean;
  isResult?: boolean;
  isVoid?: boolean;
  type?: string;
  component?: string;
};

export type ComponentLabel =
  | "model"
  | "toolset"
  | "entity"
  | "use_case"
  | "controller"
  | "mapper"
  | "repository"
  | "repository_impl"
  | "collection"
  | "service"
  | "service_impl"
  | "route"
  | "route_model"
  | "route_schema"
  | "router"
  | "launcher"
  | "container"
  | "config"
  | "route_io";

export abstract class TypeInfo {
  public static areIdentical(a: TypeInfo, b: TypeInfo) {
    return (
      a.name === a.name && a.type === b.type && a.component === b.component
    );
  }

  public static create(data: string, config: Config): TypeInfo {
    if (!data || data.trim() === "unknown" || data.trim().length === 0) {
      return UnknownType.create();
    }

    const typeLC = data.toLowerCase();

    const resultMatch = data.match(/^Result\s*<\s*([a-zA-Z0-9<>_,\[\]]+)\s*>/i);
    if (resultMatch) {
      return ResultType.create(TypeInfo.create(resultMatch[1], config));
    }

    const responseMatch = data.match(
      /^RouteResponse\s*<\s*([a-zA-Z0-9<>_,\[\]]+)\s*>/i
    );
    if (responseMatch) {
      const name = responseMatch[1];
      return RouteResponseType.create(name);
    }

    const requestMatch = data.match(
      /^RouteRequest\s*<\s*(\w+)?\s*,?\s*(\w+)?\s*,?\s*(\w+)?>/i
    );
    if (requestMatch) {
      const body = requestMatch[1];
      const params = requestMatch[2];
      const query = requestMatch[3];
      return RouteRequestType.create(body, params, query);
    }

    const entityMatch = data.match(/^Entity\s*<\s*(\w+)\s*>/i);
    if (entityMatch) {
      const ref = entityMatch[1];
      const name = config.presets.entity.generateName(ref);
      return EntityType.create(name, ref);
    }

    const toolsetMatch = data.match(/^Toolset\s*<\s*(\w+)\s*>/i);
    if (toolsetMatch) {
      const ref = toolsetMatch[1];
      const name = config.presets.toolset.generateName(ref);
      return ToolsetType.create(name, ref);
    }

    const modelMatch = data.match(/^Model\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i);
    if (modelMatch) {
      const ref = modelMatch[1];
      const type = modelMatch[2]?.toLowerCase() || "json";
      const name = config.presets.model.generateName(ref, { type });

      return ModelType.create(name, ref, type);
    }

    const dataContextMatch = data.match(
      /^DataContext\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i
    );
    if (dataContextMatch) {
      const entity = dataContextMatch[1];
      const model = dataContextMatch[2];

      return DataContextType.create(entity, model);
    }

    const useCaseMatch = data.match(/^UseCase\s*<\s*(\w+)\s*>/i);
    if (useCaseMatch) {
      const ref = useCaseMatch[1];
      const name = config.presets.use_case.generateName(ref);
      return UseCaseType.create(name, ref);
    }

    const controllerMatch = data.match(/^Controller\s*<\s*(\w+)\s*>/i);
    if (controllerMatch) {
      const ref = controllerMatch[1];
      const name = config.presets.controller.generateName(ref);
      return ControllerType.create(name, ref);
    }

    const repositoryMatch = data.match(/^Repository\s*<\s*(\w+)\s*>/i);
    if (repositoryMatch) {
      const ref = repositoryMatch[1];
      const name = config.presets.repository.generateName(ref);
      return RepositoryType.create(name, ref);
    }

    const repositoryImplMatch = data.match(
      /^RepositoryImpl\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i
    );
    if (repositoryImplMatch) {
      const ref = repositoryImplMatch[1];
      const name = config.presets.repository_impl.generateName(ref);
      return RepositoryImplType.create(name, ref);
    }

    const collectionMatch = data.match(
      /^Collection\s*<\s*(\w+),?\s*(\w+)?\s*>/i
    );
    if (collectionMatch) {
      const ref = collectionMatch[1];
      const type = collectionMatch[2]?.toLowerCase();
      const name = config.presets.collection.generateName(ref, { type });
      return CollectionType.create(name, ref, type);
    }

    const serviceMatch = data.match(/^Service\s*<\s*(\w+)\s*>/i);
    if (serviceMatch) {
      const ref = serviceMatch[1];
      const name = config.presets.service.generateName(ref);
      return ServiceType.create(name, ref);
    }

    const serviceImplMatch = data.match(/^ServiceImpl\s*<\s*(\w+)\s*>/i);
    if (serviceImplMatch) {
      const ref = serviceImplMatch[1];
      const name = config.presets.service.generateName(ref);
      return ServiceType.create(name, ref);
    }

    const mapperMatch = data.match(/^Mapper\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i);
    if (mapperMatch) {
      const ref = mapperMatch[1];
      const type = mapperMatch[2]?.toLowerCase();
      const name = config.presets.mapper.generateName(ref, { type });
      return MapperType.create(name, ref, type);
    }

    const routeMatch = data.match(/^Route\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i);
    if (routeMatch) {
      const ref = routeMatch[1];
      const method = routeMatch[2]?.toLowerCase() || "get";
      const name = config.presets.route.generateName(ref, {
        method,
      });
      return RouteType.create(name, ref, method);
    }

    const routeModelMatch = data.match(
      /^RouteModel\s*<\s*(\w+)\s*,?\s*(\w+)?\s*,?\s*(\w+)?\s*>/i
    );
    if (routeModelMatch) {
      const ref = routeModelMatch[1];
      const method = routeModelMatch[2]?.toLowerCase();
      const type = routeModelMatch[3]?.toLowerCase();
      const name = config.presets.route_model.generateName(ref, {
        type,
        method,
      });
      return RouteModelType.create(name, ref, method, type);
    }

    const routeIOMatch = data.match(/^RouteIO\s*<\s*(\w+)\s*,?\s*(\w+)?\s*>/i);
    if (routeIOMatch) {
      const ref = routeIOMatch[1];
      const method = routeModelMatch[2]?.toLowerCase();
      const name = config.presets.route_io.generateName(ref, { method });
      return RouteIOType.create(name, ref, method);
    }

    const multiMatch = data.match(/^MultiType\s*<\s*([a-zA-Z0-9|& <>]+)\s*>/i);
    if (multiMatch) {
      const chain = new Set<TypeInfo | "|" | "&">();
      const match = routeIOMatch[1].match(/[a-zA-Z0-9<>, ]+|[|&]/g);
      if (Array.isArray(match)) {
        match.forEach((str) => {
          if (str !== "|" && str !== "&") {
            chain.add(TypeInfo.create(str.trim(), config));
          } else {
            chain.add(str);
          }
        });
      }
      const ch = [...chain];
      return MultiType.create(ch);
    }

    const arrMatch =
      data.match(/^Array\s*<\s*([a-zA-Z0-9<>_, ]+)\s*>/i) ||
      data.match(/^([a-zA-Z0-9_, ]+)\s*\[\]/i);

    if (arrMatch) {
      const itemType = TypeInfo.create(arrMatch[1], config);
      return ArrayType.create(itemType);
    }

    const setMatch = data.match(/^Set\s*<\s*([a-zA-Z0-9<>_, ]+)\s*>/i);
    if (setMatch) {
      const itemType = TypeInfo.create(setMatch[1], config);

      return SetType.create(itemType);
    }

    const mapMatch = data.match(
      /^Map\s*<\s*([a-zA-Z0-9<>_, ]+),\s*([a-zA-Z0-9<>_, ]+)\s*>/i
    );

    if (mapMatch) {
      const map = {
        keyType: TypeInfo.create(mapMatch[1], config),
        valueType: TypeInfo.create(mapMatch[2], config),
      };

      return MapType.create(map.keyType, map.valueType);
    }

    for (const r of config.reservedTypes) {
      if (r.name.toLowerCase() === typeLC) {
        if (r.category === "DatabaseType") {
          return DatabaseType.create(data);
        } else if (r.category === "FrameworkDefault") {
          return FrameworkDefaultType.create(data);
        } else if (r.category === "Primitive") {
          return PrimitiveType.create(data);
        }
      }
    }

    return ModelType.create(
      config.presets.model.generateName(data, { type: "json" }),
      data,
      "json"
    );
  }

  public static isResult(type: TypeInfo): type is ResultType {
    return type.isResult;
  }

  public static isArray(type: TypeInfo): type is ArrayType {
    return type.isArray;
  }

  public static isEntity(type: TypeInfo): type is EntityType {
    return type.isEntity;
  }

  public static isModel(type: TypeInfo): type is ModelType {
    return type.isModel;
  }

  public static isSet(type: TypeInfo): type is SetType {
    return type.isSet;
  }

  public static isMap(type: TypeInfo): type is MapType {
    return type.isMap;
  }

  public static isFrameworkDefault(
    type: TypeInfo
  ): type is FrameworkDefaultType {
    return type.isFrameworkDefaultType;
  }

  public static isMultiType(type: TypeInfo): type is MultiType {
    return type.isMultiType;
  }

  public static isIterableType(type: TypeInfo): boolean {
    return type.isIterable;
  }

  public static isComponentType(type: TypeInfo) {
    return type.isComponentType;
  }

  public static isUnknownType(type: TypeInfo): type is UnknownType {
    return type.isUnknownType;
  }

  public static isConfigInstructionType(
    type: TypeInfo
  ): type is ConfigInstructionType {
    return type.isConfigInstructionType;
  }

  public static isType(type: any): type is TypeInfo {
    return (
      type &&
      (type.isDatabaseType ||
        type.isFrameworkDefaultType ||
        type.isConfigInstructionType ||
        type.isComponentType ||
        type.isPrimitive)
    );
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly isArray?: boolean,
    public readonly keyType?: TypeInfo,
    public readonly valueType?: TypeInfo,
    public readonly itemType?: TypeInfo,
    public readonly isSet?: boolean,
    public readonly isMap?: boolean,
    public readonly isIterable?: boolean,
    public readonly isPrimitive?: boolean,
    public readonly isUnknownType?: boolean,
    public readonly isDatabaseType?: boolean,
    public readonly isFrameworkDefaultType?: boolean,
    public readonly isMultiType?: boolean,
    public readonly isComponentType?: boolean,
    public readonly isInterface?: boolean,
    public readonly isClass?: boolean,
    public readonly isEntity?: boolean,
    public readonly isToolset?: boolean,
    public readonly isDataContext?: boolean,
    public readonly isModel?: boolean,
    public readonly isCollection?: boolean,
    public readonly isRepository?: boolean,
    public readonly isRepositoryImpl?: boolean,
    public readonly isRepositoryFactory?: boolean,
    public readonly isUseCase?: boolean,
    public readonly isController?: boolean,
    public readonly isMapper?: boolean,
    public readonly isResult?: boolean,
    public readonly isRoute?: boolean,
    public readonly isRouteIO?: boolean,
    public readonly isRouteModel?: boolean,
    public readonly isRouteSchema?: boolean,
    public readonly isConfigInstructionType?: boolean,
    public readonly isTestSuite?: boolean,
    public readonly isRouter?: boolean,
    public readonly isContainer?: boolean,
    public readonly isLauncher?: boolean,
    public readonly isConfig?: boolean,
    public readonly isService?: boolean,
    public readonly isVoid?: boolean,
    public readonly type?: string,
    public readonly component?: string,
    public readonly chain?: (TypeInfo | "|" | "&")[]
  ) {}
}

export class ConfigInstructionType {
  public readonly isConfigInstructionType = true;
  static create(name: string) {
    return new ConfigInstructionType(name, name, name);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class DatabaseType {
  public readonly isDatabaseType = true;

  static create(name: string) {
    return new DatabaseType(name, name, name);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class FrameworkDefaultType {
  public readonly isFrameworkDefaultType = true;

  static create(name: string) {
    return new FrameworkDefaultType(name, name, name);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class AnyType {
  public readonly isPrimitive = true;

  static create() {
    return new AnyType(BasicType.Any, BasicType.Any, BasicType.Any);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}
export class NullType {
  public readonly isPrimitive = true;

  static create() {
    return new NullType(BasicType.Null, BasicType.Null, BasicType.Null);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class VoidType {
  public readonly isVoid = true;
  public readonly isPrimitive = true;

  static create() {
    return new VoidType(BasicType.Void, BasicType.Void, BasicType.Void);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class NaNType {
  public readonly isPrimitive = true;

  static create() {
    return new NaNType(BasicType.NaN, BasicType.NaN, BasicType.NaN);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class ObjectType {
  public readonly isPrimitive = true;

  static create() {
    return new ObjectType(BasicType.Object, BasicType.Object, BasicType.Object);
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class UnknownType {
  public readonly isPrimitive = true;
  public readonly isUnknownType = true;

  static create() {
    return new UnknownType(
      BasicType.Unknown,
      BasicType.Unknown,
      BasicType.Unknown
    );
  }

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}

export class DataContextType {
  public readonly isDataContext = true;
  public readonly isComponentType = true;
  public readonly component = "data_context";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly entity: string,
    public readonly model: string
  ) {}

  static create(entity: string, model: string) {
    return new DataContextType(
      `DataContext<${entity},${model}>`,
      `DataContext<${entity},${model}>`,
      `DataContext<${entity},${model}>`,
      entity,
      model
    );
  }
}

export class ModelType {
  public readonly isModel = true;
  public readonly isComponentType = true;
  public readonly component = "model";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly type: string
  ) {}

  static create(name: string, ref: string, type: string) {
    return new ModelType(name, ref, `Model<${ref},${type}>`, type);
  }
}

export class ToolsetType {
  public readonly isToolset = true;
  public readonly isComponentType = true;
  public readonly component = "toolset";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new ToolsetType(name, ref, `Toolset<${ref}>`);
  }
}

export class TestSuiteType {
  public readonly isTestSuite = true;
  public readonly isComponentType = true;
  public readonly component = "test_suite";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly type: string
  ) {}

  static create(name: string, ref: string, type: string) {
    return new TestSuiteType(name, ref, `TestSuite<${ref},${type}>`, type);
  }
}

export class EntityType {
  public readonly isEntity = true;
  public readonly isComponentType = true;
  public readonly component = "entity";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new EntityType(name, ref, `Entity<${ref}>`);
  }
}

export class RouteType {
  public readonly isRoute = true;
  public readonly isComponentType = true;
  public readonly component = "route";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly type: string
  ) {}

  static create(name: string, ref: string, method: string) {
    return new RouteType(name, ref, `Route<${ref},${method}>`, method);
  }
}

export class RouteIOType {
  public readonly isRouteIO = true;
  public readonly isComponentType = true;
  public readonly component = "route_io";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly method: string
  ) {}

  static create(name: string, ref: string, method: string) {
    return new RouteIOType(name, ref, `RouteIO<${ref}, ${method}>`, method);
  }
}

export class RouteSchemaType {
  public readonly isRouteSchema = true;
  public readonly isComponentType = true;
  public readonly component = "route_schema";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new RouteSchemaType(name, ref, `RouteSchema<${ref}>`);
  }
}

export class RouteModelType {
  public readonly isRouteModel = true;
  public readonly isComponentType = true;
  public readonly component = "route_model";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly method: string,
    public readonly type: string
  ) {}

  static create(name: string, ref: string, method: string, type: string) {
    const desc = [ref];
    if (method) {
      desc.push(method);
    }
    if (type) {
      desc.push(type);
    }
    return new RouteModelType(
      name,
      ref,
      `RouteModel<${desc.join(",")}>`,
      method,
      type
    );
  }
}

export class CollectionType {
  public readonly isCollection = true;
  public readonly isComponentType = true;
  public readonly component = "collection";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly type: string
  ) {}

  static create(name: string, ref: string, type: string) {
    return new CollectionType(name, ref, `Collection<${ref},${type}>`, type);
  }
}

export class MapperType {
  public readonly isMapper = true;
  public readonly isComponentType = true;
  public readonly component = "mapper";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly type: string
  ) {}

  static create(name: string, ref: string, type: string) {
    return new MapperType(name, ref, `Mapper<${ref},${type}>`, type);
  }
}

export class ResultType {
  public readonly isResult = true;
  public readonly isFrameworkDefaultType = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly itemType: TypeInfo
  ) {}

  static create(itemType: TypeInfo) {
    return new ResultType(
      `Result<${itemType.name}>`,
      `Result`,
      `Result<${itemType.tag}>`,
      itemType
    );
  }
}

export class RouteResponseType {
  public readonly isFrameworkDefaultType = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(body?: string) {
    let name = `RouteResponse`;
    if (body) {
      name = `RouteResponse<${body}>`;
    }

    return new RouteResponseType(name, `RouteResponse`, name);
  }
}

export class RouteRequestType {
  public readonly isFrameworkDefaultType = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly body: string,
    public readonly params: string,
    public readonly query: string
  ) {}

  static create(body?: string, params?: string, query?: string) {
    let result = [];
    let foundNotNull = false;
    const arr = [body, params, query];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]) {
        foundNotNull = true;
        result.unshift(arr[i]);
      } else if (!arr[i] && foundNotNull) {
        result.unshift("undefined");
      } else if (foundNotNull) {
        result.unshift(arr[i]);
      }
    }

    let name = `RouteRequest`;
    if (result.length > 0) {
      name = `RouteRequest<${result.join(", ")}>`;
    }

    return new RouteRequestType(
      name,
      "RouteRequest",
      name,
      body,
      params,
      query
    );
  }
}

export class UseCaseType {
  public readonly isUseCase = true;
  public readonly isComponentType = true;
  public readonly component = "use_case";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new UseCaseType(name, ref, `UseCase<${ref}>`);
  }
}

export class RepositoryType {
  public readonly isRepository = true;
  public readonly isComponentType = true;
  public readonly component = "repository";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new RepositoryType(name, ref, `Repository<${ref}>`);
  }
}

export class RepositoryImplType {
  public readonly isRepositoryImpl = true;
  public readonly isComponentType = true;
  public readonly component = "repository_impl";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new RepositoryImplType(name, ref, `RepositoryImpl<${ref}>`);
  }
}

export class ServiceType {
  public readonly isService = true;
  public readonly isComponentType = true;
  public readonly component = "service";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new ServiceType(name, ref, `Service<${ref}>`);
  }
}

export class ServiceImplType {
  public readonly isServiceImpl = true;
  public readonly isComponentType = true;
  public readonly component = "service_impl";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new ServiceImplType(name, ref, `ServiceImpl<${ref}>`);
  }
}

export class ControllerType {
  public readonly isController = true;
  public readonly isComponentType = true;
  public readonly component = "controller";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new ControllerType(name, ref, `Controller<${ref}>`);
  }
}

export class RouterType {
  public readonly isRouter = true;
  public readonly isComponentType = true;
  public readonly component = "router";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new RouterType(name, ref, `Router<${ref}>`);
  }
}

export class LauncherType {
  public readonly isLauncher = true;
  public readonly isComponentType = true;
  public readonly component = "launcher";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new LauncherType(name, ref, `Launcher<${ref}>`);
  }
}

export class ConfigType {
  public readonly isConfig = true;
  public readonly isComponentType = true;
  public readonly component = "config";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new ConfigType(name, ref, `Config<${ref}>`);
  }
}

export class ContainerType {
  public readonly isContainer = true;
  public readonly isComponentType = true;
  public readonly component = "container";

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}

  static create(name: string, ref: string) {
    return new ContainerType(name, ref, `Container<${ref}>`);
  }
}

export class ArrayType {
  static create(itemType: TypeInfo) {
    return new ArrayType(
      `Array<${itemType.name}>`,
      `array`,
      `Array<${itemType.tag}>`,
      itemType
    );
  }

  public readonly isPrimitive = true;
  public readonly isArray = true;
  public readonly isIterable = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly itemType: TypeInfo
  ) {}
}

export class SetType {
  static create(itemType: TypeInfo) {
    return new SetType(
      `Set<${itemType.name}>`,
      `set`,
      `Set<${itemType.tag}>`,
      itemType
    );
  }

  public readonly isPrimitive = true;
  public readonly isSet = true;
  public readonly isIterable = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly itemType: TypeInfo
  ) {}
}

export class MapType {
  static create(keyType: TypeInfo, valueType: TypeInfo) {
    return new MapType(
      `Map<${keyType.name},${valueType.name}>`,
      `map`,
      `Map<${keyType.tag},${valueType.tag}>`,
      keyType,
      valueType
    );
  }

  public readonly isPrimitive = true;
  public readonly isMap = true;
  public readonly isIterable = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string,
    public readonly keyType: TypeInfo,
    public readonly valueType: TypeInfo
  ) {}
}

export class MultiType {
  public static create(chain: (TypeInfo | "|" | "&")[]): MultiType {
    const name = chain.reduce((str, c) => {
      str += typeof c === "string" ? c : (str += c.name);
      return str;
    }, "");
    const tag = chain.reduce((name, c) => {
      if (TypeInfo.isType(c)) {
        name += c.name;
      } else {
        name += `${c} `;
      }
      return name;
    }, "");
    return new MultiType(name, "multi_type", chain, `MultiType<${tag}>`);
  }

  public readonly isMultiType = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly chain: (TypeInfo | "|" | "&")[],
    public readonly tag: string
  ) {}
}

export class PrimitiveType {
  static create(name: string) {
    return new PrimitiveType(name, name, name);
  }

  public readonly isPrimitive = true;

  private constructor(
    public readonly name: string,
    public readonly ref: string,
    public readonly tag: string
  ) {}
}
