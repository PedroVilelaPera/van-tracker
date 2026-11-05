# Van Tracker — MVP

> Projeto de Trabalho de Conclusão de Curso em Análise e Desenvolvimento de Sistemas  
> **Instituto Federal de Educação, Ciência e Tecnologia de Pernambuco (IFPE) — Campus Garanhuns**

Sistema de rastreamento geográfico em tempo real voltado ao transporte alternativo intermunicipal no Agreste Pernambucano, com rota piloto entre os municípios de **Jupi e Garanhuns (BR-423)**.

---

## 📌 Contexto e Propósito

No transporte alternativo intermunicipal da região, as vans operam prioritariamente por lotação, sem grade horária rígida ou canais centralizados de informação. Isso gera incerteza quanto ao tempo de espera para os passageiros ao longo da rodovia e nos pontos de embarque.

O objetivo deste MVP é estabelecer uma solução de ponta a ponta:
1. **Módulo do Motorista**: Coleta contínua da localização geográfica em segundo plano durante o trajeto, com o mínimo de interação manual na condução.
2. **Módulo do Passageiro**: Consulta intuitiva da localização em tempo real das vans ativas sobre um mapa interativo.

> **Delimitação de Escopo (MVP)**: O projeto foca estritamente na transmissão e visualização geográfica em tempo real. Recursos preditivos (cálculo de ETA), contagem automatizada de lotação e cadastros complexos estão fora do escopo inicial.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [React Native 0.88](https://reactnative.dev/) com [Expo SDK 58](https://docs.expo.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Roteamento**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing)
- **Módulos Nativos**:
  - `expo-location`: Obtenção de coordenadas geográficas e serviços de geolocalização.
  - `expo-task-manager`: Execução de tarefas em segundo plano (*headless*).
  - `expo-dev-client`: Execução de compilações nativas de desenvolvimento (*Development Builds*).
- **Abordagem Nativa**: *Continuous Native Generation (CNG)* configurado via plugins no `app.json`.

---

## 📂 Organização da Base de Código

A base de código em `src/` está estruturada em torno de responsabilidades bem delimitadas:

- **`app/`**: Telas e fluxo de navegação gerenciados via rotas baseadas em arquivos (*Expo Router*).
- **`location/`**: Módulo isolado contendo as regras de permissão, serviços de GPS e a definição da tarefa de rastreamento em segundo plano (*TaskManager*).
- **`components/`**: Componentes visuais e elementos de interface reutilizáveis.

---

## ⚙️ Pré-requisitos

Para executar e compilar o aplicativo localmente, certifique-se de possuir:

- **Node.js**: versão 20.x ou superior.
- **Java Development Kit (JDK)**: **JDK 17 (LTS)** obrigatório para compatibilidade com o Gradle e os módulos C++/CMake do React Native.
- **Android Studio & SDK**:
  - Android SDK Platform-Tools
  - Android SDK Command-line Tools (latest)
  - CMake 3.22.1
  - NDK (Side by side)

> [!IMPORTANT]
> Devido ao uso de **Foreground Services com notificações persistentes** e tarefas contínuas de localização no Android 14+, **o aplicativo não executa no Expo Go**. É obrigatório utilizar uma compilação de desenvolvimento (*Development Build*).

---

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/van-tracker-mvp.git
   cd van-tracker-mvp
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento e instale a build no emulador/aparelho:**
   ```bash
   npx expo run:android
   ```

4. **Para iniciar apenas o bundler do Metro (com a build já instalada):**
   ```bash
   npx expo start
   ```

---

## 📋 Estado Atual e Roadmap

- [x] Migração de base para TypeScript e Expo Router (SDK 58).
- [x] Configuração do manifesto do Android com suporte ao Android 14+ (`RECEIVE_BOOT_COMPLETED`, `FOREGROUND_SERVICE_LOCATION`).
- [x] Camada de serviço de localização defensiva (`Location.hasStartedLocationUpdatesAsync`).
- [x] Validação da tarefa em segundo plano com notificações persistentes.
- [ ] Processamento e serialização de pacotes de coordenadas na tarefa de background.
- [ ] Integração de rede e infraestrutura de ingestão remota (WebSocket / BaaS).
- [ ] Interface de mapa em tempo real para consulta dos passageiros.

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos sob a licença [MIT](LICENSE).
