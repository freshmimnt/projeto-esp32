# Projeto-ESP32

## Introdução

Baseado no briefing recebido, o objetivo do projeto é construir um veículo com condução manual capaz de transportar carga de um ponto a outro, ultrapassando os obstáculos que terá pelo caminho.

Para alcançarmos esse propósito nós iremos construir um veículo manual e possivelmente autónomo equipado com um microcontrolador ESP32 e múltiplos sensores. O veículo suportara condução manual através de um Dashboard Web ou atraves de condução autonoma que poderá ser ativada no dashboard, no modeo autónomo o veículo utilizara os seus sensores para detetar e superar os obstáculos, medir a inclinação da rampa, calcular a velocidade e monitorizar os níveis de bateria.

O objetivo principal é criar um veículo capaz de transportar carga de maneira manual ou autónoma de maneira eficiente e segura, tendo a capacidade de navegar pelo ambiente e realizar o transporte de carga de maneira manual ou autónoma.

## Levantamento de requisitos

### Requisitos Funcionais

Web Dashboard - Implementação de um dashboard que permita controlar e visualizar os dados fornecidos pelo ESP32.

Controlo Manual – O veículo deve ser capaz de ser controlado de maneira manual, através do Dashboard Web.

Transporte de carga – O veículo deve ser capaz de transportar carga de início ao fim.

### Requisitos não funcionais

Usabilidade – O dashboard deve ser intuitivo e fácil de usar.

Segurança - O dashboard deve apenas poder ser acessado por usuários autorizados.

Performance – O ESP32 deve conseguir mandar os dados de maneira rápida e eficiente para o backend.

Fiabilidade – O ESP32 deve detetar com exatidão os obstáculos utilizando os seus sensores.

### Hardware

ESP32

Sensores – Ultrassonic Sensor , MPU6050

Atuadores – DFPLAYER Mini , Motores TT

### Software

PostgreSQL através de docker compose – O nosso sistema utilizará uma base de dado em PostgreSQL, implementada em docker compose. A nossa base de dados irá guardar as informações geradas pelo veículo e os seus sensores.

MTTQ (Hive MQ) - Nós usaremos o protocolo MQTT para a comunicação entre o backend e o esp32, decidimos usar este protocolo devido sua eficiencia e baixo consumo de recursos.

Front-end - O nosso Web Dashboard será feito usando Vite com a framework React. Através do Dashboard o usuario poderá controlar o véiculo manualmente ou escolher condução autnomoma, ainda terá a capacidade de ver em tempo real os dados transmitidos pelo ESP32, tais como a velocidade, nivel da bateria, inclinação da rampa, entre outros.

Back-end - O backend que será desenvolvido em NodeJS será responsavel por:

Receber os dados enviados pelo ESP32 através de MQTT;

Processar e guardar esses dados na base de dados;
 