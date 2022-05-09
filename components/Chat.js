import React, { Component } from 'react';
import { View , Text, StyleSheet } from 'react-native';

export default class Chat extends Component {

    render() {

        // defining chat screen parameters (title, and background color) passed from start screen 
        let { name, color } = this.props.route.params;
        this.props.navigation.setOptions({title: name});
        return(
            <View style={[{backgroundColor: color}, styles.container]}>
                <Text style={styles.text}>Chat screen</Text>           
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    text: {
        color: '#ffffff',
        fontSize: 20
    }
})