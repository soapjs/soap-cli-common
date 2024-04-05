import { Config } from "../../config";
import { WriteMethod } from "../../enums";
import { TypeInfo } from "../../type.info";
import {
  ElementWithImports,
  ElementWithProps,
  ElementWithMethods,
  ComponentElement,
  Component,
} from "./component";
import { Controller } from "./controller";
import { Route } from "./route";

export type RouterElement = ElementWithImports &
  ElementWithProps &
  ElementWithMethods &
  ComponentElement;

export type RouteMountModel = {
  name: string;
  path: string;
  controller: string;
  handler: string;
  skip_controller_resolver?: boolean;
};

export type RouterAddons = { routes: RouteMountModel[] };

export class Router extends Component<RouterElement, RouterAddons> {
  constructor(
    public readonly id: string,
    public readonly type: TypeInfo,
    public readonly path: string,
    public readonly writeMethod: WriteMethod,
    public readonly addons: RouterAddons,
    public readonly element: RouterElement
  ) {
    super(id, type, "", path, writeMethod, 0, addons, element);
  }

  addRoutes(routes: Route[], controllers: Controller[], config: Config) {
    routes.forEach((route) => {
      this.addDependency(route, config);

      const controller = controllers.find((c) => {
        return c.type.name === route.addons.controller;
      });
      this.addDependency(controller, config);

      this.addons.routes.push({
        name: route.type.name,
        ...route.addons,
      });
    });
  }
}
