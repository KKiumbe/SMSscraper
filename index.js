/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import app from './firebaseConfig'; // Import your Firebase config
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
