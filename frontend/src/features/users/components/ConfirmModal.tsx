import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDelete?: boolean;
}

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isDelete = false 
}: ConfirmModalProps) => {
  
  if (!isOpen) return null;

  return (
    // 👇 FONDO TRANSPARENTE (Sin color, sin blur)
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent">
      
      {/* 👇 CAJA "FLOTANTE" CON BORDES MARCADOS */}
      <div className="bg-white rounded-xl w-full max-w-sm mx-4 overflow-hidden transform transition-all
                      /* EFECTOS VISUALES: */
                      shadow-2xl border-2 border-gray-300 ring-4 ring-black/5
                      animate-in fade-in zoom-in-95 duration-200">
        
        {/* Contenido */}
        <div className="p-6 text-center">
          {/* Icono */}
          <div className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-4 border-4 
            ${isDelete ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
            <AlertTriangle size={28} className={isDelete ? 'text-red-600' : 'text-blue-600'} />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">{message}</p>

          {/* Botones */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold transition-all shadow-sm w-full"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-white rounded-lg font-bold transition-all w-full shadow-md active:scale-95
                ${isDelete 
                  ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
            >
              {isDelete ? 'Sí, Eliminar' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};