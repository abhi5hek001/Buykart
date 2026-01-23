import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api');

/**
 * Custom hook for real-time stock updates via Server-Sent Events (SSE)
 * 
 * Usage:
 *   const { stockData, isConnected, error } = useStockStream();
 *   const stock = stockData[productId]?.stock;
 * 
 * @returns {Object} { stockData, isConnected, error }
 */
export const useStockStream = () => {
    const [stockData, setStockData] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('🚀 Initializing stock stream...');
        const eventSource = new EventSource(`${API_BASE_URL}/stock/stream`);

        eventSource.onopen = () => {
            console.log('📡 Stock stream connected - receiving live updates every 5 seconds');
            setIsConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📊 Stock update received:', Object.keys(data).length, 'products');
                setStockData(data);
            } catch (err) {
                console.error('❌ Failed to parse stock data:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('❌ Stock stream error:', err);
            setIsConnected(false);
            setError('Connection lost');

            // EventSource will auto-reconnect, but we can close it if needed
            // eventSource.close();
        };

        // Cleanup on component unmount
        return () => {
            console.log('🔌 Closing stock stream connection');
            eventSource.close();
        };
    }, []); // Empty deps - only connect once

    return { stockData, isConnected, error };
};
