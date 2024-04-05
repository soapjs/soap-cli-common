import { SchemaTools } from "../../schemas";
import { TypeInfo } from "../../type.info";

export class ComponentJsonFactory {
  static create<T = any>(type: TypeInfo, data?: { [key: string]: any }): T {
    let json: T;
    if (type.isModel) {
      json = <T>{
        name: data?.name || type.ref,
        endpoint: data?.endpoint,
        types: data?.types || ["json"],
        props: data?.props,
        generics: data?.generics,
        alias: data?.alias,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isEntity) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        endpoint: data?.endpoint,
        has_model: data?.has_model,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isCollection) {
      json = <T>{
        id: data?.id,
        name: data?.name || type.ref,
        types: data?.types,
        table: data?.table,
        endpoint: data?.endpoint,
        model: data?.model,
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isController) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        endpoint: data?.endpoint,
        handlers: data?.handlers,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isMapper) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        types: data?.types,
        endpoint: data?.endpoint,
        model: data?.model,
        entity: data?.entity,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isRepository) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        entity: data?.entity,
        impl: data?.impl,
        endpoint: data?.endpoint,
        contexts: data?.contexts,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isRoute) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        controller: data?.controller,
        handler: data?.handler,
        endpoint: data?.endpoint,
        request: data?.request,
        response: data?.response,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isRouteModel) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        method: data?.method,
        endpoint: data?.endpoint,
        types: data?.types,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isService) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        endpoint: data?.endpoint,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    } else if (type.isToolset) {
      json = <T>{
        is_abstract: data?.is_abstract,
        exp: data?.exp,
        ctor: data?.ctor,
        interfaces: data?.interfaces,
        inheritance: data?.inheritance,
        props: data?.props,
        methods: data?.methods,
        generics: data?.generics,
        imports: data?.imports,
        name: data?.name || type.ref,
        id: data?.id,
        endpoint: data?.endpoint,
        layer: data?.layer,
        write_method: data?.write_method,
        rank: data?.rank,
      };
    }

    return SchemaTools.removeNullUndefined(json);
  }
}
