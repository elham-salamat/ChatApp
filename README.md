# React Native ChatApp

## Description
The aim is building a chat mobile app using react native. The app will provide users with a chat interface and options to share images and their
location.


### User Stories
* As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
friends and family.
* As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.
* As a user, I want to send images to my friends to show them what I’m currently doing.
* As a user, I want to share my location with my friends to show them where I am.
* As a user, I want to be able to read my messages offline so I can reread conversations at any
time.
* As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface.

### Key Features 
* A page where users can enter their name and choose a background color for the chat screen
before joining the chat.
* A page displaying the conversation, as well as an input field and submit button.
* The chat must provide users with two additional communication features: sending images
and location data.
* Data gets stored online and offline


### What technology used and why?
**React Native** to develop mobile app because 
* it allows to create the same codebase for IOS and Android. 
* it has a large and active communiy 
* it allows me to use my javascrip tand react knowledge rather than learning a new programming laguage. 

**Expo** CLI to develope and test the app. 

**React Navigation** to navigate between the screens. 

**Gifted Chat** to develope UI of the App. 


## Necessary steps in developement process
### Setting up the Expo developement environment 

1. Install Expo Command Line Interface
```bash
npm install expo-cli --global
```

2. Create new Expo project in projects directory
```bash
expo init [project-name]
```

3. Start expo by navigating to project folder & running
```bash
npm start
```
### Installation of Reacr Navigation library
1. Navigate to project folder and run
```bash
npm install react-navigation
```

2. Install necessary dependencies
```bash
npm install @react-navigation/native @react-navigation/stack
expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

