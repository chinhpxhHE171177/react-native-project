import React from 'react';
import { Alert, Text, View } from 'react-native';
// component = function 
// create a variable which contains a function 
// import { sum2Numbers, substract2Numbers, PI } from '../utilies/Calculation';
// //read object, variable, functions from other modules
// const MainScreen = (props) => { // props thuoc tinh properties cua man hinh do 
//     //props = { x: 18, y: 12 };
//     Alert.alert(`x = ${props.x}, y = ${props.y}`);
//     const { x, y } = props // trich xuat x, y tu props
//     const { person } = props // trich xuat du lieu person tu props
//     //const --> let --> var (thu tu uu tien)

//     //destructuring person object 
//     const { name, age, email } = person;
//     const { products } = props;
//     debugger
//     return (
//         //<Text> This is main screen</Text>
//         //<Text> x = {props.x}, y = {props.y}</Text>
//         // co tu 2 the tro nen thi cho the Text va0 the View
//         <View style={{ backgroundColor: 'pink' }}>
//             <Text>Vaule of x = {x}, Vaule of y = {y}</Text>
//             <Text>Name = {name}, Age = {age}, Email = {email}</Text>
//             {/* <Text>{JSON.stringify(products)}</Text> */}
//             {products.map((eachProduct =>
//                 <Text>{eachProduct.productName}, {eachProduct.price}</Text>
//             ))}
//             <Text>Sum 2 and 3 = {sum2Numbers(2, 3)}</Text>
//             <Text>Substraction 8 and 3 = {substract2Numbers(8, 3)}</Text>
//             <Text>PI = {PI}</Text>
//         </View>
//     );
// }
// export default MainScreen;


const MainScreen = (props) => {
    return (
        <View style={{ backgroundColor: '#E6E6FA'}}>
            <Text style={{ color: 'blue', textAlign: 'center', padding: 10, fontSize: 20 }}>This is main screen</Text>
        </View>
    );
}

export default MainScreen;