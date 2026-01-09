# Documentación - DriverFlow Frontend

## Tabla de Contenidos

1. [Sistema de Autenticación](./AUTHENTICATION.md)
2. [Redux Store](./STORE.md)
3. [Servicios API](./SERVICES.md)
4. [Hooks Personalizados](./HOOKS.md)

---

## Descripción General

DriverFlow es una plataforma profesional de gestión logística con automatización inteligente de WhatsApp. El frontend está construido con:

- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Redux Toolkit** - Gestión de estado
- **RTK Query** - Peticiones API y cache
- **Tailwind CSS** - Estilos
- **Vite** - Build tool

---

## Quick Start

### Instalación

```bash
cd driver-flow-front
npm install
```

### Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:5173`

---

## Arquitectura

```
src/
├── components/          # Componentes React
│   ├── common/         # Componentes reutilizables
│   ├── Login.tsx       # Componente de login
│   └── ...
├── features/           # Redux slices por feature
│   └── auth/
│       └── authSlice.ts
├── services/           # RTK Query API services
│   ├── api.ts
│   ├── auth.ts
│   └── users.ts
├── store/              # Configuración del store
│   └── index.ts
├── hooks.ts            # Hooks personalizados
├── App.tsx             # Componente principal
└── main.tsx            # Entry point
```

---

## Flujo de Datos

```
Usuario → Componente → Hook/Mutation → API Service
                ↓                           ↓
            Redux Store ← Response ← Backend
                ↓
          LocalStorage
```

### Ejemplo Completo

```typescript
// 1. Usuario hace login
import { useLoginMutation } from './services/auth';
import { useAppDispatch } from './hooks';
import { setCredentials } from './features/auth/authSlice';

function Login() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (email, password) => {
    // 2. Petición al backend
    const result = await login({ email, password }).unwrap();

    // 3. Guardar en Redux y localStorage
    dispatch(setCredentials({
      token: result.token,
      user: result.user
    }));
  };

  return <form onSubmit={handleLogin}>...</form>;
}

// 4. Acceder desde otro componente
import { useAuth } from './hooks';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <h1>Bienvenido {user.name}</h1>;
}
```

---

## Características Principales

### 🔐 Autenticación

- Login con JWT
- Decodificación automática del token
- Persistencia en localStorage
- Interceptor automático para todas las peticiones

[Ver documentación completa →](./AUTHENTICATION.md)

### 🗄️ Estado Global

- Redux Toolkit para gestión de estado
- RTK Query para cache de API
- TypeScript para seguridad de tipos
- DevTools para debugging

[Ver documentación completa →](./STORE.md)

### 🌐 Servicios API

- Endpoints tipados
- Cache automático
- Invalidación inteligente
- Estados de loading/error

[Ver documentación completa →](./SERVICES.md)

### 🪝 Hooks Personalizados

- `useAuth` - Acceso a autenticación
- `useAppDispatch` - Dispatch tipado
- `useAppSelector` - Selector tipado

[Ver documentación completa →](./HOOKS.md)

---

## Roles de Usuario

### Admin
- Acceso completo al sistema
- Gestión de operadores
- Dashboard de super administrador

### Operator
- Dashboard propio
- Gestión de conductores, clientes y grupos
- Configuración de WhatsApp
- Gestión de números vetados

---

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend | `http://localhost:4000/api` |

---

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## Ejemplos de Uso

### 1. Proteger una Ruta

```typescript
import { useAuth } from './hooks';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Uso
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 2. Verificar Rol

```typescript
import { useAuth } from './hooks';

function AdminPanel() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>No tienes permisos</div>;
  }

  return <div>Panel de Administración</div>;
}
```

### 3. Hacer Petición Autenticada

```typescript
import { useGetUsersQuery } from './services/users';

function UsersList() {
  const { data: users, isLoading } = useGetUsersQuery();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 4. Crear un Usuario

```typescript
import { useCreateUserMutation } from './services/users';

function CreateUser() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (data) => {
    try {
      await createUser(data).unwrap();
      alert('Usuario creado');
    } catch (err) {
      alert('Error al crear usuario');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 5. Logout

```typescript
import { useAppDispatch } from './hooks';
import { logout } from './features/auth/authSlice';

function LogoutButton() {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(logout())}>
      Cerrar Sesión
    </button>
  );
}
```

---

## Troubleshooting

### El token no se está enviando

Verifica que el store esté correctamente configurado y que el middleware de RTK Query esté agregado:

```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(api.middleware)
```

### Los datos no persisten después de recargar

Verifica que localStorage esté funcionando:

```typescript
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('user'));
```

### Error de CORS

Configura el backend para permitir requests desde `http://localhost:5173`:

```typescript
// Backend (Express)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### TypeScript Errors

Asegúrate de tener instalados los tipos correctos:

```bash
npm install --save-dev @types/react @types/react-dom
```

---

## Recursos Adicionales

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## Contribuir

Para contribuir al proyecto:

1. Lee toda la documentación
2. Mantén los patrones establecidos
3. Usa TypeScript correctamente
4. Escribe código limpio y documentado
5. Prueba antes de hacer commit

---

## Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**Última actualización:** Enero 2026
**Versión:** 2.0
