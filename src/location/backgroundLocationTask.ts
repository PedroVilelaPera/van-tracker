import { LocationObject } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const locationTask = 'background-location-task';

type LocationTaskData = {
  locations: LocationObject[];
};

TaskManager.defineTask<LocationTaskData>(
  locationTask,
  async ({ data, error }) => {
    if (error) {
      console.error('Erro na tarefa de localização:', error);
      return;
    }
    if (
      !data ||
      !Array.isArray(data.locations) ||
      data.locations.length === 0
    ) {
      ('Nenhuma localização recebida.');
      return;
    }

    const lastLocation = data.locations[data.locations.length - 1];
    const { latitude, longitude, speed, accuracy } = lastLocation.coords;

    console.log({
      latitude,
      longitude,
      speedKmh: speed == null ? null : Number((speed * 3.6).toFixed(1)),
      accuracyMeters: accuracy,
      capturedAt: new Date(lastLocation.timestamp).toLocaleString('pt-BR'),
    });
  },
);
