import { invoke } from "@tauri-apps/api/core"

/**
 * Invoke the greet command from the Rust backend.
 */
export async function greet(name: string): Promise<string> {
  return invoke<string>("greet", { name })
}
