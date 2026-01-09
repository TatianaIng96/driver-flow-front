# Sistema de Autenticación

## Descripción General

El sistema de autenticación está implementado usando **Redux Toolkit** y **RTK Query** para gestionar el estado global y las peticiones API.

## Arquitectura

```
src/
├── features/auth/
│   └── authSlice.ts          # Redux slice para autenticación
├── services/
│   ├── api.ts                # Cliente API base
│   ├── auth.ts               # Endpoints de autenticación
│   └── users.ts              # Endpoints de usuarios
├── store/
│   └── index.ts              # Configuración del store
└── hooks.ts                  # Hooks personalizados
```

---

## Flujo de Autenticación

### 1. Login del Usuario

```typescript
import { useLoginMutation } from '../services/auth';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../features/auth/authSlice';

function LoginComponent() {
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password }).unwrap();

      // Guardar en Redux y localStorage automáticamente
      dispatch(setCredentials({
        token: response.token,
        user: response.user,
      }));

      console.log('Login exitoso:', response.user);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin('user@example.com', 'password123');
    }}>
      {error && <div>Error: {error.message}</div>}
      <button disabled={isLoading}>
        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### 2. Respuesta del Backend

El backend responde con un JWT:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

El token JWT contiene:
```json
{
  "sub": "693dedc28a9caed53ca739de",
  "email": "taty@eje.co",
  "roles": "admin",
  "iat": 1767914204,
  "exp": 1767915104
}
```

### 3. Decodificación Automática

El servicio `auth.ts` decodifica automáticamente el JWT usando `jwt-decode`:

```typescript
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

### 4. Persistencia Automática

Al llamar `dispatch(setCredentials(...))`, los datos se guardan en:
- **Redux Store**: Para acceso en toda la aplicación
- **LocalStorage**: Para persistencia entre recargas

```typescript
// authSlice.ts
setCredentials: (state, action) => {
  state.token = action.payload.token;
  state.user = action.payload.user;

  localStorage.setItem('token', action.payload.token);
  localStorage.setItem('user', JSON.stringify(action.payload.user));
}
```

---

## Roles de Usuario

El sistema soporta dos roles:

### `admin`
- Acceso completo al sistema
- Puede gestionar operadores
- Dashboard de super administrador

### `operator`
- Acceso a su propio dashboard
- Gestión de conductores, clientes y grupos
- Configuración de WhatsApp

---

## Logout

```typescript
import { useAppDispatch } from '../hooks';
import { logout } from '../features/auth/authSlice';

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Esto limpia el token y usuario de Redux y localStorage
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
}
```

---

## Interceptor de Token

Todas las peticiones API incluyen automáticamente el token en el header:

```typescript
// services/api.ts
baseQuery: fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
})
```

---

## Variables de Entorno

Configura la URL base del API en tu archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Si no se especifica, usa el valor por defecto: `http://localhost:4000/api`

---

## Seguridad

- El token JWT se valida en cada petición
- El token expira después de 15 minutos (configurado en backend)
- Los datos sensibles nunca se guardan en texto plano
- HTTPS debe usarse en producción
