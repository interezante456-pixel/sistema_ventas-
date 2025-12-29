import { User, Mail, Shield, Calendar, MapPin } from 'lucide-react';

export const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
            <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-6 pb-6">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="p-1 bg-white rounded-full">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl border-4 border-white shadow-md">
                                <User size={48} />
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                            Editar Perfil
                        </button>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.nombre || 'Usuario Desconocido'}</h2>
                        <p className="text-gray-500">@{user.usuario || 'user'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">Información Personal</h3>
                            
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Correo Electrónico</p>
                                    <p className="font-medium">{user.email || 'No registrado'}</p>
                                </div>
                            </div>

                             <div className="flex items-center gap-3 text-gray-600">
                                <MapPin size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Sucursal</p>
                                    <p className="font-medium">Principal - Lima</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h3 className="font-semibold text-gray-900 border-b pb-2">Detalles de Cuenta</h3>
                             
                             <div className="flex items-center gap-3 text-gray-600">
                                <Shield size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Rol</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user.rol}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Miembro desde</p>
                                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
