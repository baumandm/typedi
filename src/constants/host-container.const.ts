import { ContainerInstance } from '../container-instance.class';
import { Token } from '../token.class';

/**
 * A special identifier which can be used to get the container
 * the service is currently being executed under.
 * 
 * @example
 * Here is an example:
 * ```ts
 * @Service([
 *   HostContainer()
 * ])
 * class MyService {
 *   constructor (private container: ContainerInstance) { }
 * }
 * ```
 * 
 * @see {@link HostContainer}
 */
export const HOST_CONTAINER = new Token<ContainerInstance>('Host Container');
