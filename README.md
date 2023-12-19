# Frontend
This project was developed as part of a semester project at AAU by group dat-3-03. \
This repository contains the frontend of the project, it's an Android app.

## Project setup
1. The starting point of the application is 
``./app/index.js`` which registers ``./app/app.tsx``
2. Custom-built components used can be found in ``./app/src/components``
3. The screens can be found in ``./app/src/screens``
4. The data handler for retrieving data from the server can be found in ``./app/src/utility/DataHandler.ts``
5. The request handler to the server can be found in ``./app/src/utility/Networking.ts``
6. The notification handler can be seen in ``./app/src/utility/NotificationHandler.ts``
7. Other utility functionality including logger and local storage handler can be found ``./app/src/utility``

## Setup project
### Requirements
1. Node - minimum version: 20.9.0
2. Android studio
3. Android studio SDKs
   1. Android Tiramisu api 33
   2. SDK build-tools 33.0.2
   3. NDK 23.1.7779620
   4. CMake 3.22.1
   5. Android SDK platform tools
   6. A Android phone or Android emulator running Tiramisu api 33
4. To connect to the server requires being on the Aau network is required either physical or through the VPN: https://www.its.aau.dk/vejledninger/VPN

### Installing modules
```shell
cd app
```
```shell
npm install
```
```shell
npm install -g react-native-cli @react-native-community/cli
```
### Running dev mode
```shell
npm start
```

## Components used
[Paper components](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator)\
[React Native Components](https://reactnative.dev/docs/components-and-apis)

## Potential fixes if it doesn't work
Android sdk 33.0.0, Android tiramisu emulator. \
Use Webstorms. \
Use following commands.
```
cd app
cd android
./gradlew clean
./gradlew wrapper --gradle-version=8.0.1 --distribution-type=bin
cd ..
npm cache clear --force
yarn upgrade --pattern react-native
```
