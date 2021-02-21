import { ServiceNotFoundError } from './error/service-not-found.error';
import { CannotInstantiateValueError } from './error/cannot-instantiate-value.error';
import { Token } from './token.class';
import { Constructable } from './types/constructable.type';
import { ServiceIdentifier } from './types/service-identifier.type';
import { ServiceMetadata } from './interfaces/service-metadata.interface';
import { ServiceOptions } from './interfaces/service-options.interface';
import { EMPTY_VALUE } from './empty.const';
import { ContainerIdentifer } from './types/container-identifier.type';
import { Handler } from './interfaces/handler.interface';
import { ContainerRegistry } from './container-registry.class';

/**
 * TypeDI can have multiple containers.
 * One container is ContainerInstance.
 */
export class ContainerInstance {
  /** Container instance id. */
  public readonly id!: ContainerIdentifer;

  /** All registered services in the container. */
  private metadataMap: Map<ServiceIdentifier, ServiceMetadata<unknown>> = new Map();

  /**
   * All registered handlers. The @Inject() decorator uses handlers internally to mark a property for injection.
   **/
  private readonly handlers: Handler[] = [];

  private disposed: boolean = false;

  constructor(id: ContainerIdentifer) {
    this.id = id;

    ContainerRegistry.registerContainer(this);

    /**
     * TODO: This is to replicate the old functionality. This should be copied only
     * TODO: if the container decides to inherit registered classes from a parent container.
     */
    this.handlers = ContainerRegistry.defaultContainer?.handlers || [];
  }

  /**
   * Checks if the service with given name or type is registered service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   */
  has<T = unknown>(identifier: ServiceIdentifier<T>): boolean {
    return !!this.metadataMap.has(identifier);
  }

  /**
   * Retrieves the service with given name or type from the service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   */
  get<T = unknown>(identifier: ServiceIdentifier<T>): T {
    const global = ContainerRegistry.defaultContainer.metadataMap.get(identifier);
    const local = this.metadataMap.get(identifier);
    /** If the service is registered as global we load it from there, otherwise we use the local one. */
    const metadata = global?.scope === 'singleton' ? global : local;

    if (metadata && metadata.multiple === true) {
      throw new Error(`Cannot resolve multiple values for ${identifier.toString()} service!`);
    }

    /** Otherwise it's returned from the current container. */
    if (metadata) {
      return this.getServiceValue(metadata);
    }

    /**
     * If it's the first time requested in the child container we load it from parent and set it.
     * TODO: This will be removed with the container inheritance rework.
     */
    if (global && this !== ContainerRegistry.defaultContainer) {
      const clonedService = { ...global };
      clonedService.value = EMPTY_VALUE;

      /**
       * We need to immediately set the empty value from the root container
       * to prevent infinite lookup in cyclic dependencies.
       */
      this.set(clonedService);

      const value = this.getServiceValue(clonedService);
      this.set({ ...clonedService, value });

      return value;
    }

    throw new ServiceNotFoundError(identifier);
  }

  /**
   * Gets all instances registered in the container of the given service identifier.
   * Used when service defined with multiple: true flag.
   */
  getMany<T = unknown>(identifier: ServiceIdentifier<T>): T[] {
    const global = ContainerRegistry.defaultContainer.metadataMap.get(identifier);
    const local = this.metadataMap.get(identifier);
    /** If the service is registered as global we load it from there, otherwise we use the local one. */
    const metadata = global?.scope === 'singleton' ? global : local;

    /** This function doesn't handle services with multiple: false. */
    if (metadata && metadata.multiple === false) {
      throw new Error(`Cannot resolve non multiple values for ${identifier.toString()} service!`);
    }

    if (metadata) {
      const resolved = metadata.typeMap.map(multiTypeInfo =>
        this.getServiceValue({
          id: metadata.id,
          multiple: false,
          scope: metadata.scope,
          referencedBy: metadata.referencedBy,
          typeMap: [],
          type: multiTypeInfo.type,
          value: multiTypeInfo.value,
          eager: metadata.eager,
          factory: multiTypeInfo.factory,
        })
      );

      /**
       * This is hacky, since we created a one-time used metadata wrapper for the types, we need to
       * set this from the outside manually.
       */
      if (metadata.scope !== 'transient') {
        resolved.map((value, i) => (metadata.typeMap[i].value = value));
      }

      return resolved;
    }

    throw new ServiceNotFoundError(identifier);
  }

