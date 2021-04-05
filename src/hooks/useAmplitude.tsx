import { Amplitude } from '@amplitude/react-native';

const DEV_KEY = '57549736bd55c979fad08a8e10e140a0';

const ampInstance = Amplitude.getInstance();
ampInstance.init(DEV_KEY);

const useAmplitude = () => {
  const logEvent = (event: string) => {
    try {
      return ampInstance.logEvent(event);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    logEvent,
  };
};

export default useAmplitude;
