import { useState } from 'react';
import { LogIn, Lock, Mail, ArrowRight, Truck, Zap, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import type { User } from '../App';
import { useLoginMutation } from '../services/auth';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../features/auth/authSlice';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Llamar al endpoint de login con credenciales reales
      const response = await login({ email, password }).unwrap();

      // Guardar token y usuario en Redux (automáticamente también se guarda en localStorage)
      dispatch(setCredentials({
        token: response.token,
        user: response.user,
      }));

      // Llamar al callback onLogin para actualizar el estado local de App
      onLogin(response.user);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      // El error se muestra automáticamente más abajo
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Enlace de recuperación enviado a tu correo');
    setShowRecovery(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background con imagen y overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558957543-ab3e457707a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB0cnVjayUyMHRyYW5zcG9ydHxlbnwxfHx8fDE3NjM5NzgzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Transport background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/90 to-indigo-900/95" />

        {/* Animated shapes */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        {/* Panel Izquierdo - Branding y Features */}
        <motion.div
          className="text-white hidden lg:block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold tracking-tight">DriverFlow</h1>
                <p className="text-blue-200">Powered by Baileys</p>
              </div>
            </motion.div>

            <motion.p
              className="text-2xl text-blue-100 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Plataforma profesional de gestión logística con automatización inteligente de WhatsApp
            </motion.p>
          </div>

          {/* Features Cards */}
          <div className="space-y-4">
            {[
              {
                icon: Zap,
                title: 'Automatización Total',
                desc: 'Gestión automática de grupos y asignación de servicios',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Shield,
                title: 'Control Inteligente',
                desc: 'Validación de números vetados en tiempo real',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Users,
                title: 'Multi-Operador',
                desc: 'Gestión independiente para cada operador',
                color: 'from-blue-500 to-indigo-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-blue-200 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Panel Derecho - Formulario de Login */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-white text-3xl font-bold">DriverFlow</h1>
            </div>
            <p className="text-blue-200">Gestión inteligente de transporte</p>
          </div>

          {/* Card de Login con Glassmorphism */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
            {!showRecovery ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-gray-900">Iniciar Sesión</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="usuario@driverflow.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-red-900 text-sm">
                        ❌ <strong>Error:</strong> {'data' in error && error.data ? String(error.data) : 'Credenciales inválidas'}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Verificando...
                      </>
                    ) : (
                      <>
                        Iniciar Sesión
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-gray-900">Recuperar Contraseña</h2>
                </div>

                <form onSubmit={handleRecovery} className="space-y-5">
                  <p className="text-gray-600">
                    Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
                  </p>

                  <div>
                    <label htmlFor="recovery-email" className="block text-gray-700 mb-2 font-medium">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="recovery-email"
                        type="email"
                        placeholder="usuario@driverflow.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRecovery(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium"
                    >
                      Enviar Enlace
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <p className="text-center text-white/70 mt-6 text-sm">
            DriverFlow v2.0 • Sistema Multi-Operador con Baileys API
          </p>
        </motion.div>
      </div>
    </div>
  );
}
