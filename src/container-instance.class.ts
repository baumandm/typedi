import { ServiceNotFoundError } from './error/service-not-found.error';
import { CannotInstantiateValueError } from './error/cannot-instantiate-value.error';
import { Token } from './token.class';
import { Constructable } from './types/constructable.type';
import { ServiceIdentifier } from './types/service-identifier.type';
import { ServiceMetadata } from './interfaces/service-metadata.interface';
import { ServiceOptions } from './interfaces/service-options.interface';
import { EMPTY_VALUE } from './empty.const';
import { ContainerIdentifier } from './types/container-identifier.type';
import { Handler } from './interfaces/handler.interface';
import { ContainerRegistry } from './container-registry.class';
import { ContainerScope } from './types/container-scope.type';
import { Disposable } from './types/disposable.type';

// todo: make const
export enum ServiceIdentifierLocation {
  Local = 'local',
  Parent = 'parent',
  None = 'none'
}


/**
 * TypeDI can have multiple containers.
 * One container is ContainerInstance.
 */
export class ContainerInstance implements Disposable {
  /** Container instance id. */
  public readonly id!: ContainerIdentifier;

  /** Metadata for all registered services in this container. */
  private metadataMap: Map<ServiceIdentifier, ServiceMetadata<unknown>> = new Map();

  /**
   * Services registered with 'multiple: true' are saved as simple services
   * with a generated token and the mapping between the original ID and the
   * generated one is stored here. This is handled like this to allow simplifying
   * the inner workings of the service instance.
   */

  /**
   * Indicates if the container has been disposed or not.
   * Any function call should fail when called after being disposed.
   *
   * NOTE: Currently not in use
   */
  private disposed: boolean = false;

  /**
   * The default global container. By default services are registered into this
   * container when registered via `Container.set()` or `@Service` decorator.
   */
  public static defaultContainer = new ContainerInstance("default");

