import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, X, ExternalLink, Info } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { apiService } from '../../services/api';

export const ApiStatusBanner: React.FC = () => {
  const { apiError, backendStatus, clearApiError, checkBackendStatus } = useAppStore();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleRetry = async () => {
    setIsRetrying(true);
    clearApiError();
    
    try {
      console.log('🔄 User initiated retry...');
      
      // Test connectivity first
      const connectivityResult = await apiService.testConnectivity();
      console.log('🧪 Connectivity test result:', connectivityResult);
      
      if (connectivityResult.canReachBackend) {
        // If connectivity is good, try loading recent pastes
        const { loadRecentPastes } = useAppStore.getState();
        await loadRecentPastes();
        console.log('✅ Retry successful - data loaded');
      } else {
        console.log('❌ Connectivity test failed during retry');
      }
    } catch (error) {
      console.log('⚠️ Retry completed with warnings:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    clearApiError();
  };

  const handleShowDebug = async () => {
    setShowDebugInfo(!showDebugInfo);
    
    if (!showDebugInfo) {
      // Collect debug information
      const status = apiService.getBackendStatus();
      const connectivityTest = await apiService.testConnectivity();
      
      setDebugInfo({
        backendStatus: status,
        connectivity: connectivityTest,
        environment: {
          mode: import.meta.env.MODE,
          prod: import.meta.env.PROD,
          apiUrl: import.meta.env.VITE_API_URL,
          useLocal: import.meta.env.VITE_USE_LOCAL_BACKEND,
          origin: window.location.origin,
          userAgent: navigator.userAgent.substring(0, 100) + '...'
        },
        timestamp: new Date().toISOString()
      });
    }
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
          showRetry: true,
          description: 'The Render server is waking up from sleep mode. This usually takes 30-60 seconds.'
        };
      case 'error':
        return {
          icon: WifiOff,
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-300',
          iconColor: 'text-red-600 dark:text-red-400',
          title: 'Connection Error',
          showRetry: true,
          description: 'Unable to connect to the backend server. Please check your internet connection.'
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-300',
          iconColor: 'text-orange-600 dark:text-orange-400',
          title: 'API Issue',
          showRetry: true,
          description: 'There was an issue communicating with the server.'
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
        className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg p-4 mb-6 shadow-sm`}
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
            
            {config.description && (
              <p className={`mt-2 text-xs ${config.textColor} opacity-75`}>
                💡 {config.description}
              </p>
            )}
            
            {backendStatus === 'sleeping' && (
              <div className={`mt-3 text-xs ${config.textColor} opacity-75 space-y-1`}>
                <p>🔄 <strong>What's happening:</strong> Render free tier servers sleep after 15 minutes of inactivity</p>
                <p>⏰ <strong>Expected wait time:</strong> 30-60 seconds for server to wake up</p>
                <p>✅ <strong>This is normal</strong> and will resolve automatically</p>
              </div>
            )}
            
            {backendStatus === 'error' && (
              <div className={`mt-3 text-xs ${config.textColor} opacity-75 space-y-1`}>
                <p>🔍 <strong>Troubleshooting:</strong></p>
                <p>• Check your internet connection</p>
                <p>• Try refreshing the page</p>
                <p>• The server may be experiencing temporary issues</p>
              </div>
            )}
            
            {/* Debug Information */}
            {showDebugInfo && debugInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-4 p-3 bg-black bg-opacity-10 rounded text-xs ${config.textColor} font-mono`}
              >
                <div className="space-y-2">
                  <div><strong>Backend Status:</strong> {debugInfo.backendStatus.status}</div>
                  <div><strong>Last Check:</strong> {new Date(debugInfo.backendStatus.lastCheck).toLocaleTimeString()}</div>
                  <div><strong>Request Count:</strong> {debugInfo.backendStatus.requestCount}</div>
                  <div><strong>Connectivity:</strong> {debugInfo.connectivity.canReachBackend ? '✅ Good' : '❌ Failed'}</div>
                  <div><strong>Response Time:</strong> {debugInfo.connectivity.responseTime}ms</div>
                  <div><strong>Environment:</strong> {debugInfo.environment.mode}</div>
                  <div><strong>API URL:</strong> {debugInfo.environment.apiUrl || 'default'}</div>
                  <div><strong>Origin:</strong> {debugInfo.environment.origin}</div>
                  {debugInfo.connectivity.error && (
                    <div><strong>Error:</strong> {debugInfo.connectivity.error}</div>
                  )}
                </div>
              </motion.div>
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
              onClick={handleShowDebug}
              className={`${config.textColor} hover:bg-white hover:bg-opacity-20 p-1 rounded-md transition-colors`}
              title="Show debug information"
            >
              <Info className="h-4 w-4" />
            </button>
            
            <a
              href="https://pb2-ahh9.onrender.com/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className={`${config.textColor} hover:bg-white hover:bg-opacity-20 p-1 rounded-md transition-colors`}
              title="Test backend directly"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            
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