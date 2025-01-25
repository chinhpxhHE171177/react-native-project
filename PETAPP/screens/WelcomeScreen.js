import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, images } from '../constants';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>healthypet</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Image
                    source={images.puppy} // Thay bằng URL hình ảnh của bạn
                    style={styles.image}
                />
                <Text style={styles.title}>
                    Helping you to keep your <Text style={styles.highlight}>bestie</Text> stay healthy!
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={[styles.buttonText, styles.registerButtonText]}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background_color, 
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 50,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.purple_color, 
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        color: colors.title,
    },
    highlight: {
        color: colors.purple_color, 
        fontWeight: 'bold',
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,
    },
    button: {
        width: '80%',
        backgroundColor: colors.purple_color, 
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.purple_color,
    },
    registerButtonText: {
        color: colors.purple_color, 
    },
});

export default WelcomeScreen;
