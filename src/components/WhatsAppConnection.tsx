import { useState, useEffect } from 'react';
import { Smartphone, QrCode, CheckCircle, AlertCircle, X, RefreshCw, Wifi, WifiOff, Zap, Shield, Users, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Operator, WhatsAppConnection as WhatsAppConnectionType } from '../App';

interface WhatsAppConnectionProps {
  operator: Operator;
  onUpdateConnection: (operatorId: string, connection: WhatsAppConnectionType) => void;
}

export function WhatsAppConnection({ operator, onUpdateConnection }: WhatsAppConnectionProps) {
  const [connection, setConnection] = useState<WhatsAppConnectionType>(
    operator.whatsappConnection || {
      isConnected: false,
      status: 'disconnected',
    }
  );
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  // Simular generación de QR code
  const generateQRCode = () => {
    setIsGeneratingQR(true);
    
    // Simular delay de generación
    setTimeout(() => {
      const mockQR = generateMockQR();
      const newConnection: WhatsAppConnectionType = {
        isConnected: false,
        status: 'qr_ready',
        qrCode: mockQR,
      };
      setConnection(newConnection);
      onUpdateConnection(operator.id, newConnection);
      setIsGeneratingQR(false);

      // Simular auto-conexión después de 5 segundos (para demo)
      setTimeout(() => {
        simulateConnection();
      }, 5000);
    }, 2000);
  };

  // Simular escaneo y conexión exitosa
  const simulateConnection = () => {
    const connectedState: WhatsAppConnectionType = {
      isConnected: true,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      phoneNumber: '+57 300 123 4567',
      profileName: operator.name,
    };
    setConnection(connectedState);
    onUpdateConnection(operator.id, connectedState);
  };

  // Desconectar
  const disconnect = () => {
    const disconnectedState: WhatsAppConnectionType = {
      isConnected: false,
      status: 'disconnected',
    };
    setConnection(disconnectedState);
    onUpdateConnection(operator.id, disconnectedState);
  };

  // Generar QR mock (ASCII art simulado)
  const generateMockQR = () => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='white' width='200' height='200'/%3E%3Crect fill='black' x='20' y='20' width='10' height='10'/%3E%3Crect fill='black' x='30' y='20' width='10' height='10'/%3E%3Crect fill='black' x='50' y='20' width='10' height='10'/%3E%3Crect fill='black' x='60' y='20' width='10' height='10'/%3E%3Crect fill='black' x='80' y='20' width='10' height='10'/%3E%3Crect fill='black' x='110' y='20' width='10' height='10'/%3E%3Crect fill='black' x='130' y='20' width='10' height='10'/%3E%3Crect fill='black' x='140' y='20' width='10' height='10'/%3E%3Crect fill='black' x='150' y='20' width='10' height='10'/%3E%3Crect fill='black' x='170' y='20' width='10' height='10'/%3E%3Crect fill='black' x='20' y='30' width='10' height='10'/%3E%3Crect fill='black' x='70' y='30' width='10' height='10'/%3E%3Crect fill='black' x='90' y='30' width='10' height='10'/%3E%3Crect fill='black' x='100' y='30' width='10' height='10'/%3E%3Crect fill='black' x='120' y='30' width='10' height='10'/%3E%3Crect fill='black' x='170' y='30' width='10' height='10'/%3E%3Crect fill='black' x='20' y='40' width='10' height='10'/%3E%3Crect fill='black' x='40' y='40' width='10' height='10'/%3E%3Crect fill='black' x='50' y='40' width='10' height='10'/%3E%3Crect fill='black' x='60' y='40' width='10' height='10'/%3E%3Crect fill='black' x='70' y='40' width='10' height='10'/%3E%3Crect fill='black' x='90' y='40' width='10' height='10'/%3E%3Crect fill='black' x='120' y='40' width='10' height='10'/%3E%3Crect fill='black' x='140' y='40' width='10' height='10'/%3E%3Crect fill='black' x='150' y='40' width='10' height='10'/%3E%3Crect fill='black' x='160' y='40' width='10' height='10'/%3E%3Crect fill='black' x='170' y='40' width='10' height='10'/%3E%3C/svg%3E`;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">Conexión WhatsApp Business</h1>
            <p className="text-gray-600">Conecta tu cuenta usando la API Baileys</p>
          </div>
        </div>
      </div>

      {/* Estado de Conexión - Card Principal */}
      <div className={`rounded-2xl shadow-xl border-2 p-8 mb-8 transition-all duration-300 ${
        connection.isConnected 
          ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-300' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
              connection.isConnected 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30' 
                : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/20'
            }`}>
              {connection.isConnected ? (
                <CheckCircle className="w-10 h-10 text-white" />
              ) : (
                <WifiOff className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className={connection.isConnected ? 'text-green-900' : 'text-gray-900'}>
                  {connection.isConnected ? '✓ Conectado y Activo' : 'Sin Conexión'}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  connection.isConnected 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {connection.isConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className={connection.isConnected ? 'text-green-700' : 'text-gray-600'}>
                {connection.isConnected 
                  ? 'Tu bot está funcionando correctamente' 
                  : 'Inicia sesión para activar las funcionalidades'}
              </p>
            </div>
          </div>

          {connection.isConnected && (
            <button
              onClick={disconnect}
              className="px-6 py-3 bg-white border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Desconectar
            </button>
          )}
        </div>

        {connection.isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-green-200">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-gray-600 mb-2">📱 Número de Teléfono</p>
              <p className="text-gray-900">{connection.phoneNumber}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-gray-600 mb-2">👤 Nombre del Perfil</p>
              <p className="text-gray-900">{connection.profileName}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-gray-600 mb-2">🕒 Conectado desde</p>
              <p className="text-gray-900">
                {connection.connectedAt 
                  ? new Date(connection.connectedAt).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : '-'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vista según estado */}
      {!connection.isConnected && connection.status === 'disconnected' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Panel izquierdo - Instrucciones */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-gray-900 text-center mb-3">Vincula tu WhatsApp</h2>
            <p className="text-gray-600 text-center mb-8">
              Conecta tu cuenta empresarial en 3 simples pasos
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  1
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Abre WhatsApp en tu teléfono</p>
                  <p className="text-gray-600">Usa tu cuenta de WhatsApp Business</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  2
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Ve a Dispositivos vinculados</p>
                  <p className="text-gray-600">Configuración → Dispositivos vinculados</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  3
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Escanea el código QR</p>
                  <p className="text-gray-600">Toca "Vincular un dispositivo"</p>
                </div>
              </div>
            </div>

            <button
              onClick={generateQRCode}
              disabled={isGeneratingQR}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500"
            >
              {isGeneratingQR ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generando código...
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Generar Código QR
                </>
              )}
            </button>

            <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-yellow-900 mb-2">⚠️ Importante</p>
                  <p className="text-yellow-700">
                    Usa WhatsApp Business. Esta conexión utiliza Baileys (API no oficial). 
                    No compartas información sensible o datos personales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel derecho - Beneficios */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <Zap className="w-12 h-12 mb-4" />
              <h3 className="mb-4">Automatización Inteligente</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Gestión automática de grupos WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Asignación inteligente de servicios</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Control de números vetados en tiempo real</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="mb-4">API Baileys - Sin Costos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Sin tarifas de API oficial de WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Control total de tu bot</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Conexión directa y segura</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
              <Users className="w-12 h-12 mb-4" />
              <h3 className="mb-4">Gestión de Grupos</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Límites configurables por grupo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Creación automática de nuevos grupos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Asignación dinámica de conductores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!connection.isConnected && connection.status === 'qr_ready' && connection.qrCode && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <h2 className="text-gray-900">Esperando escaneo...</h2>
            </div>

            {/* QR Code */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-3xl border-4 border-blue-600 shadow-2xl">
                <img 
                  src={connection.qrCode} 
                  alt="QR Code" 
                  className="w-72 h-72"
                />
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-3 text-blue-600 mb-3">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-medium">Esperando conexión...</span>
              </div>
              <p className="text-blue-700">
                Escanea este código con WhatsApp en tu teléfono
              </p>
            </div>

            <button
              onClick={() => setConnection({ isConnected: false, status: 'disconnected' })}
              className="text-gray-600 hover:text-gray-900 transition-colors px-6 py-2 hover:bg-gray-100 rounded-lg"
            >
              Cancelar y volver
            </button>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-blue-900 mb-2">💡 Tip Profesional</p>
                  <p className="text-blue-700">
                    El código QR expira en 60 segundos. Si no logras escanearlo a tiempo, 
                    simplemente genera uno nuevo. Mantén tu teléfono cerca para mayor rapidez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}