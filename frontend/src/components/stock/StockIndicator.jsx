import React from 'react';
import { useStockStream } from '../../hooks/useStockStream';

/**
 * Real-time Stock Indicator Component
 * Shows live stock updates via SSE with connection status
 * 
 * Usage:
 *   <StockIndicator productId={1} />
 */
export const StockIndicator = ({ productId }) => {
    const { stockData, isConnected, error } = useStockStream();

    // Get current stock for this product
    const productStock = stockData[productId];
    const currentStock = productStock?.stock;
    const productName = productStock?.name;

    if (error) {
        return (
            <div className="text-red-500 text-sm">
                ⚠️ Live updates unavailable
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* Live connection indicator (green dot) */}
            <div 
                className={`h-2 w-2 rounded-full transition-colors ${
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}
                title={isConnected ? 'Live: Updates every 5 seconds' : 'Disconnected'}
            />
            
            {/* Stock value with live badge */}
            <div className="flex items-center gap-1">
                {currentStock !== undefined ? (
                    <>
                        <span className={`font-medium ${
                            currentStock > 10 ? 'text-green-600' : 
                            currentStock > 0 ? 'text-orange-600' : 
                            'text-red-600'
                        }`}>
                            {currentStock > 0 ? (
                                <>
                                    <span className="font-bold">{currentStock}</span> in stock
                                </>
                            ) : (
                                'Out of stock'
                            )}
                        </span>
                        {isConnected && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                LIVE
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-gray-400">Loading...</span>
                )}
            </div>
        </div>
    );
};

/**
 * Alternative: Stock Badge (minimal version)
 */
export const StockBadge = ({ productId }) => {
    const { stockData } = useStockStream();
    const stock = stockData[productId]?.stock;

    if (stock === undefined) return null;

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
            stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            {stock > 0 ? `${stock} left` : 'Out of stock'}
        </span>
    );
};
