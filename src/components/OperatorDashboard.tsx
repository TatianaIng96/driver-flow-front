import { Users, Building2, MessageSquare, Ban, TrendingUp, AlertCircle, Activity, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { Operator, Driver, Client, Group, BannedNumber } from '../App';

interface OperatorDashboardProps {
  operator: Operator;
  drivers: Driver[];
  clients: Client[];
  groups: Group[];
  bannedNumbers: BannedNumber[];
}

export function OperatorDashboard({ operator, drivers, clients, groups, bannedNumbers }: OperatorDashboardProps) {
  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter((d) => d.status === 'active').length,
    totalClients: clients.length,
    clientsInGroups: clients.filter((c) => c.groupId !== null).length,
    totalGroups: groups.length,
    bannedNumbers: bannedNumbers.length,
  };

  // Calcular ocupación de grupos
  const groupOccupancy = groups.map((group) => ({
    name: group.name,
    clients: group.clientIds.length,
    maxClients: operator.settings.maxClientsPerGroup,
    percentage: (group.clientIds.length / operator.settings.maxClientsPerGroup) * 100,
  }));

  // Datos para gráfico de área (simulados)
  const activityData = [
    { day: 'Lun', servicios: 12, clientes: 8 },
    { day: 'Mar', servicios: 19, clientes: 14 },
    { day: 'Mié', servicios: 15, clientes: 11 },
    { day: 'Jue', servicios: 25, clientes: 18 },
    { day: 'Vie', servicios: 22, clientes: 16 },
    { day: 'Sáb', servicios: 18, clientes: 13 },
    { day: 'Dom', servicios: 10, clientes: 7 },
  ];

  // Datos para gráfico de barras (ocupación)
  const occupancyData = groups.map(group => ({
    name: group.name.length > 15 ? group.name.substring(0, 12) + '...' : group.name,
    ocupados: group.clientIds.length,
    disponibles: operator.settings.maxClientsPerGroup - group.clientIds.length,
  }));

  // Datos para gráfico circular (distribución)
  const distributionData = [
    { name: 'Conductores Activos', value: stats.activeDrivers, color: '#10b981' },
    { name: 'Conductores Inactivos', value: stats.totalDrivers - stats.activeDrivers, color: '#6b7280' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header con animación */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">Dashboard - {operator.name}</h1>
            <p className="text-gray-600">Vista general de tu operación en tiempo real</p>
          </div>
        </div>
        
        {/* Indicador de conexión WhatsApp */}
        {operator.whatsappConnection?.isConnected && (
          <motion.div
            className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 text-sm font-medium">WhatsApp Conectado</span>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid con animaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: Users,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            value: stats.totalDrivers,
            label: 'Conductores',
            badge: `${stats.activeDrivers} activos`,
            badgeBg: 'bg-green-100 text-green-700',
            delay: 0,
          },
          {
            icon: Building2,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            value: stats.totalClients,
            label: 'Clientes',
            badge: `${stats.clientsInGroups} asignados`,
            badgeBg: 'bg-purple-100 text-purple-700',
            delay: 0.1,
          },
          {
            icon: MessageSquare,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            value: stats.totalGroups,
            label: 'Grupos WhatsApp',
            badge: 'Activos',
            badgeBg: 'bg-blue-100 text-blue-700',
            delay: 0.2,
          },
          {
            icon: Ban,
            color: 'from-red-500 to-pink-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            value: stats.bannedNumbers,
            label: 'Números Vetados',
            badge: 'Bloqueados',
            badgeBg: 'bg-red-100 text-red-700',
            delay: 0.3,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`bg-white rounded-2xl shadow-lg border-2 ${stat.borderColor} p-6 hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <span className={`px-3 py-1 ${stat.badgeBg} rounded-full text-xs font-medium`}>
                {stat.badge}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Gráficos en Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Actividad Semanal */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900">Actividad Semanal</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorServicios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area type="monotone" dataKey="servicios" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorServicios)" />
              <Area type="monotone" dataKey="clientes" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorClientes)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Distribución de Conductores */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-gray-900">Estado de Conductores</h2>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ocupación de Grupos con Gráfico de Barras */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-gray-900">Ocupación de Grupos WhatsApp</h2>
        </div>

        {groupOccupancy.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="ocupados" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Clientes Asignados" />
                <Bar dataKey="disponibles" fill="#e5e7eb" radius={[8, 8, 0, 0]} name="Espacios Disponibles" />
              </BarChart>
            </ResponsiveContainer>

            {/* Lista detallada */}
            <div className="mt-6 space-y-3">
              {groupOccupancy.map((group, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-900 font-medium">{group.name}</span>
                    <span className="text-gray-600">
                      {group.clients}/{group.maxClients} clientes
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        group.percentage >= 90 ? 'bg-red-500' : group.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${group.percentage}%` }}
                      transition={{ delay: 0.8 + index * 0.05, duration: 0.8 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-medium ${
                      group.percentage >= 90 ? 'text-red-600' : group.percentage >= 70 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {group.percentage.toFixed(0)}% ocupado
                    </span>
                    {group.percentage >= 90 && (
                      <span className="text-xs text-red-600 font-medium">⚠️ Casi lleno</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay grupos creados todavía</p>
          </div>
        )}
      </motion.div>

      {/* Alertas y Notificaciones */}
      {stats.bannedNumbers > 0 && (
        <motion.div
          className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-yellow-900 font-semibold mb-2">Atención Requerida</h3>
              <p className="text-yellow-700">
                Tienes {stats.bannedNumbers} número{stats.bannedNumbers !== 1 ? 's' : ''} vetado{stats.bannedNumbers !== 1 ? 's' : ''}. 
                Asegúrate de revisar la lista de números bloqueados regularmente.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
