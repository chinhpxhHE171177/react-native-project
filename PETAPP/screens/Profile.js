// yarn add react-native-chart-kit
//yarn add react-native-svg

import React, { useState, useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { user as UserRes, population as PopulationRes } from '../responsitories';
import convertDateTimeToString from "../utilies/DateTime";
import { colors } from '../constants';

// const chartConfig = {
//     backgroundGradientFrom: 'white',
//     backgroundGradientFromOpacity: 0,
//     backgroundGradientTo: 'white',
//     backgroundRadientToOpacity: 1.0,
//     color: (opacity) => colors.primary,
//     strokeWidth: 1,
//     barPercentage: 0.5,
//     useShadowColorFromDataset: true
// }

// const screenWidth = Dimensions.get("window").width;

const Profile = (props) => {
    const [user, setUser] = useState({});
    //const [populations, setPopulations] = useState({});

    useEffect(() => {
        // Fetch user and population data
        UserRes.getUserDetail().then(resUser => setUser(resUser));
        // PopulationRes.getPopulation({
        //     drilldowns: 'Nation',
        //     measures: 'Population'
        // }).then(resPopulation => setPopulations(resPopulation));
    }, []);

    const { email, dateOfBirth, gender, userId, address, userName, url, phone, registerDate } = user;

    return (
        <SafeAreaView style={{ flex: 1, paddingStart: 20 }}>
            <Image
                style={{ width: 150, height: 150, resizeMode: 'cover', borderRadius: 80, alignSelf: 'center', marginBottom: 20 }}
                source={{ uri: url }}
            />
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>UserName: </Text>
                <Text>{userName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Email: </Text>
                <Text>{email}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Date of birth: </Text>
                <Text>{convertDateTimeToString(dateOfBirth)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Gender: </Text>
                <Text>{gender}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Address: </Text>
                <Text>{address}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Phone: </Text>
                <Text>{phone}</Text>
            </View>

            {/* Population Chart */}
            {/* {populations && populations.length > 0 ? (
                <LineChart
                    data={{
                        labels: populations.sort((a, b) => parseInt(a.year) - parseInt(b.year)).map(item => item.year),
                        datasets: [
                            {
                                data: populations.sort((a, b) => parseInt(a.year) - parseInt(b.year))
                                    .map(item => Math.floor(item.population / 1000000)), // population divided by 1 million
                                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                                strokeWidth: 2
                            }
                        ],
                        legend: ['Population/Year']
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                />
            ) : (
                <Text>No population data available</Text>
            )} */}
        </SafeAreaView>
    );
}

export default Profile;
