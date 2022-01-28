import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import CameraScreen from "./src/screens/CameraScreen";
import PhotoEditorScreen from "./src/screens/PhotoEditorScreen";
const navigator = createStackNavigator(
  {
    CameraScreen:CameraScreen,
    PhotoEditorScreen:PhotoEditorScreen,
  },
  {
    initialRouteName: "CameraScreen",
    defaultNavigationOptions: {
      title: "Photo Take And Share App",
    },
  }
);

export default createAppContainer(navigator);