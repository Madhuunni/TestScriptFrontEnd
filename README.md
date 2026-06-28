# Test Script Front End

Angular frontend for submitting prompt text to the TestScriptFunction backend handler and displaying row-by-row test results.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Update the handler endpoint in `src/environments/environment.ts` if your backend function is not running at the default URL.

3. Start the development server:

   ```bash
   npm start
   ```

## Backend contract

Each prompt row posts JSON to the configured handler URL:

```json
{
  "prompt": "Prompt text entered by the user"
}
```

The response panel displays `results`, `result`, `response`, or `message` when present. If the backend returns another JSON shape, the full response object is displayed.
