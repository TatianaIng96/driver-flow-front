# Redux Store

## Descripción General

El store de Redux está configurado usando **Redux Toolkit** con integración de **RTK Query** para gestión de estado y peticiones API.

---

## Estructura del Store

```
src/
├── store/
│   └── index.ts          # Configuración del store
├── features/
│   └── auth/
│       └── authSlice.ts  # Slice de autenticación
└── services/
    ├── api.ts            # API base
    ├── auth.ts           # Endpoints de auth
    └── users.ts          # Endpoints de users
```

---

## Configuración del Store

### store/index.ts

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,  // RTK Query reducer
    auth: authReducer,                // Auth slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type { AuthState } from '../features/auth/authSlice';

export default store;
```

---

## Tipos de TypeScript

### RootState

Tipo que representa todo el estado de la aplicación:

```typescript
export type RootState = ReturnType<typeof store.getState>;
```

**Estructura:**
```typescript
{
  api: {
    // Estado de RTK Query (cache, queries, mutations)
  },
  auth: {
    token: string | null;
    user: {
      id: string;
      email: string;
      role: string;
      name: string;
    } | null;
  }
}
```

**Uso:**
```typescript
import { RootState } from '../store';
import { useAppSelector } from '../hooks';

const user = useAppSelector((state: RootState) => state.auth.user);
```

### AppDispatch

Tipo de la función dispatch con todas las acciones disponibles:

```typescript
export type AppDispatch = typeof store.dispatch;
```

**Uso:**
```typescript
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';

const dispatch: AppDispatch = useDispatch();
```

---

## Auth Slice

### Estructura del Estado

```typescript
export interface AuthState {
  token: string | null;
  user: User | null;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;
```

### Estado Inicial

```typescript
const initialState: AuthState = {
  token: typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null,
  user: typeof window !== 'undefined' && localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
};
```

**Características:**
- Restaura el token desde localStorage al iniciar
- Restaura el usuario desde localStorage al iniciar
- Compatible con SSR (verifica `window`)

---

## Acciones (Actions)

### 1. setCredentials

Guarda el token y usuario en Redux y localStorage.

```typescript
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../features/auth/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();

  const handleLogin = (token: string, user: User) => {
    dispatch(setCredentials({ token, user }));
  };

  return <button onClick={() => handleLogin('token123', { ... })}>Login</button>;
}
```

**Payload:**
```typescript
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
```

**Efecto:**
- Actualiza `state.auth.token`
- Actualiza `state.auth.user`
- Guarda en `localStorage.setItem('token', token)`
- Guarda en `localStorage.setItem('user', JSON.stringify(user))`

### 2. logout

Limpia el token y usuario de Redux y localStorage.

```typescript
import { useAppDispatch } from '../hooks';
import { logout } from '../features/auth/authSlice';

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Redirigir a login si es necesario
  };

  return <button onClick={handleLogout}>Cerrar Sesión</button>;
}
```

**Efecto:**
- Actualiza `state.auth.token = null`
- Actualiza `state.auth.user = null`
- Elimina `localStorage.removeItem('token')`
- Elimina `localStorage.removeItem('user')`

---

## Selectors (Selectores)

### Selectores Básicos

```typescript
import { useAppSelector } from '../hooks';

function Component() {
  // Seleccionar token
  const token = useAppSelector((state) => state.auth.token);

  // Seleccionar usuario completo
  const user = useAppSelector((state) => state.auth.user);

  // Seleccionar campo específico
  const userEmail = useAppSelector((state) => state.auth.user?.email);

  // Seleccionar múltiples valores
  const { token, user } = useAppSelector((state) => ({
    token: state.auth.token,
    user: state.auth.user,
  }));

  return <div>{user?.name}</div>;
}
```

### Selectores Computados

```typescript
import { useAppSelector } from '../hooks';

function Component() {
  const isAuthenticated = useAppSelector((state) =>
    !!(state.auth.token && state.auth.user)
  );

  const isAdmin = useAppSelector((state) =>
    state.auth.user?.role === 'admin'
  );

  return (
    <div>
      {isAuthenticated && <p>Usuario autenticado</p>}
      {isAdmin && <p>Es administrador</p>}
    </div>
  );
}
```

---

## Integración con Provider

### main.tsx

El store debe estar envuelto en el `Provider` de Redux:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import './style/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

---

## Middleware

### RTK Query Middleware

```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(api.middleware)
```

**Características:**
- Gestiona peticiones API
- Maneja cache automático
- Invalida cache cuando es necesario
- Gestiona estados de loading/error

---

## DevTools

Redux Toolkit incluye automáticamente Redux DevTools para desarrollo:

```typescript
// No se necesita configuración adicional
// Redux DevTools funciona automáticamente en desarrollo
```

**Uso:**
1. Instala la extensión Redux DevTools en tu navegador
2. Abre las DevTools del navegador
3. Pestaña "Redux"
4. Inspecciona acciones, estado y tiempo de viaje

---

## Persistencia

### LocalStorage

El auth slice guarda automáticamente datos en localStorage:

```typescript
// Al hacer login
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Al hacer logout
localStorage.removeItem('token');
localStorage.removeItem('user');

// Al inicializar
const token = localStorage.getItem('token');
const user = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null;
```

### Ventajas
- Los datos persisten entre recargas
- El usuario permanece autenticado
- No requiere librerías adicionales

### Desventajas
- Vulnerable a XSS (usa HTTPS y sanitiza inputs)
- Tamaño limitado (~5-10MB)
- Solo strings (necesita JSON.stringify/parse)

---

## Acceso al Store Fuera de Componentes

### En funciones utilitarias

```typescript
import store from './store';

export function getAuthToken() {
  return store.getState().auth.token;
}

export function getCurrentUser() {
  return store.getState().auth.user;
}
```

### En servicios

```typescript
import store from '../store';

export async function fetchWithAuth(url: string) {
  const token = store.getState().auth.token;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
}
```

---

## Testing

### Mock del Store

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';

export function createMockStore(initialState = {}) {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState: initialState,
  });
}
```

### Test con Store Mock

```typescript
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createMockStore } from './test-utils';
import MyComponent from './MyComponent';

test('renders user name', () => {
  const store = createMockStore({
    auth: {
      token: 'fake-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      },
    },
  });

  const { getByText } = render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );

  expect(getByText('Test User')).toBeInTheDocument();
});
```

---

## Mejores Prácticas

1. **Usa hooks tipados**: `useAppDispatch` y `useAppSelector` en lugar de los genéricos
2. **Selectores simples**: Mantén los selectores simples y crea computados cuando sea necesario
3. **No mutes el estado**: Redux Toolkit usa Immer, pero sigue las buenas prácticas
4. **Organiza por features**: Agrupa slices relacionados
5. **TypeScript**: Siempre usa tipos para actions y state

```typescript
// ❌ No recomendado
const dispatch = useDispatch();
const user = useSelector((state: any) => state.auth.user);

// ✅ Recomendado
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

---

## Expansión del Store

### Agregar un nuevo slice

1. Crear el slice:
```typescript
// features/settings/settingsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { theme: 'light' },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
```

2. Agregarlo al store:
```typescript
// store/index.ts
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    settings: settingsReducer, // ← Nuevo slice
  },
  // ...
});
```

3. Actualizar tipos:
```typescript
// RootState automáticamente incluye el nuevo slice
// {
//   api: { ... },
//   auth: { ... },
//   settings: { theme: string }
// }
```
