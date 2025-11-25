import type { Operator } from '../App';

export const mockOperators: Operator[] = [
  {
    id: 'op1',
    name: 'Transportes Rápidos SA',
    email: 'contacto@transportesrapidos.com',
    phone: '+57 300 123 4567',
    createdAt: '2025-01-15T10:00:00',
    isActive: true,
    settings: {
      groupBaseName: 'Servicios TR',
      groupPhoto: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
      maxClientsPerGroup: 30,
      botRules: {
        onlyActiveDriversCanTakeServices: true,
        blockBannedInteraction: true,
        autoRemoveFromGroupsOnBan: true,
        blockServicesForBannedClients: true,
      },
    },
  },
  {
    id: 'op2',
    name: 'Logística Express',
    email: 'admin@logisticaexpress.com',
    phone: '+57 310 987 6543',
    createdAt: '2025-02-01T14:30:00',
    isActive: true,
    settings: {
      groupBaseName: 'Express',
      groupPhoto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
      maxClientsPerGroup: 30,
      botRules: {
        onlyActiveDriversCanTakeServices: true,
        blockBannedInteraction: true,
        autoRemoveFromGroupsOnBan: false,
        blockServicesForBannedClients: true,
      },
    },
  },
  {
    id: 'op3',
    name: 'Servicios del Norte',
    email: 'info@serviciosdelnorte.com',
    phone: '+57 320 555 8888',
    createdAt: '2025-03-10T09:15:00',
    isActive: false,
    settings: {
      groupBaseName: 'Norte',
      groupPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
      maxClientsPerGroup: 30,
      botRules: {
        onlyActiveDriversCanTakeServices: false,
        blockBannedInteraction: true,
        autoRemoveFromGroupsOnBan: true,
        blockServicesForBannedClients: false,
      },
    },
  },
];
