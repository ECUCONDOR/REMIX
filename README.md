# ECUCONDOR Web Application

## Descripción General
ECUCONDOR es una aplicación web moderna construida con Remix.js, diseñada para proporcionar una experiencia de usuario fluida y moderna. La aplicación utiliza un stack tecnológico robusto y sigue las mejores prácticas de desarrollo.

## Stack Tecnológico
- **Framework**: Remix.js con TypeScript
- **Estilos**: TailwindCSS
- **Componentes UI**: Radix UI
- **Base de Datos**: Supabase
- **Autenticación**: Supabase Auth
- **Gestión de Estado**: React Hook Form
- **Animaciones**: Framer Motion
- **Manejo de Fechas**: date-fns
- **Íconos**: Lucide React

## Estructura del Proyecto
```
ecucondor-web/
├── app/           # Código principal de la aplicación
├── api/           # Rutas de API
├── components/    # Componentes compartidos  
├── public/        # Archivos estáticos
├── supabase/      # Configuración de Supabase
└── styles/        # CSS y archivos de estilo
```

## Requisitos del Sistema
- Node.js ^20.4.0
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd ecucondor-web
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
```

## Comandos de Desarrollo

- **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

- **Construir para producción**:
```bash
npm run build
```

- **Verificar tipos TypeScript**:
```bash
npm run typecheck
```

- **Ejecutar linter**:
```bash
npm run lint
```

- **Formatear código**:
```bash
npm run format
```

## Configuración de Despliegue (Vercel)

1. **Preparación**:
   - Asegurarse de tener instalado `vite-tsconfig-paths`
   - Verificar la configuración en `vite.config.ts`
   - Configurar correctamente `remix.config.js`

2. **Archivos de Configuración**:

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
    }),
    tsconfigPaths()
  ],
  server: {
    port: 3000,
    host: "localhost",
  },
});
```

### remix.config.js
```javascript
/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: "node",
  tailwind: true,
  postcss: true,
  watchPaths: ["./tailwind.config.ts"],
  serverMinify: true,
};
```

3. **Despliegue**:
```bash
vercel deploy --prod
```

## Solución de Problemas Comunes

1. **Error de importación CSS**:
   - Usar importación side-effect: `import "~/styles/app.css"`
   - No usar import con default export

2. **Errores de TypeScript**:
   - Verificar la configuración en `tsconfig.json`
   - Asegurarse de que todos los tipos estén correctamente definidos

3. **Problemas de Build en Vercel**:
   - Limpiar caché de build
   - Verificar logs en `_logs`
   - Asegurarse de tener todas las dependencias necesarias

## Contribución
Por favor, lee la guía de contribución antes de enviar un pull request.

## Licencia
[Tipo de Licencia]
