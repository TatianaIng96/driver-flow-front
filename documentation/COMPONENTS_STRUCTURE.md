# Estructura de Componentes - Atomic Design

## Clasificación Completa

### Atoms (Componentes Básicos)

Componentes más pequeños y fundamentales. Son reutilizables en todo el proyecto.

```
components/atoms/
├── Badge.tsx          # Etiquetas de estado/categoría
├── Button.tsx         # Botones con variantes
├── Card.tsx           # Tarjetas de contenido
├── Input.tsx          # Campos de entrada
└── index.ts           # Barrel export
```

**Uso:**
```typescript
import { Button, Input, Card, Badge } from '../components/atoms';
```

---

### Molecules (Componentes Compuestos)

Componentes formados por la combinación de atoms.

```
components/molecules/
├── AddMemberModal.tsx # Modal para agregar miembros
└── index.ts           # Barrel export
```

**Uso:**
```typescript
import { AddMemberModal } from '../components/molecules';
```

---

### Organisms (Componentes Complejos)

Secciones complejas de la interfaz que pueden contener atoms, molecules y lógica de negocio.

```
components/organisms/
├── Sidebars
│   ├── SuperAdminSidebar.tsx
│   ├── OperatorSidebar.tsx
│   └── Sidebar.tsx
│
├── Dashboards
│   ├── SuperAdminDashboard.tsx
│   ├── OperatorDashboard.tsx
│   └── AdminDashboard.tsx
│
├── Lists
│   ├── OperatorsList.tsx
│   ├── OperatorDriversList.tsx
│   ├── OperatorClientsList.tsx
│   ├── OperatorGroupsList.tsx
│   ├── DriversList.tsx
│   ├── ClientsList.tsx
│   ├── GroupsList.tsx
│   └── ServicesList.tsx
│
├── Details
│   ├── OperatorDetail.tsx
│   ├── OperatorGroupDetail.tsx
│   ├── DriverDetail.tsx
│   ├── ClientDetail.tsx
│   ├── GroupDetail.tsx
│   └── ServiceDetail.tsx
│
├── Settings & Config
│   ├── OperatorSettings.tsx
│   └── BotRulesConfig.tsx
│
├── Other
│   ├── WhatsAppConnection.tsx
│   ├── DriversMap.tsx
│   └── BannedNumbers.tsx
│
└── index.ts           # Barrel export
```

**Uso:**
```typescript
import {
  SuperAdminSidebar,
  OperatorDashboard,
  OperatorsList,
  OperatorDetail
} from '../components/organisms';
```

---

### Common (Componentes Compartidos)

Componentes utilitarios y de protección compartidos entre roles.

```
components/common/
├── ProtectedRoute.tsx  # Protección de rutas autenticadas
└── RoleGuard.tsx       # Protección por roles
```

**Uso:**
```typescript
import { ProtectedRoute, RoleGuard } from '../components/common';
```

---

### Templates (Plantillas)

Esqueletos de páginas que definen la estructura general.

```
components/templates/
└── (futuras plantillas)
```

---

### UI (Componentes de Terceros)

Componentes de librerías externas como shadcn/ui.

```
components/ui/
└── (componentes de shadcn/ui)
```

---

## Guía de Uso por Tipo

### Cuándo Crear un Atom

- Es un componente básico e indivisible
- Es altamente reutilizable
- No tiene lógica de negocio
- Ejemplos: Button, Input, Badge, Avatar, Icon

