
```json
  "dependencies": {
    "@tanstack/react-query": "5.0.0-alpha.71",
    "@tanstack/react-query-devtools": "5.0.0-alpha.72",
    "@types/node": "20.3.3",
    "@types/react": "18.2.14",
    "@types/react-dom": "18.2.6",
    "autoprefixer": "10.4.14",
    "eslint": "8.44.0",
    "eslint-config-next": "13.4.8",
    "js-cookie": "^3.0.5",
    "lucide-react": "^0.258.0",
    "next": "13.4.8",
    "pocketbase": "^0.15.2",
    "postcss": "8.4.24",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "3.3.2",
    "typescript": "5.1.6"
  },
```


```sh
Loading personal and system profiles took 548ms.
PS C:\Users\denni\Desktop\code\next\next-pocketbase-demo> pp dev

> next-demo@0.1.0 dev C:\Users\denni\Desktop\code\next\next-pocketbase-demo
> next dev

- warn Port 3000 is in use, trying 3001 instead.
- ready started server on 0.0.0.0:3001, url: http://localhost:3001
- info Loaded env from C:\Users\denni\Desktop\code\next\next-pocketbase-demo\.env
- warn You have enabled experimental feature (serverActions) in next.config.js.
- warn Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use at your own risk.

- event compiled client and server successfully in 5.7s (20 modules)
- wait compiling...
- event compiled client and server successfully in 1368 ms (20 modules)
- wait compiling /page (client and server)...
- error ./node_modules/.pnpm/@tanstack+query-devtools@5.0.0-alpha.72/node_modules/@tanstack/query-devtools/dist/esm/Devtools-ae26dfd2.js
Attempted import error: 'template' is not exported from 'solid-js/web' (imported as 'template').

Import trace for requested module:
./node_modules/.pnpm/@tanstack+query-devtools@5.0.0-alpha.72/node_modules/@tanstack/query-devtools/dist/esm/Devtools-ae26dfd2.js
./node_modules/.pnpm/@tanstack+query-devtools@5.0.0-alpha.72/node_modules/@tanstack/query-devtools/dist/esm/index.js
./node_modules/.pnpm/@tanstack+react-query-devtools@5.0.0-alpha.72_@tanstack+react-query@5.0.0-alpha.71_react-dom@18.2.0_react@18.2.0/node_modules/@tanstack/react-query-devtools/build/lib/devtools.js
./node_modules/.pnpm/@tanstack+react-query-devtools@5.0.0-alpha.72_@tanstack+react-query@5.0.0-alpha.71_react-dom@18.2.0_react@18.2.0/node_modules/@tanstack/react-query-devtools/build/lib/index.js
./src/app/root/AppWrapper.tsx
- wait compiling...
- event compiled successfully in 1363 ms (327 modules)
- wait compiling...
- event compiled successfully in 260 ms (313 modules)
- wait compiling /_error (client and server)...
- error ./node_modules/.pnpm/@tanstack+query-devtools@5.0.0-alpha.72/node_modules/@tanstack/query-devtools/dist/esm/Devtools-ae26dfd2.js
Attempted import error: 'template' is not exported from 'solid-js/web' (imported as 'template').

Import trace for requested module:
./node_modules/.pnpm/@tanstack+query-devtools@5.0.0-alpha.72/node_modules/@tanstack/query-devtools/dist/esm/Devtools-ae26dfd2.js
./node_modules/.pnpm/@tanstack+query-devtools@5.0.0-alpha.72/node_modules/@tanstack/query-devtools/dist/esm/index.js
./node_modules/.pnpm/@tanstack+react-query-devtools@5.0.0-alpha.72_@tanstack+react-query@5.0.0-alpha.71_react-dom@18.2.0_react@18.2.0/node_modules/@tanstack/react-query-devtools/build/lib/devtools.js
./node_modules/.pnpm/@tanstack+react-query-devtools@5.0.0-alpha.72_@tanstack+react-query@5.0.0-alpha.71_react-dom@18.2.0_react@18.2.0/node_modules/@tanstack/react-query-devtools/build/lib/index.js
./src/app/root/AppWrapper.tsx

```
