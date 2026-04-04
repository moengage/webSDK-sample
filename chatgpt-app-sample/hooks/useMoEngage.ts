import { useEffect, useState } from 'react';
import { initializeMoEngage, isMoEngageReady, MoEngageConfig } from '@/lib/moengage';

export const useMoEngage = (config: MoEngageConfig | null) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!config || typeof window === 'undefined') return;

    if (isMoEngageReady()) {
      setIsReady(true);
      return;
    }

    initializeMoEngage(config);

    const checkReady = setInterval(() => {
      if (isMoEngageReady()) {
        setIsReady(true);
        clearInterval(checkReady);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [config]);

  return { isReady };
};