```typescript
// ✅ Correcto para Atom
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// ❌ No es un Atom (tiene lógica de negocio)
export function SubmitButton() {
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(submitForm());
  };
  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Cuándo Crear un Molecule

- Combina 2-3 atoms
- Tiene lógica simple
- Es reutilizable en varios contextos
- Ejemplos: SearchBar (Input + Button), FormField (Label + Input + Error), Modal

```typescript
// ✅ Correcto para Molecule
export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  return (
    <div>
      <Input value={value} onChange={setValue} />
      <Button onClick={() => onSearch(value)}>Buscar</Button>
    </div>
  );
}
```

### Cuándo Crear un Organism

- Es una sección completa de la UI
- Puede contener atoms y molecules
- Puede tener lógica de negocio compleja
- Puede consumir servicios/API
- Ejemplos: Sidebar, Dashboard, DataTable, UserProfile

```typescript
// ✅ Correcto para Organism
export function OperatorDashboard({ operator }: Props) {
  const { data: stats } = useGetStatsQuery(operator.id);

  return (
    <Card>
      <h2>{operator.name}</h2>
      <StatsGrid stats={stats} />
      <ActionButtons />
    </Card>
  );
}
```

---

## Migración de Componentes Existentes

### Proceso de Migración

1. **Identificar el tipo** (Atom, Molecule u Organism)
2. **Mover el archivo** a la carpeta correspondiente
3. **Actualizar imports** en los archivos que lo usan
4. **Agregar export** en el index.ts del directorio

### Ejemplo de Migración

**Antes:**
```
src/components/MyComponent.tsx
```

**Después:**
```
src/components/organisms/MyComponent.tsx
```

**Actualizar imports:**
```typescript
// Antes
import { MyComponent } from '../components/MyComponent';

// Después
import { MyComponent } from '../components/organisms';
```

---

## Convenciones de Nombres

### Atoms
- Nombres descriptivos simples
- PascalCase
- Ejemplos: `Button`, `Input`, `Badge`, `Avatar`

### Molecules
- Nombres que describen la función
- PascalCase
- Ejemplos: `SearchBar`, `FormField`, `AlertBox`, `AddMemberModal`

### Organisms
- Nombres que describen la sección
- PascalCase
- Ejemplos: `UserProfile`, `OperatorDashboard`, `ProductList`

---

## Barrel Exports

Cada directorio tiene un `index.ts` para facilitar los imports:

```typescript
// components/atoms/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Badge } from './Badge';

// Uso
import { Button, Input } from '../components/atoms';
```

---

## Testing

### Estructura de Tests

```
src/components/
├── atoms/
│   ├── Button.tsx
│   └── Button.test.tsx
├── molecules/
│   ├── SearchBar.tsx
│   └── SearchBar.test.tsx
└── organisms/
    ├── Dashboard.tsx
    └── Dashboard.test.tsx
```

### Ejemplo de Test por Tipo

**Atom Test:**
```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

**Molecule Test:**
```typescript
// SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

test('calls onSearch when button is clicked', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);

  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
  fireEvent.click(screen.getByText('Buscar'));

  expect(onSearch).toHaveBeenCalledWith('test');
});
```

**Organism Test:**
```typescript
// Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { Provider } from 'react-redux';
import { store } from '../../store';

test('renders dashboard with stats', () => {
  render(
    <Provider store={store}>
      <Dashboard operatorId="op1" />
    </Provider>
  );

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

---

## Mejores Prácticas

### 1. Single Responsibility
Cada componente debe tener una única responsabilidad clara.

```typescript
// ✅ Bueno - Una responsabilidad
export function UserAvatar({ user }: Props) {
  return <img src={user.avatar} alt={user.name} />;
}

// ❌ Malo - Múltiples responsabilidades
export function UserAvatarWithSettings({ user }: Props) {
  return (
    <>
      <img src={user.avatar} alt={user.name} />
      <button onClick={openSettings}>Settings</button>
      <SettingsPanel />
    </>
  );
}
```

### 2. Composición sobre Configuración
Preferir composición de componentes sobre props de configuración complejas.

```typescript
// ✅ Bueno - Composición
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>

// ❌ Malo - Configuración compleja
<Card
  title="Título"
  showHeader={true}
  headerConfig={{ align: 'center', size: 'lg' }}
  content="Contenido"
/>
```

### 3. Props Typing
Siempre tipar las props con TypeScript.

```typescript
interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ...
}
```

### 4. Default Props
Usar default values en la destructuración.

```typescript
// ✅ Bueno
export function Button({ variant = 'primary', size = 'md' }: ButtonProps) {
  // ...
}

// ❌ Malo
Button.defaultProps = {
  variant: 'primary',
  size: 'md'
};
```

### 5. Exports
Usar named exports, no default exports.

```typescript
// ✅ Bueno
export function Button() { }

// ❌ Malo
export default function Button() { }
```

---

## Recursos

- [Atomic Design por Brad Frost](https://atomicdesign.bradfrost.com/)
- [Component Driven Development](https://www.componentdriven.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Última actualización:** Enero 2026
**Versión:** 2.0
