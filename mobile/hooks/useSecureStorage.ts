import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useSecureStorage<T = string>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T | null>(initialValue || null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const storedValue = await SecureStore.getItemAsync(key);
      if (storedValue !== null) {
        try {
          setValue(JSON.parse(storedValue) as T);
        } catch {
          setValue(storedValue as unknown as T);
        }
      }
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  // Salvar valor no SecureStore
  const save = useCallback(
    async (newValue: T) => {
      try {
        const storeValue =
          typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
        await SecureStore.setItemAsync(key, storeValue);
        setValue(newValue);
      } catch (error) {
        console.error(`Erro ao salvar ${key}:`, error);
      }
    },
    [key]
  );

  const remove = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(key);
      setValue(null);
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
    }
  }, [key]);

  return { value, loading, save, remove, reload: load };
}
