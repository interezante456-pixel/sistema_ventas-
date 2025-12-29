import { Bell, Moon, Lock, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

export const SettingsPage = () => {
    // Notifications State - Persisted
    const [notifications, setNotifications] = useState(() => {
        return localStorage.getItem('notifications') === 'true'; 
    });

    useEffect(() => {
        localStorage.setItem('notifications', String(notifications));
    }, [notifications]);

    // Theme Hook
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
            <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                
                {/* Apariencia */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Moon size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Modo Oscuro</h3>
                            <p className="text-sm text-gray-500">Cambiar la apariencia de la aplicación</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isDark} 
                            onChange={toggleTheme} 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {/* Notificaciones */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                            <p className="text-sm text-gray-500">Recibir alertas de ventas y stock bajo</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                {/* Seguridad */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Seguridad</h3>
                            <p className="text-sm text-gray-500">Cambiar contraseña y autenticación</p>
                        </div>
                    </div>
                    <button className="text-indigo-600 font-medium hover:text-indigo-800">
                        Gestionar
                    </button>
                </div>

                {/* Idioma */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Idioma</h3>
                            <p className="text-sm text-gray-500">Español (Perú)</p>
                        </div>
                    </div>
                     <button className="text-indigo-600 font-medium hover:text-indigo-800">
                        Cambiar
                    </button>
                </div>

            </div>
        </div>
    );
};
