import Button from '@/components/button';
import {
  isTrackingActive,
  startTracking,
  stopTracking,
} from '@/location/locationService';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const [isTracking, setIsTracking] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    isTrackingActive()
      .then(setIsTracking)
      .catch(error => console.error('Erro ao consultar rastreamento:', error));
  }, []);

  async function handleTrackingPress() {
    if (isBusy) return;

    setIsBusy(true);

    try {
      const currentlyActive = await isTrackingActive();

      if (currentlyActive) {
        await stopTracking();
        setIsTracking(false);
      } else {
        await startTracking();
        setIsTracking(true);
      }
    } catch (error) {
      console.error('Erro ao alterar rastreamento:', error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Button
        label={
          isBusy
            ? 'Aguarde...'
            : isTracking
              ? 'Encerrar rastreamento'
              : 'Iniciar rastreamento'
        }
        onPress={handleTrackingPress}
        disabled={isBusy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
