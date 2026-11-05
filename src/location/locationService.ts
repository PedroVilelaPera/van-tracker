import * as Location from 'expo-location';
import { locationTask } from './backgroundLocationTask';

export async function isTrackingActive(): Promise<boolean> {
  return Location.hasStartedLocationUpdatesAsync(locationTask);
}

export async function startTracking(): Promise<void> {
  // Requisita acesso a localização em primeiro e segundo plano.
  const fgPermission = await Location.requestForegroundPermissionsAsync();

  if (fgPermission.status !== 'granted') {
    throw new Error('1️⃣ Permissão de localização em primeiro plano negada.');
  }

  const bgPermission = await Location.requestBackgroundPermissionsAsync();

  if (bgPermission.status !== 'granted') {
    throw new Error('2️⃣ Permissão de localização em segundo plano negada.');
  }

  // Verifica se uma task de rastreamento já existe.

  if (await isTrackingActive()) {
    return;
  }

  // Inicia uma task de rastreamento.
  await Location.startLocationUpdatesAsync(locationTask, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 0,
    timeInterval: 1000,

    foregroundService: {
      notificationTitle: 'Van Tracker',
      notificationBody: 'Rastreamento da rota em andamento...',
      notificationColor: '#0066cc',
    },
  });
}

export async function stopTracking(): Promise<void> {
  // Verifica se ainda existe uma task de rastreamento.
  if (!(await isTrackingActive())) {
    return;
  }

  // Termina a task de rastreamento.
  await Location.stopLocationUpdatesAsync(locationTask);
}
