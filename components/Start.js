import React, { Component } from 'react';
import { ImageBackground, View, Text, Pressable, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import BackgroundImage from '../assets/Background-Image.png';

// Create constant that holds background colors for Chat Screen
const colors = {
    black: "#090C08",
    purple: "#474056",
    grey: "#8A95A5",
    green: "#B9C6AE",
  };

export default class Start extends Component {

    constructor(props) {
        super(props);
        this.state = {
          name: '',
          color: 'black'
        };
    } 

    render() {
        return(
            <View style={styles.container}>
                <ImageBackground source={BackgroundImage} resizeMode="cover" style={styles.image}>
                        <Text style={styles.title}>Chat Here!</Text>
                    <View style={styles.enterwindow}>
                        {/* Input box to set user name passed to chat screen*/}
                        <TextInput 
                            style={styles.input}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            placeholder='Your name'
                        />
                        {/* Allow user to choose background color */}
                        <Text style={styles.text}>Choose Background Color </Text>
                        <View style={styles.coloroptions}>
                            <TouchableOpacity 
                                style={[{ backgroundColor: colors.black }, styles.colorbutton]}
                                onPress={() => this.setState({color: colors.black})}
                            />
                            <TouchableOpacity 
                                style={[{ backgroundColor: colors.purple }, styles.colorbutton]}
                                onPress={() => this.setState({color: colors.purple})}
                            />
                            <TouchableOpacity 
                                style={[{ backgroundColor: colors.grey }, styles.colorbutton]}
                                onPress={() =>this.setState({color: colors.grey})}
                            />
                            <TouchableOpacity
                                style={[{ backgroundColor: colors.green }, styles.colorbutton]}
                                onPress={() => this.setState({color: colors.green})}
                            />
                        </View>
                        {/* guiding to chatroon, as well as passing user name and background color as props */}
                        <Pressable
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name, color: this.state.color})}
                        >
                            <Text style={styles.buttontext}>Start Chatting</Text>
                        </Pressable>
                    </View>
                </ImageBackground>            
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    image: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    title: {
        color: '#ffffff',
        fontSize: 45, 
        fontWeight: '600'
    },
    enterwindow: {
        width: '95%',
        height: '40%',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        width: '88%',
        height: 30,
        fontSize: 16, 
        fontWeight: '300', 
        color: '#757083',
        borderColor: 'gray',
        borderWidth: 1,
    }, 
    text: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        // textAlign: 'left',
        // opacity: '100%'
    },
    coloroptions: {
        flexDirection: 'row',
        justifyContent:'space-around'
    },
    colorbutton: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    button: {
        width: '88%',
        height: 40,
        backgroundColor: 'gray',
        borderColor: 'gray',
        borderWidth: 1
    }, 
    buttontext: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    }
  });