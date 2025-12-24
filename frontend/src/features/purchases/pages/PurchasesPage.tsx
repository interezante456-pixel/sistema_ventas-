import { useState } from 'react';
import { usePurchases } from '../hooks/usePurchases';
import { PurchasesList } from '../components/PurchasesList';
import { CreatePurchasePage } from './CreatePurchasePage';

export const PurchasesPage = () => {
    const { purchases, loading, refresh } = usePurchases();
    const [isCreating, setIsCreating] = useState(false);

    if (isCreating) {
        return (
            <CreatePurchasePage 
                onCancel={() => {
                    setIsCreating(false);
                    refresh();
                }} 
            />
        );
    }

    if (loading && purchases.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <PurchasesList 
            purchases={purchases} 
            onNewPurchase={() => setIsCreating(true)} 
        />
    );
};
