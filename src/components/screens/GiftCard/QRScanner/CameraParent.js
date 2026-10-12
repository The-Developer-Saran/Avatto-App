import { Alert } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import { askPermissions } from './usePermissions'

const [cameraShown, setCameraShown] = useState(false);

const takePermissions = async () => {

    try {
        const response = await askPermissions();

        // Permission granted
        if (
            response.type === RESULTS.LIMITED ||
            response.type === RESULTS.GRANTED
        ) {
            setCameraShown(true);
        }
    } catch (error) {
        // Generic error
        if (error?.isError) {
            Alert.alert(
                error.errorMessage ||
                'Something went wrong while taking camera permission',
            );
            return;
        }

        // Permission-specific error
        if (error?.type) {
            if (error.type === RESULTS.UNAVAILABLE) {
                Alert.alert('This feature is not supported on this device');
            } else if (
                error.type === RESULTS.BLOCKED ||
                error.type === RESULTS.DENIED
            ) {
                Alert.alert(
                    'Permission Denied',
                    'Please give permission from settings to continue using camera.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Go To Settings',
                            onPress: () => goToSettings(),
                        },
                    ],
                );
            }
        }
    }
};
