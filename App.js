import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState(null);

  // Retorno do useEffect executa quando o componente é destruído/fechado
  useEffect(() => {
    return () => {
      if (connection) {
        connection.remove();
      }
    };
  }, [connection]);

  // Função para obter a localização do dispositívo
  async function toggleTracking() {
    setErrorMsg(null);

    if (connection !== null) {
      connection.remove();
      setConnection(null);
      console.log("✅ Conexão encerrada com sucesso.");
      return;
    }

    setLoading(true);

    try {
      // Requisitando permissão para obter a localização em primeiro plano
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de acesso à localização negada.");
        console.log("❌ Permissão de acesso à localização negada.");
        return;
      }

      console.log("✅ Permissão de acesso à localização aceita.");

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
      const newConnection = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0,
          timeInterval: 1000,
        },
        (currentLocation) => {
          console.log("📍 Nova coordenada recebida:", currentLocation.coords);
          setLocation(currentLocation.coords);
        },
      );

      setConnection(newConnection);
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

      {location && !loading && connection && (
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
          connection ? styles.buttonStop : styles.buttonStart,
        ]}
        onPress={toggleTracking}
      >
        <Text style={styles.buttonText}>
          {connection ? "Parar Corrida" : "Iniciar Corrida"}
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
