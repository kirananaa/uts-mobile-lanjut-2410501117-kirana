import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: 'MovieDex' }}
      />
      <Stack.Screen 
        name="DetailScreen" 
        component={DetailScreen}
        options={{ title: 'Detail Movie' }}
      />
    </Stack.Navigator>
  );
}