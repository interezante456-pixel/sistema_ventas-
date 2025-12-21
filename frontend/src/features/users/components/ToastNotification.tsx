import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const ToastNotification = ({ message, type, onClose }: ToastProps) => {
  // Auto-cierre después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-[70] animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border bg-white min-w-[300px]
        ${type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}
      `}>
        
        {/* Icono */}
        <div className={type === 'success' ? 'text-green-500' : 'text-red-500'}>
          {type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
        </div>

        {/* Mensaje */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-sm">
            {type === 'success' ? '¡Éxito!' : 'Error'}
          </h4>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {/* Botón cerrar manual */}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};