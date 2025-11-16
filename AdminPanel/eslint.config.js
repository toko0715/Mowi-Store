import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react"; 
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from 'eslint/config';


export default defineConfig([
  js.configs.recommended,
  
  globalIgnores(['dist']), 
  
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    
    rules: {
      "react/react-in-jsx-scope": "off", 
      "react/prop-types": "off", 
      
      ...pluginReactHooks.configs.recommended.rules,
      
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);