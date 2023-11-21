# Frontend
## Setup project
```shell
cd app
```
```shell
npm install
```
```shell
npm install -g react-native-cli @react-native-community/cli
```
```shell
npm start
```

## Plan
### Screens
1. Home
    * Switch on/off duty
    * Dropdown per service
      * Active alarms (on press go to index 5)
        * Show status (acknowledged, assigned, fixed)
        * Show members assigned to alarm
2. Companies
   * Overview of companies with indicator of current alarms
     * Ref. index 4
   * Compact mode switch
   * Search bar
3. History
   * Search bar
   * Toggleable search by period
   * List of all cases (default show last 30)
4. Company list of services
5. Alarm specific screen
   * Assign member to fix alarm
   * Information about alarm
   * Set priority (defaults to 4, scale 1-4)
   * Show time since triggered
   * Press resolve with confirmation (With 5 seconds countdown)

### Additional elements
1. Popup notification showing newly active alarm if any (queue if multiple)

### Features
1. Notifications

## Stuff and things
### Components
[Paper components](https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator)\
[React Native Components](https://reactnative.dev/docs/components-and-apis)

## If it don't work
Android sdk 33.0.0, Android tiramisu emulatior
Use webstorms.\
Use following commands
```
cd app
cd android
./gradlew clean
./gradlew wrapper --gradle-version=8.0.1 --distribution-type=bin
cd ..
npm cache clear --force
yarn upgrade --pattern react-native
```

### Icons
[All icons can be seen here, only MaterialCommunityIcons are available](https://oblador.github.io/react-native-vector-icons/)
