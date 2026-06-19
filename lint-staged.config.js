export default {
  '*': [
    'biome check --no-errors-on-unmatched --files-ignore-unknown=true --error-on-warnings --write',
    () => 'pnpm typecheck',
  ],
};
