# Projeto-ESP32

## Introdução

Com base no briefing recebido, o objetivo do projeto é construir um veículo com condução manual e autónoma capaz de transportar carga de um ponto a outro, ultrapassando os obstáculos presentes no percurso.

Para alcançarmos esse propósito, iremos desenvolver um veículo manual e autónomo, equipado com um microcontrolador ESP32 e múltiplos sensores. O veículo suportara condução manual onde ele é controlado através de um Dashboard Web, ou através de condução autónoma que poderá ser ativada no Dashboard Web, no modo autónomo o veículo utilizara os seus sensores para detetar e superar os obstáculos, medir a inclinação da rampa, calcular a velocidade e monitorizar o nível de bateria.

O objetivo principal é criar um veículo capaz de transportar carga de forma manual ou autónoma de maneira eficiente e segura, tendo a capacidade de navegar pelo ambiente e levar a carga até ao fim do percurso.

## Levantamento de requisitos

### Requisitos Funcionais

Web Dashboard - Implementação de um dashboard que permita controlar e visualizar os dados fornecidos pelo ESP32.

Controlo Manual – O veículo deve ser capaz de ser controlado de maneira manual, através do Dashboard Web.

Controlo Autónomo – Deve ser possível ativar o modo autónomo do veículo através do dashboard Web.

Transporte de carga – O veículo deve ser capaz de transportar carga do início ao fim do percurso.

### Requisitos não funcionais

Usabilidade – O dashboard deve ser intuitivo e fácil de usar.

Segurança - O dashboard deve apenas poder ser acessado por usuários autorizados.

Performance – O ESP32 deve conseguir mandar os dados de maneira rápida e eficiente para o backend.

Fiabilidade – O ESP32 deve detetar com exatidão os obstáculos utilizando os seus sensores.

### Hardware

ESP32

Sensores – Ultrassonic Sensor, MPU6050, Voltage Sensor,

Atuadores – Motores TT, Servo Motor,

### Descrição da arquitetura implementada

A estrutura foi pensada na eficácia e facilidade de uso. O veículo é controlado através de um Dashboard Web, e utiliza sensores para detetar os obstáculos, medir a inclinação da rampa, calcular a velocidade e monitorizar o nível de bateria.

Temos um Esp32 responsável pela recolha dos dados dos sensores e controlar os atuadores do veículo, ele está a ser programado usando o Arduino IDE. A comunicação entre o Esp32 e o backend é realizada usando o protocolo MQTT com recurso ao broker HiveMQ.

O Backend desenvolvido em Nodejs, possui 2 camadas principais, uma REST API que trata do registo e login do utlizador, e uma camada de comunicação em tempo real com o frontend via socket.io, que transmite os dados dos sensores e comandos do utlizador através do broker MQTT, no login e registo utilizamos Lex e Yacc para realizar a análise léxica e sintática das entradas do utilizador para garantir que eles seguem as regras que nós estabelecemos.

A nossa Base de Dados armazena as informações dos utilizadores e dos sensores e ela está a ser implementada utilizando Docker Compose.

Frontend feito usando Vite com React, que serve para desenvolver o Dashboard Web permitindo o utilizador fazer Registo, Login ou controlar o veículo seja de maneira manual ou autónoma, o dashboard também exibe dados em tempo real trasmitidos pelo Esp32.
