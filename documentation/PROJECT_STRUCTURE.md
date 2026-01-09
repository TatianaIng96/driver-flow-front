# Estructura del Proyecto

## Descripción General

El proyecto sigue una arquitectura basada en **Atomic Design** y separación por roles, facilitando la escalabilidad y mantenibilidad del código.

---

## Estructura de Carpetas

```
src/
├── components/               # Componentes siguiendo Atomic Design
│   ├── atoms/               # Componentes más básicos (Button, Input, Badge, Card)
│   ├── molecules/           # Combinaciones de atoms
│   ├── organisms/           # Secciones complejas de UI
│   ├── templates/           # Plantillas de página
│   ├── common/              # Componentes compartidos (ProtectedRoute, RoleGuard)
│   └── ui/                  # Componentes UI de terceros (shadcn/ui)
│
├── pages/                   # Páginas separadas por rol
│   ├── admin/              # Páginas exclusivas del Admin
│   │   ├── DashboardPage.tsx
│   │   ├── OperatorsPage.tsx
│   │   ├── OperatorDetailPage.tsx
│   │   └── index.ts
│   │
│   ├── operator/           # Páginas exclusivas del Operator
│   │   ├── DashboardPage.tsx
│   │   ├── WhatsAppPage.tsx
│   │   ├── DriversPage.tsx
│   │   ├── ClientsPage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── GroupDetailPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── index.ts
│   │
│   └── LoginPage.tsx       # Página de login (compartida)
│
├── layouts/                 # Layouts por rol
│   ├── AdminLayout.tsx     # Layout para Admin (con SuperAdminSidebar)
│   └── OperatorLayout.tsx  # Layout para Operator (con OperatorSidebar)
│
├── features/                # Redux slices por feature
│   └── auth/
│       └── authSlice.ts
│
├── services/                # RTK Query API services
│   ├── api.ts
│   ├── auth.ts
│   └── users.ts
│
├── store/                   # Configuración del store
│   └── index.ts
│
├── hooks.ts                 # Hooks personalizados
├── App.tsx                  # Componente principal
└── main.tsx                 # Entry point
```

---

## Atomic Design

### Atoms (Componentes Básicos)

Componentes más pequeños e indivisibles. No tienen dependencias de otros componentes.

#### Button
```typescript
import { Button } from '../components/atoms';

<Button variant="primary" size="md" fullWidth>
  Guardar
</Button>

// Variantes: primary, secondary, danger, success, outline
// Tamaños: sm, md, lg
```

#### Input
```typescript
import { Input } from '../components/atoms';
import { Mail } from 'lucide-react';

<Input
  label="Email"
  type="email"
  icon={<Mail className="w-5 h-5" />}
  error="Email inválido"
  helperText="Ingresa tu email corporativo"
/>
```

#### Card
```typescript
import { Card } from '../components/atoms';

<Card padding="md" hover>
  <h3>Título</h3>
  <p>Contenido</p>
</Card>

// Padding: none, sm, md, lg
// hover: true/false (agrega efecto hover)
```

#### Badge
```typescript
import { Badge } from '../components/atoms';

<Badge variant="success" size="md">
  Activo
</Badge>

// Variantes: primary, success, warning, danger, info, gray
// Tamaños: sm, md, lg
```

### Molecules (Componentes Compuestos)

Combinaciones de atoms que forman componentes más complejos.

**Ejemplos futuros:**
- SearchBar (Input + Button)
- FormField (Label + Input + Error)
- AlertBox (Icon + Text + Close Button)

### Organisms (Secciones Complejas)

Componentes complejos que forman secciones completas de la interfaz.

**Ejemplos existentes:**
- SuperAdminSidebar
- OperatorSidebar
- WhatsAppConnection
- OperatorSettings

### Templates (Plantillas)

Esqueletos de páginas que definen la estructura.

**Ejemplos:**
- AdminLayout
- OperatorLayout

---

## Separación por Roles

### Admin

**Páginas:**
- `DashboardPage`: Dashboard principal con estadísticas globales
- `OperatorsPage`: Lista de todos los operadores
- `OperatorDetailPage`: Detalle de un operador específico

**Layout:**
- `AdminLayout`: Incluye SuperAdminSidebar y área de contenido

**Ruta de acceso:**
```typescript
if (currentUser.role === 'admin') {
  return (
    <AdminLayout currentView={currentView} onNavigate={navigate}>
      {/* Páginas de admin */}
    </AdminLayout>
  );
}
```

### Operator

