import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import DetailsScreen from './screens/DetailsScreen';
import HomeScreen from './screens/HomeScreen';
import ReviewScreen from './screens/ReviewScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import UserScreen from './screens/UserScreen';
import HomeHeader from './components/HomeHeader';
import DetailsHeader from './components/DetailsHeader';


const Stack = createNativeStackNavigator();

export default function App() {
  
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            header: (props) => <DetailsHeader {...props} title={route.params.movie.name} />,
          })}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={() => ({
            header: (props) => <DetailsHeader {...props} title={'User profile'} />,
          })}
        />
        <Stack.Screen
          name="Review"
          component={ReviewScreen}
          options={() => ({
            header: (props) => <DetailsHeader {...props} title={'Reviews'} />,
          })}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={() => ({
            header: (props) => <DetailsHeader {...props} title={'Favorites'} />,
          })}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{                    
            header: (props) => <HomeHeader {...props} />
          }}          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row', // Определяем направление расположения элементов в строку
    alignItems: 'center', // Выравниваем элементы по вертикали
    paddingHorizontal: 10, // Добавляем небольшие отступы по бокам
  },
  icon: {
    marginHorizontal: 10, // Добавляем отступы между иконками
  },
});