    ContainerRegistry.registerContainer(this);
  }

  /**
   * Checks if the service with given name or type is registered service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   */
  public has<T = unknown>(identifier: ServiceIdentifier<T>): boolean {
    this.throwIfDisposed();

    return !!this.metadataMap.has(identifier) || !!this.multiServiceIds.has(identifier);
  }

  /**
   * Retrieves the service with given name or type from the service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   */
  public get<T = unknown>(identifier: ServiceIdentifier<T>): T {
    this.throwIfDisposed();

    const global = ContainerRegistry.defaultContainer.metadataMap.get(identifier);
    const local = this.metadataMap.get(identifier);
    /** If the service is registered as global we load it from there, otherwise we use the local one. */
    const metadata = global?.scope === 'singleton' ? global : local;

    /** This should never happen as multi services are masked with custom token in Container.set. */
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
  public getMany<T = unknown>(identifier: ServiceIdentifier<T>): T[] {
    this.throwIfDisposed();

    const globalIdMap = ContainerRegistry.defaultContainer.multiServiceIds.get(identifier);
    const localIdMap = this.multiServiceIds.get(identifier);

    /**
     * If the service is registered as singleton we load it from default
     * container, otherwise we use the local one.
     */
    if (globalIdMap?.scope === 'singleton') {
      return globalIdMap.tokens.map(generatedId => ContainerRegistry.defaultContainer.get<T>(generatedId));
    }

    if (localIdMap) {
      return localIdMap.tokens.map(generatedId => this.get<T>(generatedId));
    }

    throw new ServiceNotFoundError(identifier);
  }

  /**
   * Sets a value for the given type or service name in the container.
   */
  public set<T = unknown>(serviceOptions: ServiceOptions<T>): this {
    this.throwIfDisposed();

    /**
     * If the service is marked as singleton, we set it in the default container.
     * (And avoid an infinite loop via checking if we are in the default container or not.)
     */
    if (serviceOptions.scope === 'singleton' && ContainerRegistry.defaultContainer !== this) {
      ContainerRegistry.defaultContainer.set(serviceOptions);

      return this;
    }

    const newMetadata: ServiceMetadata<T> = {
      /**
       * Typescript cannot understand that if ID doesn't exists then type must exists based on the
       * typing so we need to explicitly cast this to a `ServiceIdentifier`
       */
      id: ((serviceOptions as any).id || (serviceOptions as any).type) as ServiceIdentifier,
      type: (serviceOptions as ServiceMetadata<T>).type || null,
      factory: (serviceOptions as ServiceMetadata<T>).factory,
      value: (serviceOptions as ServiceMetadata<T>).value || EMPTY_VALUE,
      multiple: serviceOptions.multiple || false,
      eager: serviceOptions.eager || false,
      scope: serviceOptions.scope || 'container',
      /** We allow overriding the above options via the received config object. */
      ...serviceOptions,
      referencedBy: new Map().set(this.id, this),
    };

    /** If the incoming metadata is marked as multiple we mask the ID and continue saving as single value. */
    if (serviceOptions.multiple) {
      const maskedToken = new Token(`MultiMaskToken-${newMetadata.id.toString()}`);
      const existingMultiGroup = this.multiServiceIds.get(newMetadata.id);

      if (existingMultiGroup) {
        existingMultiGroup.tokens.push(maskedToken);
      } else {
        this.multiServiceIds.set(newMetadata.id, { scope: newMetadata.scope, tokens: [maskedToken] });
      }

      /**
       * We mask the original metadata with this generated ID, mark the service
       * as  and continue multiple: false and continue. Marking it as
       * non-multiple is important otherwise Container.get would refuse to
       * resolve the value.
       */
      newMetadata.id = maskedToken;
      newMetadata.multiple = false;
    }

    const existingMetadata = this.metadataMap.get(newMetadata.id);

    if (existingMetadata) {
      /** Service already exists, we overwrite it. (This is legacy behavior.) */
      // TODO: Here we should differentiate based on the received set option.
      Object.assign(existingMetadata, newMetadata);
    } else {
      /** This service hasn't been registered yet, so we register it. */
      this.metadataMap.set(newMetadata.id, newMetadata);
    }

    /**
     * If the service is eager, we need to create an instance immediately except
     * when the service is also marked as transient. In that case we ignore
     * the eager flag to prevent creating a service what cannot be disposed later.
     */
    if (newMetadata.eager && newMetadata.scope !== 'transient') {
      this.get(newMetadata.id);
    }

    return this;
  }

  /**
   * Removes services with a given service identifiers.
   */
  public remove(identifierOrIdentifierArray: ServiceIdentifier | ServiceIdentifier[]): this {
    this.throwIfDisposed();

    if (Array.isArray(identifierOrIdentifierArray)) {
      identifierOrIdentifierArray.forEach(id => this.remove(id));
    } else {
      const serviceMetadata = this.metadataMap.get(identifierOrIdentifierArray);

      if (serviceMetadata) {
        this.disposeServiceInstance(serviceMetadata);
        this.metadataMap.delete(identifierOrIdentifierArray);
      }
    }

    return this;
  }

  /**
   * Gets a separate container instance for the given instance id.
   */
  public static of(containerId: ContainerIdentifier = 'default'): ContainerInstance {
    // this.throwIfDisposed();

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

  public of(containerId?: ContainerIdentifier): ContainerInstance {
    this.throwIfDisposed();

    // Todo: make this get the constructor at runtime to aid
    // extension of the class.
    return ContainerInstance.of(containerId);
  }

  /**
   * Registers a new handler.
   */
  public registerHandler(handler: Handler): ContainerInstance {
    this.handlers.push(handler);
    return this;
  }

  /**
   * Completely resets the container by removing all previously registered services from it.
   */
  public reset(options: { strategy: 'resetValue' | 'resetServices' } = { strategy: 'resetValue' }): this {
    this.throwIfDisposed();

    switch (options.strategy) {
      case 'resetValue':
        this.metadataMap.forEach(service => this.disposeServiceInstance(service));
        break;
      case 'resetServices':
        this.metadataMap.forEach(service => this.disposeServiceInstance(service));
        this.metadataMap.clear();
        this.multiServiceIds.clear();
        break;
      default:
        throw new Error('Received invalid reset strategy.');
    }
    return this;
  }

  public async dispose(): Promise<void> {
    this.reset({ strategy: 'resetServices' });

    /** We mark the container as disposed, forbidding any further interaction with it. */
    this.disposed = true;
  }

  private throwIfDisposed() {
    if (this.disposed) {
      // TODO: Use custom error.
      throw new Error('Cannot use container after it has been disposed.');
    }
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
      value = new constructableTargetType();
    }

    /** If this is not a transient service, and we resolved something, then we set it as the value. */
    if (serviceMetadata.scope !== 'transient' && value !== EMPTY_VALUE) {
      serviceMetadata.value = value;
    }

    if (value === EMPTY_VALUE) {
      /** This branch should never execute, but better to be safe than sorry. */
      throw new CannotInstantiateValueError(serviceMetadata.id);
    }

    return value;
  }

  /**
   * Checks if the given service metadata contains a destroyable service instance and destroys it in place. If the service
   * contains a callable function named `destroy` it is called but not awaited and the return value is ignored..
   *
   * @param serviceMetadata the service metadata containing the instance to destroy
   * @param force when true the service will be always destroyed even if it's cannot be re-created
   */
  private disposeServiceInstance(serviceMetadata: ServiceMetadata, force = false) {
    this.throwIfDisposed();

    /** We reset value only if we can re-create it (aka type or factory exists). */
    const shouldResetValue = force || !!serviceMetadata.type || !!serviceMetadata.factory;

    if (shouldResetValue) {
      /** If we wound a function named destroy we call it without any params. */
      if (typeof (serviceMetadata?.value as Record<string, unknown>)['dispose'] === 'function') {
        try {
          (serviceMetadata.value as { dispose: CallableFunction }).dispose();
        } catch (error) {
          /** We simply ignore the errors from the destroy function. */
        }
      }

      serviceMetadata.value = EMPTY_VALUE;
    }
  }

  public [Symbol.iterator](): Iterable<[ServiceIdentifier, ServiceMetadata<unknown>]> {
    return this.metadataMap.entries();
  }
}
