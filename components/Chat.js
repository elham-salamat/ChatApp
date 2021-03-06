import React, { Component } from 'react';
import { View , Platform, KeyboardAvoidingView, StyleSheet, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

import * as firebase from 'firebase';
import 'firebase/firestore';

import CustomActions from './CustomActions';

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            messages:[], 
            uid: 0,
            isConnected: false,
            user: {
                _id: '',
                name: '',
                avatar: ''
            },
            image: null,
            location: null
        }

        //firebase configuration 
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

    // Save messages to async storage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    // Retrieve messages from async storage
    async getMessages() {
        let messages = '';
        try {
             messages = (await AsyncStorage.getItem('messages')) || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // Delete messages from async storage for development purposes
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    componentDidMount() {
        // Retrieving name proerty passed from the Start Screen
        let name = this.props.route.params.name;
        
        NetInfo.fetch().then(connection => {

            // When user is online, retrieve messages from firebase store
            if (connection.isConnected) {
                this.setState({
                    isConnected: true
                });

                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
        
                    //update user state with currently active user data
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any'
                        }, 
                        isConnected: true
                    });
        
                    this.unsubscribe = this.referenceChatMessages
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(this.onCollectionUpdate);

                    // Delete previously saved messages in asyncStorage
                    this.deleteMessages();

                    // Save messages to asyncStorage
                    this.saveMessages();
                }); 

            } else {    
                this.setState({
                    isConnected: false,
                });  
                // Load messages from asyncStorage when the user is offline
                this.getMessages();
            }
        });
    }

    //takes a snapshot of the conversation
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
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        
        this.setState({
            messages: messages
        });
        this.saveMessages();
    };

    
    //adding messages to the database
    addMessages() {
        const message = this.state.messages[0];
            
        this.referenceChatMessages.add({
            _id: message._id,
            createdAt: message.createdAt,
            text: message.text || null,
            user: this.state.user,
            image: message.image || null,
            location: message.location || null,
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), 
        () => {
            this.addMessages();
            // this.saveMessages();
        }
        )
    }
    
    componentWillUnmount() {
        if (this.state.isConnected) {
            this.authUnsubscribe();
            this.unsubscribe();
        }
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return(
                <InputToolbar
                {...props}
                />
            );
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

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    //render a map with current location, if the user shared their location on a message
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }


    render() {

        // Retrieving the name and color properties passed from the Start Screen
        let { name, color } = this.props.route.params;

        // Set the screen title to the user name entered in the start screen
        this.props.navigation.setOptions({title: name});
        return(
            <View style={[{backgroundColor: color}, styles.container]}>
                <GiftedChat
                    messages={this.state.messages}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderBubble={this.renderBubble.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
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
