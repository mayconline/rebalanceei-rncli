import { Amplitude } from '@amplitude/react-native';
import { useCallback } from 'react';
import Config from '../config/envs';

const ampInstance = Amplitude.getInstance();
ampInstance.init(Config?.amplitudeKey);

const useAmplitude = () => {
  const logEvent = useCallback((event: string) => {
    try {
      return ampInstance.logEvent(event);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  return {
    logEvent,
  };
};

export default useAmplitude;
