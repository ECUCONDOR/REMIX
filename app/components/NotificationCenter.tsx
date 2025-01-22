import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface NotificationCenterProps {
  userId: string;
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // En una implementación real, esto se conectaría con Supabase
    // para obtener las notificaciones del usuario
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Cambio Exitoso',
        message: 'Tu operación de cambio USD a ARS se completó exitosamente.',
        created_at: new Date().toISOString(),
        read: false,
      },
      {
        id: '2',
        title: 'Nueva Tasa de Cambio',
        message: 'Las tasas de cambio se han actualizado.',
        created_at: new Date().toISOString(),
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, [userId]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1f2e] rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  className="text-sm text-blue-400 hover:text-blue-300"
                  onClick={() => {
                    // Marcar todas como leídas
                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                    setUnreadCount(0);
                  }}
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-blue-900/20' : 'bg-blue-800/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-white">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(notification.created_at).toLocaleDateString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">
                  No hay notificaciones
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
