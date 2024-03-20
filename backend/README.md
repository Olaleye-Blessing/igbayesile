# Note

Follow this pending the time it will be fixed

When in development mode, this should be used in `package.json`. This is for hot reloading when any file changed, not just server.ts

```json
"_moduleAliases": {
  "@": "src"
}
```

When in production mode/about to push, this should be used in `package.json`

```json
"_moduleAliases": {
  "@": "dist"
}
```
