import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocalStorage = async (key: string, value: string) =>
  await AsyncStorage.setItem(key, value);

export const getLocalStorage = async (key: string) =>
  await AsyncStorage.getItem(key);

export const removeLocalStorage = async (key: string) =>
  await AsyncStorage.removeItem(key);

export const multiRemoveLocalStorage = async (keys: string[]) =>
  await AsyncStorage.multiRemove(keys);

export const multiSetLocalStorage = async (keyValuePairs: [string, string][]) =>
  await AsyncStorage.multiSet(keyValuePairs);

export const multiGetLocalStorage = async (keys: string[]) =>
  await AsyncStorage.multiGet(keys);
