import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLocalStorage = async (key: string, value: string) =>
  await AsyncStorage.setItem(key, value);

export const getLocalStorage = async (key: string) =>
  await AsyncStorage.getItem(key);
