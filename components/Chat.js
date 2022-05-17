import React, { Component } from 'react';
import { View , Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import * as firebase from 'firebase';
import 'firebase/firestore';

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            messages:[], 
            uid: 0,
            user: {
                _id: '',
                name: '',
                avatar: ''
            }            
        }

        //database information 
        const firebaseConfig = {
            apiKey: "AIzaSyDdKoPyIS6SvN-2LHHZsJTG91BwDhPvlS4",
            authDomain: "chatapp-1d9de.firebaseapp.com",
            projectId: "chatapp-1d9de",
            storageBucket: "chatapp-1d9de.appspot.com",
            messagingSenderId: "508838520885",
            appId: "1:508838520885:web:15904733ec4415442ca97c"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // referencs the database 
        this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    componentDidMount() {
        let name = this.props.route.params.name;
        
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: 'https://placeimg.com/140/140/any'
                  }
            });

            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each document
        querySnapshot.forEach((doc) => {
            //get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id, 
                createdAt: data.createdAt.toDate(),
                text: data.text,
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                }
            });
        });
        
        this.setState({
            messages: messages
        });
    };

    //adding messages to the database
    addMessage() {
        const message = this.state.messages[0];
    
        this.referenceChatMessages.add({
            _id: message._id,
            createdAt: message.createdAt,
            text: message.text,
            user: this.state.user
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
        })
    }

    componentWillUnmount() {
        if (this.state.isConnected) {
            this.authUnsubscribe();
            this.unsubscribe();
        }
    }
    

    renderBubble(props) {
        return(
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    render() {

        // defining chat screen parameters (title, and background color) passed from start screen 
        let { name, color } = this.props.route.params;
        this.props.navigation.setOptions({title: name});
        return(
            <View style={[{backgroundColor: color}, styles.container]}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />
                { Platform.OS === 'android' ? (
                    <KeyboardAvoidingView behavior="height" /> 
                    ) : null
                }
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