  /**
   * Sets a value for the given type or service name in the container.
   */
  set<T = unknown>(metadata: ServiceOptions<T>): this {
    const newService: ServiceMetadata<T> = {
      id: new Token('UNREACHABLE'),
      type: null,
      typeMap: [],
      factory: undefined,
      value: EMPTY_VALUE,
      multiple: false,
      eager: false,
      scope: 'container',
      ...metadata,
      referencedBy: new Map().set(this.id, this),
    };

    const existingMetadata = this.metadataMap.get(newService.id);

    if (existingMetadata && existingMetadata.multiple) {
      /** If we are adding non multiple metadata service to existing multiple metadata */
      if (existingMetadata.multiple && !newService.multiple) {
        throw new Error(`Cannot mix multiple and non-multiple services with same ID (${newService.id.toString()})!`);
      }

      if (existingMetadata.scope !== newService.scope) {
        throw new Error(`Cannot mix scope when using multiple services (ID: ${newService.id.toString()})!`);
      }

      if (existingMetadata.eager !== newService.eager) {
        throw new Error(`Cannot mix eager when using multiple services (ID: ${newService.id.toString()})!`);
      }

      existingMetadata.typeMap.push({
        type: newService.typeMap[0].type,
        factory: newService.typeMap[0].factory,
        value: newService.typeMap[0].value,
      });
    }

    if (existingMetadata && existingMetadata.multiple === false) {
      // TODO: Here we should differentiate based on the received set option.
      Object.assign(existingMetadata, newService);
    }

    /** If this service hasn't been registered yet, we register it. */
    if (!existingMetadata) {
      this.metadataMap.set(newService.id, newService);
    }

    if (newService.eager && newService.multiple === false) {
      this.get(newService.id);
    }

    if (newService.eager && newService.multiple === true) {
      this.getMany(newService.id);
    }

    return this;
  }

  /**
   * Removes services with a given service identifiers.
   */
  public remove(identifierOrIdentifierArray: ServiceIdentifier | ServiceIdentifier[]): this {
    if (Array.isArray(identifierOrIdentifierArray)) {
      identifierOrIdentifierArray.forEach(id => this.remove(id));
    } else {
      const serviceMetadata = this.metadataMap.get(identifierOrIdentifierArray);

      if (serviceMetadata) {
        this.destroyServiceInstance(serviceMetadata);
        this.metadataMap.delete(identifierOrIdentifierArray);
      }
    }

    return this;
  }

  /**
   * Gets a separate container instance for the given instance id.
   */
  public of(containerId: ContainerIdentifer = 'default'): ContainerInstance {
    if (containerId === 'default') {
      return ContainerRegistry.defaultContainer;
    }

    let container: ContainerInstance;

    if (ContainerRegistry.hasContainer(containerId)) {
      container = ContainerRegistry.getContainer(containerId);
    } else {
      /**
       * This is deprecated functionality, for now we create the container if it's doesn't exists.
       * This will be reworked when container inheritance is reworked.
       */
      container = new ContainerInstance(containerId);
    }

    return container;
  }

  /**
   * Registers a new handler.
   */
  public registerHandler(handler: Handler): ContainerInstance {
    this.handlers.push(handler);
    return this;
  }

