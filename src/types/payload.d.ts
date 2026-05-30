// When update --latest was executed, it updated the project's TypeScript compilation rules. TypeScript 6.x is stricter about side-effect imports (like import '@payloadcms/next/css'). Because this CSS module is generated dynamically by Payload CMS at runtime, TypeScript could not find static type definitions for it, resulting in the build-breaking TS2882 error.

declare module '@payloadcms/next/css';