**Páginas:**
- `DashboardPage`: Dashboard del operador
- `WhatsAppPage`: Configuración de WhatsApp
- `DriversPage`: Gestión de conductores
- `ClientsPage`: Gestión de clientes
- `GroupsPage`: Lista de grupos
- `GroupDetailPage`: Detalle de un grupo
- `SettingsPage`: Configuración del operador

**Layout:**
- `OperatorLayout`: Incluye OperatorSidebar y área de contenido

**Ruta de acceso:**
```typescript
if (currentUser.role === 'operator') {
  return (
    <OperatorLayout currentView={currentView} onNavigate={navigate} userName={userName}>
      {/* Páginas de operator */}
    </OperatorLayout>
  );
}
```

---

## Flujo de Navegación

```
Usuario no autenticado → LoginPage
                            ↓
                      Autenticación
                            ↓
                    ┌───────┴───────┐
                    │               │
                  Admin          Operator
                    │               │
            AdminLayout      OperatorLayout
                    │               │
         ┌──────────┴────────┐     └───────────┬────────────┐
    Dashboard  Operators   Detail    Dashboard  WhatsApp  Drivers...
```

---

## Componentes Compartidos

### ProtectedRoute

Protege rutas que requieren autenticación:

```typescript
import { ProtectedRoute } from '../components/common';

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### RoleGuard

Protege contenido por rol:

```typescript
import { RoleGuard } from '../components/common';

<RoleGuard allowedRoles={['admin']}>
  <AdminPanel />
</RoleGuard>
```

---

## Cómo Agregar una Nueva Página

### Para Admin:

1. **Crear la página:**
```typescript
// src/pages/admin/NewPage.tsx
export function NewPage() {
  return <div>Nueva página de admin</div>;
}
```

2. **Exportarla en el index:**
```typescript
// src/pages/admin/index.ts
export { NewPage } from './NewPage';
```

3. **Agregarla al App.tsx:**
```typescript
{currentView === 'new-page' && (
  <AdminPages.NewPage />
)}
```

### Para Operator:

Mismo proceso pero en `src/pages/operator/`

---

## Cómo Crear un Nuevo Componente Atom

1. **Crear el archivo:**
```typescript
// src/components/atoms/NewAtom.tsx
import { HTMLAttributes } from 'react';

interface NewAtomProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'custom';
}

export function NewAtom({ variant = 'default', ...props }: NewAtomProps) {
  return <div {...props}>Contenido</div>;
}
```

2. **Exportarlo en el index:**
```typescript
// src/components/atoms/index.ts
export { NewAtom } from './NewAtom';
```

3. **Usarlo:**
```typescript
import { NewAtom } from '../components/atoms';

<NewAtom variant="custom" />
```

---

## Mejores Prácticas

### 1. Separación de Responsabilidades

- **Pages:** Lógica de negocio y composición de componentes
- **Components:** Presentación y UI reutilizable
- **Layouts:** Estructura y navegación
- **Services:** Comunicación con el backend
- **Store:** Estado global

### 2. Naming Conventions

- **Pages:** Sufijo `Page` (ej: `DashboardPage.tsx`)
- **Layouts:** Sufijo `Layout` (ej: `AdminLayout.tsx`)
- **Atoms:** Nombres descriptivos (ej: `Button.tsx`, `Input.tsx`)
- **Exports:** Usar named exports, no default exports (excepto App.tsx)

### 3. Props Typing

Siempre tipar las props con TypeScript:

```typescript
interface ComponentProps {
  title: string;
  count?: number;
  onAction: () => void;
}

export function Component({ title, count = 0, onAction }: ComponentProps) {
  // ...
}
```

### 4. Composición sobre Herencia

Preferir composición de componentes sobre herencia:

```typescript
// ✅ Bueno
<Card padding="md">
  <Button variant="primary">Click</Button>
</Card>

// ❌ Evitar
class CustomCard extends Card {
  // ...
}
```

### 5. Reutilización

- Si un componente se usa en múltiples lugares → `components/atoms` o `components/molecules`
- Si es específico de un rol → `pages/admin` o `pages/operator`
- Si define layout → `layouts/`

---

## Testing

### Estructura de Tests

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── ...
└── pages/
    ├── admin/
    │   ├── DashboardPage.tsx
    │   └── DashboardPage.test.tsx
    └── ...
```

### Ejemplo de Test

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with primary variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });
});
```

---

## Migración de Componentes Existentes

Para migrar componentes antiguos a la nueva estructura:

1. Identificar si es atom, molecule u organism
2. Mover al directorio correspondiente
3. Actualizar imports en archivos que lo usen
4. Agregar export en el index del directorio

---

## Recursos

- [Atomic Design por Brad Frost](https://atomicdesign.bradfrost.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

**Última actualización:** Enero 2026
**Versión:** 2.0
