import React, { Component } from 'react';
import { View , Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';



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
            },
            isOnline: false           
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

    // Save messages to async storage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message)
        }
    }

    // Retrieve messages from async storage
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
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
        let name = this.props.route.params.name;

        // Check if the user is offline or online
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {  
                this.setState({
                    isOnline: true,
                })
            } else {
                this.setState({
                    isOnline: false,
                })
            }
        });

        if (this.state.isOnline) {
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
                    
                // Delete previously saved messages in asyncStorage
                deleteMessages();
                
                // Save messages to asyncStorage
                saveMessages();
            }); 

        }
         else {
            this.getMessages();
        }
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
        
    //adding messages to the firestore database collection
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
        });
    }

    componentWillUnmount() {
        if (this.state.isOnline) {
            this.authUnsubscribe();
            this.unsubscribe();
        }
    }

    // Hide input bar when user is offline so that they cannot create or send messages 
    renderInputToolbar(props) {
        if (this.state.isOnline == false) {
            // Hide Inputbar
        } else {
            // Display Inputbar
            return(
                <InputToolbar
                {...props}
                />
            );
        }
    }   

    // Customize the color of sender's bubble
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

        // Set the screen title to the user name entered in the start screen
        this.props.navigation.setOptions({title: name});
        return(
            // Setting the background color to the color picked by the user in the start screen
            <View style={[{backgroundColor: color}, styles.container]}>
                <GiftedChat
                    messages={this.state.messages}
                    renderInputToolbar={this.renderInputToolbar}
                    renderBubble={this.renderBubble}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />

                {/* Avoid keyboard to overlap text messages on older Andriod versions */}
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
