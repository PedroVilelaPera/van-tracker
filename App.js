import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

import * as TaskManager from "expo-task-manager";

const locationTask = "background-location-task";

TaskManager.defineTask(locationTask, ({ data, error }) => {
  if (error) {
    console.error("❌ Erro na tarefa de background", error);
    return;
  }
  if (data) {
    const { locations } = data; // 'locations' é um array de coordenadas recebidas do GPS

    const latestLocation = locations[locations.length - 1];
    console.log("📍 [Background] Coordenada recebida:", latestLocation.coords);
  }
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Retorno do useEffect executa quando o componente é destruído/fechado
  useEffect(() => {
    return () => {
      if (isTracking) {
        Location.stopLocationUpdatesAsync(locationTask);
      }
    };
  }, [isTracking]);

  // Função para obter a localização do dispositívo
  async function toggleTracking() {
    setErrorMsg(null);

    if (isTracking) {
      await Location.stopLocationUpdatesAsync(locationTask);
      setIsTracking(false);
      console.log("✅ Conexão encerrada com sucesso.");
      return;
    }

    setLoading(true);

    try {
      // Requisitando permissão para obter a localização em primeiro plano
      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        setErrorMsg(
          "Permissão de acesso à localização em primeiro plano negada.",
        );
        console.log(
          "⚠️ Permissão de acesso à localização em primeiro plano negada.",
        );
        return;
      }

      // Requisitando permissão para obter a localização em segundo plano

      console.log(
        "1️⃣ Permissão de acesso à localização em primeiro plano aceita.",
      );
      const { status: bgStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") {
        setErrorMsg(
          "Permissão de acesso à localização em segundo plano negada.",
        );
        console.log(
          "❌ Permissão de acesso à localização em segundo plano negada.",
        );
        return;
      }

      console.log(
        "2️⃣ Permissão de acesso à localização em segundo plano aceita.",
      );
      console.log(
        "✅ Permissões de acesso à localização em primeiro e segundo plano aceitas.",
      );

      // Tenta obter a última posição conhecida (instantâneo)
      let initialPosition = await Location.getLastKnownPositionAsync({});

      // Se o cache estiver vazio, busca do sensor com timeout
      if (!initialPosition) {
        console.log("❌ Cache vazio, buscando coordenada...");
        initialPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
      console.log("📍 Coordenada inicial recebida:", initialPosition.coords);
      setLocation(initialPosition.coords);

      // Assinatura para rastreamento em tempo real
      await Location.startLocationUpdatesAsync(locationTask, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0,
        timeInterval: 1000,

        foregroundService: {
          notificationTitle: "Van Tracker",
          notificationBody: "Rastreamento da rota em andamento...",
          notificationColor: "#0066cc",
        },
      });
      setIsTracking(true);
      console.log("✅ Conexão realizada com sucesso.");
    } catch (error) {
      setErrorMsg(`Erro (${error.name || "GPS"}): ${error.message}`);
      console.log("❌ Erro ao tentar obter a localização.", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Van Tracker - Teste de GPS</Text>

      {loading && <ActivityIndicator size="large" color="#0066cc" />}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {location && !loading && isTracking && (
        <View style={styles.card}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{location.latitude}</Text>

          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{location.longitude}</Text>

          <Text style={styles.label}>Precisão:</Text>
          <Text style={styles.value}>
            {location.accuracy.toFixed(2)} metros
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          isTracking ? styles.buttonStop : styles.buttonStart,
        ]}
        onPress={toggleTracking}
      >
        <Text style={styles.buttonText}>
          {isTracking ? "Parar Corrida" : "Iniciar Corrida"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonStart: {
    backgroundColor: "#00cc4e",
  },
  buttonStop: {
    backgroundColor: "#cc0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
