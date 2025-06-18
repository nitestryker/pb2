import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const ApiStatusBanner: React.FC = () => {
  const { apiError, backendStatus, clearApiError, checkBackendStatus } = useAppStore();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    clearApiError();
    
    try {
      await checkBackendStatus();
      // If successful, try loading recent pastes
      const { loadRecentPastes } = useAppStore.getState();
      await loadRecentPastes();
    } catch (error) {
      console.log('Retry failed, but error handling is in the store');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    clearApiError();
  };

  // Reset dismissed state when there's a new error
  useEffect(() => {
    if (apiError) {
      setIsDismissed(false);
    }
  }, [apiError]);

  // Don't show banner if dismissed or no error
  if (isDismissed || !apiError) {
    return null;
  }

  const getStatusConfig = () => {
    switch (backendStatus) {
      case 'sleeping':
        return {
          icon: Wifi,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          title: 'Server Starting Up',
          showRetry: true
        };
      case 'error':
        return {
          icon: WifiOff,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-300',
          iconColor: 'text-red-600 dark:text-red-400',
          title: 'Connection Error',
          showRetry: true
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-300',
          iconColor: 'text-orange-600 dark:text-orange-400',
          title: 'API Issue',
          showRetry: true
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 mb-6`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <StatusIcon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {config.title}
            </h3>
            <p className={`mt-1 text-sm ${config.textColor}`}>
              {apiError}
            </p>
            
            {backendStatus === 'sleeping' && (
              <p className={`mt-2 text-xs ${config.textColor} opacity-75`}>
                💡 Render free tier servers sleep after inactivity. The server will wake up automatically.
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {config.showRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  isRetrying 
                    ? 'opacity-50 cursor-not-allowed' 
                    : `${config.textColor} hover:bg-white hover:bg-opacity-20`
                }`}
              >
                <RefreshCw className={`h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
              </button>
            )}
            
            <button
              onClick={handleDismiss}
              className={`${config.textColor} hover:bg-white hover:bg-opacity-20 p-1 rounded-md transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};