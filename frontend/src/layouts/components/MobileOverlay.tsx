interface MobileOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileOverlay = ({ isOpen, onClose }: MobileOverlayProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
        />
    );
};
