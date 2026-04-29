/** Evita que % e _ no texto do usuário se comportem como curingas em ILIKE. */
export function escapeForIlike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/[%_]/g, '\\$&')
}

/** Busca parcial: encontra o trecho em qualquer parte do texto (nome, sobrenome, etc.). */
export function ilikeContainsPattern(value: string): string {
  return `%${escapeForIlike(value.trim())}%`
}
