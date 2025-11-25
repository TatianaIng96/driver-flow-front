import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  Ban,
  Settings,
  LogOut,
  User,
  Smartphone,
} from 'lucide-react';

interface OperatorSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userName: string;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'whatsapp', icon: Smartphone, label: 'Conexión WhatsApp' },
  { id: 'drivers', icon: Users, label: 'Conductores' },
  { id: 'clients', icon: Building2, label: 'Clientes' },
  { id: 'groups', icon: MessageSquare, label: 'Grupos WhatsApp' },
  { id: 'banned', icon: Ban, label: 'Números Vetados' },
  { id: 'settings', icon: Settings, label: 'Configuración' },
];

export function OperatorSidebar({ currentView, onNavigate, userName }: OperatorSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 7L15 12L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="7" r="1.5" fill="white"/>
              <circle cx="15" cy="12" r="1.5" fill="white"/>
              <circle cx="20" cy="7" r="1.5" fill="white"/>
              <path d="M5 17H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-gray-900">DriverFlow</h2>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-600" />
              <p className="text-gray-600">Operador</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <p className="text-gray-600">Usuario Activo</p>
        <p className="text-gray-900 truncate">{userName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}