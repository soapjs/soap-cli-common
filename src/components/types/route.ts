import {
  ClassJson,
  PropJson,
  GenericJson,
  ClassData,
} from "../../schemas/classes";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ElementWithGenerics,
  ComponentElement,
  Component,
  ElementWithInterfaces,
} from "./component";

export type CorsJson = {
  origin?: string | string[] | RegExp;
  methods?: string | string[];
  headers?: string | string[];
  credentials?: boolean;
  max_age?: number;
  [key: string]: any;
};

export type RateLimiterJson = {
  max_requests: number;
  window_ms?: number;
  mandatory?: boolean;
  [key: string]: any;
};

export type AuthJson = {
  type: string;
  algorithm?: string;
  operation?: string;
  token_expires_in?: string | number;
  [key: string]: any;
};

export type RouteRequestJson = {
  method: string;
  path: string; // includes query_params and path_params
  headers?: { [key: string]: any };
  body?: any;
  validate?: boolean;
  auth?: string | AuthJson;
  cors?: CorsJson;
  rate_limiter?: RateLimiterJson;
};

export type RouteResponseJson = {
  [code: number]: any;
};

export type RouteHandlerJson = {
  controller: string; // name/id
  name: string; // name
  input?: string; // model/entity name
  output?: string; // entity name
};

export type RouteJson = ClassJson & {
  id?: string;
  name: string;
  controller: string;
  handler: string;
  endpoint?: string;
  request: RouteRequestJson;
  response?: RouteResponseJson;
};

export type RouteData = ClassData & {
  id?: string;
  name: string;
  controller: string;
  handler: string;
  endpoint?: string;
  request: RouteRequestJson;
  response?: RouteResponseJson;
};

export type RouteModelJson = {
  method: string;
  name: string;
  endpoint?: string;
  types: string[];
  props?: (PropJson | string)[];
  generics?: GenericJson[];
};

export type RouteModelData = {
  method: string;
  name: string;
  endpoint?: string;
  type: string;
  alias?: any;
  props?: (PropJson | string)[];
  generics?: GenericJson[];
};

export type RouteElement = ElementWithImports &
  ElementWithInterfaces &
  ElementWithProps &
  ElementWithMethods &
  ElementWithGenerics &
  ComponentElement;

export type RouteModelElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type RouteModelAddons = {
  modelType: string;
};

export type RouteSchemaElement = ElementWithImports &
  ElementWithProps &
  ElementWithGenerics &
  ComponentElement;

export type RouteModel = Component<RouteModelElement, RouteModelAddons>;
export type RouteIO = Component<RouteElement>;
export type RouteSchema = Component<RouteSchemaElement>;
export type CorsOptions = {
  origin?: string | string[] | RegExp;
  methods?: string | string[];
  headers?: string | string[];
  credentials?: boolean;
  exposedHeaders?: string | string[];
  maxAge?: number;
};

export type ValidatorOptions = {
  validator: string;
  schema: any;
};

export type RateLimiterOptions = {
  maxRequests: number;
  windowMs?: number;
  mandatory?: boolean;
};

export type AuthOptions = {
  authenticator: string;
  type: string;
  operation?: string;
  secretOrKey?: string;
  algorithm?: string;
  issuer?: string;
  audience?: string | string[];
  tokenExpiresIn?: string | number;
  apiKeyHeader?: string;
  apiKeyQueryParam?: string;
};

export type RouteAddons = {
  path: string;
  controller: string;
  handler: string;
  route: string;
  io?: string;
  auth?: AuthOptions;
  schema?: ValidatorOptions;
  cors?: CorsOptions;
  limiter?: RateLimiterOptions;
  middlewares?: string[];
};

export type Route = Component<RouteElement, RouteAddons>;
