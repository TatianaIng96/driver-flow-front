# Servicios API

## Descripción General

Los servicios API están construidos usando **RTK Query**, que proporciona:
- Cache automático
- Re-fetch inteligente
- Invalidación de cache
- Estados de loading/error
- Integración con Redux

---

## Estructura de Servicios

```
src/services/
├── api.ts       # Cliente API base
├── auth.ts      # Servicio de autenticación
└── users.ts     # Servicio de usuarios
```

---

## API Base (api.ts)

### Configuración

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['User', 'Users'],
  endpoints: () => ({}),
});
```

### Características

- **Base URL**: Configurable via variable de entorno `VITE_API_BASE_URL`
- **Interceptor de Token**: Agrega automáticamente el Bearer token a todas las peticiones
- **Cache Tags**: Sistema de invalidación inteligente

---

## Servicio de Autenticación (auth.ts)

### Endpoints Disponibles

#### 1. Login

```typescript
import { useLoginMutation } from '../services/auth';

function LoginForm() {
  const [login, { isLoading, error, data }] = useLoginMutation();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      console.log('Login exitoso:', result);
      // result.token: string
      // result.user: { id, email, role, name }
    } catch (err) {
      console.error('Error de login:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit('user@example.com', 'password123');
    }}>
      <input type="email" name="email" />
      <input type="password" name="password" />
      <button disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </form>
  );
}
```

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  }
}
```

#### 2. Get Current User (Me)

```typescript
import { useMeQuery } from '../services/auth';

function UserProfile() {
  const { data: user, isLoading, error } = useMeQuery();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar usuario</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Rol: {user.role}</p>
    </div>
  );
}
```

**Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: string;
}
```

### Decodificación de JWT

El servicio automáticamente decodifica el JWT usando `jwt-decode`:

```typescript
import { jwtDecode } from 'jwt-decode';

transformResponse: (response: { accessToken: string }) => {
  const decoded = jwtDecode<JwtPayload>(response.accessToken);

  return {
    token: response.accessToken,
    user: {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.roles,
      name: decoded.email.split('@')[0],
    },
  };
}
```

---

## Servicio de Usuarios (users.ts)

### Endpoints Disponibles

#### 1. Get Users (List)

```typescript
import { useGetUsersQuery } from '../services/users';

function UsersList() {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar usuarios</div>;

  return (
    <div>
      <button onClick={refetch}>Recargar</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Request:** Ninguno (void)

**Response:** `User[]`

#### 2. Create User

```typescript
import { useCreateUserMutation } from '../services/users';

function CreateUserForm() {
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const handleSubmit = async (userData) => {
    try {
      const newUser = await createUser(userData).unwrap();
      console.log('Usuario creado:', newUser);
      // La lista de usuarios se actualiza automáticamente
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'operator'
      });
    }}>
      <input name="name" placeholder="Nombre" />
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Contraseña" />
      <select name="role">
        <option value="admin">Admin</option>
        <option value="operator">Operador</option>
      </select>
      <button disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  );
}
```

**Request:**
```typescript
{
  name: string;
  email: string;
  password: string;
  role: string;
  // ... otros campos opcionales
}
```

**Response:** `User`

#### 3. Update User

```typescript
import { useUpdateUserMutation } from '../services/users';

function EditUserForm({ userId }) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleUpdate = async () => {
    try {
      const updated = await updateUser({
        id: userId,
        body: {
          name: 'Juan Pérez Actualizado',
          email: 'juan.nuevo@example.com'
        }
      }).unwrap();

      console.log('Usuario actualizado:', updated);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button onClick={handleUpdate} disabled={isLoading}>
      {isLoading ? 'Actualizando...' : 'Actualizar Usuario'}
    </button>
  );
}
```

**Request:**
```typescript
{
  id: string;
  body: {
    name?: string;
    email?: string;
    // ... otros campos opcionales
  }
}
```

**Response:** `User`

#### 4. Delete User

```typescript
import { useDeleteUserMutation } from '../services/users';

function DeleteUserButton({ userId }) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro?')) return;

    try {
      await deleteUser(userId).unwrap();
      console.log('Usuario eliminado');
      // La lista de usuarios se actualiza automáticamente
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
```

**Request:** `string` (userId)

**Response:** `void` o mensaje de éxito

---

## Cache e Invalidación

### Tags del Cache

Los servicios usan tags para invalidar el cache automáticamente:

- `User`: Usuario actual
- `Users`: Lista de usuarios

### Ejemplo de Invalidación

Cuando creas un usuario:
```typescript
createUser: build.mutation({
  query: (body) => ({ url: '/users', method: 'POST', body }),
  invalidatesTags: ['Users'], // ← Invalida la lista de usuarios
})
```

Automáticamente, `useGetUsersQuery()` se vuelve a ejecutar en todos los componentes que lo usen.

---

## Manejo de Estados

### Estados de Loading

```typescript
const { data, isLoading, isFetching, isSuccess, isError } = useGetUsersQuery();

return (
  <div>
    {isLoading && <p>Carga inicial...</p>}
    {isFetching && <p>Actualizando datos...</p>}
    {isSuccess && <UsersList users={data} />}
    {isError && <p>Error al cargar</p>}
  </div>
);
```

### Manejo de Errores

```typescript
const [createUser, { error }] = useCreateUserMutation();

if (error) {
  if ('status' in error) {
    // Error de HTTP
    const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
    console.error('Error HTTP:', error.status, errMsg);
  } else {
    // Error de red o serialización
    console.error('Error:', error.message);
  }
}
```

---

## Refetch Manual

```typescript
const { data, refetch } = useGetUsersQuery();

return (
  <div>
    <button onClick={() => refetch()}>
      Recargar Datos
    </button>
    <UsersList users={data} />
  </div>
);
```

---

## Polling (Auto-refresh)

```typescript
// Refresca cada 30 segundos
const { data } = useGetUsersQuery(undefined, {
  pollingInterval: 30000,
});
```

---

## Skip Queries

```typescript
const { data } = useGetUsersQuery(undefined, {
  skip: !isAuthenticated, // No ejecuta si no está autenticado
});
```

---

## Lazy Queries

```typescript
import { useLazyGetUsersQuery } from '../services/users';

function LazyComponent() {
  const [trigger, { data, isLoading }] = useLazyGetUsersQuery();

  return (
    <div>
      <button onClick={() => trigger()}>
        Cargar Usuarios
      </button>
      {isLoading && <p>Cargando...</p>}
      {data && <UsersList users={data} />}
    </div>
  );
}
```

---

## Transformación de Respuestas

```typescript
getUsers: build.query({
  query: () => ({ url: '/users' }),
  transformResponse: (response: any[]) => {
    // Transformar antes de guardar en cache
    return response.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    }));
  },
})
```

---

## Mejores Prácticas

1. **Usa hooks en componentes**: Los hooks de RTK Query están diseñados para React
2. **Aprovecha el cache**: No hagas fetch manual si RTK Query lo maneja
3. **Invalida correctamente**: Usa tags para mantener los datos sincronizados
4. **Maneja errores**: Siempre muestra feedback al usuario
5. **TypeScript**: Define interfaces para requests y responses

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'operator';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

createUser: build.mutation<User, CreateUserRequest>({
  // ...
})
```
