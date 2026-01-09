# Hooks Personalizados

## Tabla de Contenidos
1. [useAuth](#useauth)
2. [useAppDispatch](#useappdispatch)
3. [useAppSelector](#useappselector)

---

## useAuth

Hook principal para acceder a los datos de autenticación desde cualquier componente.

### Ubicación
`src/hooks.ts`

### Uso Básico

```typescript
import { useAuth } from '../hooks';

function MiComponente() {
  const auth = useAuth();

  return (
    <div>
      <p>Usuario: {auth.userName}</p>
      <p>Email: {auth.userEmail}</p>
      <p>Rol: {auth.userRole}</p>
      <p>Autenticado: {auth.isAuthenticated ? 'Sí' : 'No'}</p>
    </div>
  );
}
```

### Propiedades Retornadas

| Propiedad | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `token` | `string \| null` | Token JWT de autenticación | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."` |
| `user` | `User \| null` | Objeto completo del usuario | `{ id: '123', name: 'Juan', ... }` |
| `isAuthenticated` | `boolean` | `true` si hay token y usuario válidos | `true` |
| `isAdmin` | `boolean` | `true` si el rol es 'admin' | `true` |
| `isOperator` | `boolean` | `true` si el rol es 'operator' | `false` |
| `userId` | `string \| undefined` | ID del usuario | `"693dedc28a9caed53ca739de"` |
| `userEmail` | `string \| undefined` | Email del usuario | `"user@example.com"` |
| `userName` | `string \| undefined` | Nombre del usuario | `"Juan Pérez"` |
| `userRole` | `string \| undefined` | Rol del usuario | `"admin"` o `"operator"` |

### Ejemplos Avanzados

#### 1. Destructuración Selectiva
```typescript
import { useAuth } from '../hooks';

function Header() {
  const { userName, userEmail, isAdmin } = useAuth();

  return (
    <header>
      <h1>Bienvenido {userName}</h1>
      <p>{userEmail}</p>
      {isAdmin && (
        <button>Panel de Administración</button>
      )}
    </header>
  );
}
```

#### 2. Protección de Rutas
```typescript
import { useAuth } from '../hooks';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

#### 3. Condicional por Rol
```typescript
import { useAuth } from '../hooks';

function Dashboard() {
  const { isAdmin, isOperator } = useAuth();

  return (
    <div>
      {isAdmin && <AdminDashboard />}
      {isOperator && <OperatorDashboard />}
    </div>
  );
}
```

#### 4. Mostrar Datos del Usuario
```typescript
import { useAuth } from '../hooks';

function UserProfile() {
  const { user, userId, userEmail, userName, userRole } = useAuth();

  if (!user) {
    return <p>No hay usuario autenticado</p>;
  }

  return (
    <div className="profile">
      <h2>Perfil de Usuario</h2>
      <dl>
        <dt>ID:</dt>
        <dd>{userId}</dd>

        <dt>Nombre:</dt>
        <dd>{userName}</dd>

        <dt>Email:</dt>
        <dd>{userEmail}</dd>

        <dt>Rol:</dt>
        <dd>{userRole === 'admin' ? 'Administrador' : 'Operador'}</dd>
      </dl>
    </div>
  );
}
```

#### 5. Usar Token en Peticiones Manuales
```typescript
import { useAuth } from '../hooks';

function DataFetcher() {
  const { token } = useAuth();

  const fetchData = async () => {
    const response = await fetch('/api/protected-data', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  };

  return (
    <button onClick={fetchData}>
      Cargar Datos Protegidos
    </button>
  );
}
```

#### 6. Renderizado Condicional Múltiple
```typescript
import { useAuth } from '../hooks';

function Navigation() {
  const { isAuthenticated, isAdmin, userName } = useAuth();

  if (!isAuthenticated) {
    return (
      <nav>
        <a href="/login">Iniciar Sesión</a>
      </nav>
    );
  }

  return (
    <nav>
      <span>Hola, {userName}</span>
      <a href="/dashboard">Dashboard</a>
      {isAdmin && <a href="/admin">Admin Panel</a>}
      <a href="/logout">Cerrar Sesión</a>
    </nav>
  );
}
```

#### 7. Validación de Permisos
```typescript
import { useAuth } from '../hooks';

function DeleteButton({ onDelete }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null; // Solo admins pueden ver el botón
  }

  return (
    <button onClick={onDelete} className="btn-danger">
      Eliminar
    </button>
  );
}
```

---

## useAppDispatch

Hook tipado para despachar acciones de Redux.

### Uso

```typescript
import { useAppDispatch } from '../hooks';
import { setCredentials, logout } from '../features/auth/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();

  const handleLogin = (token, user) => {
    dispatch(setCredentials({ token, user }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
```

---

## useAppSelector

Hook tipado para seleccionar datos del store de Redux.

### Uso

```typescript
import { useAppSelector } from '../hooks';

function UserInfo() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  return (
    <div>
      <p>Usuario: {user?.name}</p>
      <p>Token presente: {token ? 'Sí' : 'No'}</p>
    </div>
  );
}
```

### Selección Múltiple

```typescript
import { useAppSelector } from '../hooks';

function Dashboard() {
  const { user, token } = useAppSelector((state) => ({
    user: state.auth.user,
    token: state.auth.token,
  }));

  return (
    <div>
      <h1>Dashboard de {user?.name}</h1>
    </div>
  );
}
```

---

## Mejores Prácticas

1. **Usa `useAuth` para acceso a autenticación**: Es más limpio y conveniente que `useAppSelector`
2. **Destructura solo lo necesario**: Evita re-renders innecesarios
3. **Valida antes de usar**: Siempre verifica `isAuthenticated` antes de acceder a datos del usuario
4. **No guardes el token en estado local**: Usa siempre el hook para obtener el token actualizado

```typescript
// ❌ Incorrecto
const [token, setToken] = useState(auth.token);

// ✅ Correcto
const { token } = useAuth();
```

---

## TypeScript

Todos los hooks están completamente tipados:

```typescript
const auth = useAuth();
// auth.userName: string | undefined
// auth.isAdmin: boolean
// auth.token: string | null
```