  /**
   * Helper method that imports given services.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public import(services: Function[]): ContainerInstance {
    return this;
  }

  /**
   * Completely resets the container by removing all previously registered services from it.
   */
  public reset(options: { strategy: 'resetValue' | 'resetServices' } = { strategy: 'resetValue' }): this {
    switch (options.strategy) {
      case 'resetValue':
        this.metadataMap.forEach(service => this.destroyServiceInstance(service));
        break;
      case 'resetServices':
        this.metadataMap.forEach(service => this.destroyServiceInstance(service));
        this.metadataMap.clear();
        break;
      default:
        throw new Error('Received invalid reset strategy.');
    }
    return this;
  }

  public async dispose(): Promise<void> {
    /**
     * Placeholder.
     * This function will dispose all service instances which are registered in this container only.
     */
    this.disposed = true;

    await Promise.resolve();
  }

  /**
   * Gets the value belonging to passed in `ServiceMetadata` instance.
   *
   * - if `serviceMetadata.value` is already set it is immediately returned
   * - otherwise the requested type is resolved to the value saved to `serviceMetadata.value` and returned
   */
  private getServiceValue(serviceMetadata: ServiceMetadata<unknown>): any {
    let value: unknown = EMPTY_VALUE;

    /**
     * If the service value has been set to anything prior to this call we return that value.
     * NOTE: This part builds on the assumption that transient dependencies has no value set ever.
     */
    if (serviceMetadata.value !== EMPTY_VALUE) {
      return serviceMetadata.value;
    }

    /** If it's a multiple type we throw as it's handled in a different function. */
    if (serviceMetadata.multiple) {
      // TODO: add proper error here.
      throw new Error(
        `Cannot request single service when multiple option enabled (ID: ${serviceMetadata.id.toString()})!`
      );
    }

    /** If both factory and type is missing, we cannot resolve the requested ID. */
    if (!serviceMetadata.factory && !serviceMetadata.type) {
      throw new CannotInstantiateValueError(serviceMetadata.id);
    }

    /**
     * If a factory is defined it takes priority over creating an instance via `new`.
     * The return value of the factory is not checked, we believe by design that the user knows what he/she is doing.
     */
    if (serviceMetadata.factory) {
      /**
       * If we received the factory in the [Constructable<Factory>, "functionName"] format, we need to create the
       * factory first and then call the specified function on it.
       */
      if (serviceMetadata.factory instanceof Array) {
        let factoryInstance;

        try {
          /** Try to get the factory from TypeDI first, if failed, fall back to simply initiating the class. */
          factoryInstance = this.get<any>(serviceMetadata.factory[0]);
        } catch (error) {
          if (error instanceof ServiceNotFoundError) {
            factoryInstance = new serviceMetadata.factory[0]();
          } else {
            throw error;
          }
        }

        value = factoryInstance[serviceMetadata.factory[1]](this, serviceMetadata.id);
      } else {
        /** If only a simple function was provided we simply call it. */
        value = serviceMetadata.factory(this, serviceMetadata.id);
      }
    }

    /**
     * If no factory was provided and only then, we create the instance from the type if it was set.
     */
    if (!serviceMetadata.factory && serviceMetadata.type) {
      const constructableTargetType: Constructable<unknown> = serviceMetadata.type;
      // setup constructor parameters for a newly initialized service
      const paramTypes = (Reflect as any)?.getMetadata('design:paramtypes', constructableTargetType) || [];
      const params = this.initializeParams(constructableTargetType, paramTypes);

      // "extra feature" - always pass container instance as the last argument to the service function
      // this allows us to support javascript where we don't have decorators and emitted metadata about dependencies
      // need to be injected, and user can use provided container to get instances he needs
      params.push(this);

      value = new constructableTargetType(...params);

      // TODO: Calling this here, leads to infinite loop, because @Inject decorator registerds a handler
      // TODO: which calls Container.get, which will check if the requested type has a value set and if not
      // TODO: it will start the instantiation process over. So this is currently called outside of the if branch
      // TODO: after the current value has been assigned to the serviceMetadata.
      // this.applyPropertyHandlers(constructableTargetType, value as Constructable<unknown>);
    }

    /** If this is not a transient service, and we resolved something, then we set it as the value. */
    if (serviceMetadata.scope !== 'transient' && value !== EMPTY_VALUE) {
      serviceMetadata.value = value;
    }

    if (value === EMPTY_VALUE) {
      /** This branch should never execute, but better to be safe than sorry. */
      throw new CannotInstantiateValueError(serviceMetadata.id);
    }

    if (serviceMetadata.type) {
      this.applyPropertyHandlers(serviceMetadata.type, value as Record<string, any>);
    }

    return value;
  }

