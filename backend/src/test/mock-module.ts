import { mock } from "bun:test"

export const mockModuleWithMutableExports = <T extends object>(
  modulePath: string,
  exports: T
): T => {
  mock.module(modulePath, () => exports)
  return exports
}
