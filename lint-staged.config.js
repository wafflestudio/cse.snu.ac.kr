export default {
  '*': [
    'biome check --no-errors-on-unmatched --files-ignore-unknown=true --write',
    () => 'pnpm typecheck',
  ],
};