  /**
   * Initializes all parameter types for a given target service class.
   */
  private initializeParams(target: Function, paramTypes: any[]): unknown[] {
    return paramTypes.map((paramType, index) => {
      const paramHandler = this.handlers.find(handler => {
        /**
         * @Inject()-ed values are stored as parameter handlers and they reference their target
         * when created. So when a class is extended the @Inject()-ed values are not inherited
         * because the handler still points to the old object only.
         *
         * As a quick fix a single level parent lookup is added via `Object.getPrototypeOf(target)`,
         * however this should be updated to a more robust solution.
         *
         * TODO: Add proper inheritance handling: either copy the handlers when a class is registered what
         * TODO: has it's parent already registered as dependency or make the lookup search up to the base Object.
         */
        return (
          (handler.object === target || handler.object === Object.getPrototypeOf(target)) && handler.index === index
        );
      });
      if (paramHandler) return paramHandler.value(this);

      if (paramType && paramType.name && !this.isPrimitiveParamType(paramType.name)) {
        return this.get(paramType);
      }

      return undefined;
    });
  }

  /**
   * Checks if given parameter type is primitive type or not.
   */
  private isPrimitiveParamType(paramTypeName: string): boolean {
    return ['string', 'boolean', 'number', 'object'].includes(paramTypeName.toLowerCase());
  }

  /**
   * Applies all registered handlers on a given target class.
   */
  private applyPropertyHandlers(target: Function, instance: { [key: string]: any }) {
    this.handlers.forEach(handler => {
      if (typeof handler.index === 'number') return;
      if (handler.object.constructor !== target && !(target.prototype instanceof handler.object.constructor)) return;

      if (handler.propertyName) {
        instance[handler.propertyName] = handler.value(this);
      }
    });
  }

  /**
   * Checks if the given service metadata contains a destroyable service instance and destroys it in place. If the service
   * contains a callable function named `destroy` it is called but not awaited and the return value is ignored..
   *
   * @param serviceMetadata the service metadata containing the instance to destroy
   * @param force when true the service will be always destroyed even if it's cannot be re-created
   */
  private destroyServiceInstance(serviceMetadata: ServiceMetadata, force = false) {
    /** We reset value only if we can re-create it (aka type or factory exists). */
    const shouldResetValue = force || !!serviceMetadata.type || !!serviceMetadata.factory;

    if (shouldResetValue) {
      /** If we wound a function named destroy we call it without any params. */
      if (typeof (serviceMetadata?.value as Record<string, unknown>)['destroy'] === 'function') {
        try {
          (serviceMetadata.value as { destroy: CallableFunction }).destroy();
        } catch (error) {
          /** We simply ignore the errors from the destroy function. */
        }
      }

      serviceMetadata.typeMap.forEach(metadata => {
        if (typeof (metadata?.value as Record<string, unknown>)['destroy'] === 'function') {
          try {
            (metadata.value as { destroy: CallableFunction }).destroy();
          } catch (error) {
            /** We simply ignore the errors from the destroy function. */
          }
        }
      });

      serviceMetadata.value = EMPTY_VALUE;
      serviceMetadata.typeMap = [];
    }
  }
}
