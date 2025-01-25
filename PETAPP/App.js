import React from 'react';
import { Text } from 'react-native';
import MainScreen from './screens/MainScreen';
//import Welcome from './screens/Welcome';
//import { Welcome, Login, Register, FoodList, ProductGridView, Setting } from './screens';
//import AppNavigation from './navigation/App';
import AppNavigator from './navigation/AppNavigator';

// let fakedProducts = [
//     {
//         productName: 'Banana',
//         price: 10
//     },
//     {
//         productName: 'Apple',
//         price: 20
//     },
//     {
//         productName: 'Orange',
//         price: 30
//     },
//     {
//         productName: 'Pineapple',
//         price: 40
//     }
// ]
// const App = () => {
//     return (
//         <MainScreen x={18} y={12}
//             person={{ name: 'Pham Xuan Chinh', age: 21, email: 'chinhpx@gmail.com' }}
//             products={fakedProducts} />
//     );
// }

const App = () => {
    return (
        <AppNavigator />
    );
}
export default App;