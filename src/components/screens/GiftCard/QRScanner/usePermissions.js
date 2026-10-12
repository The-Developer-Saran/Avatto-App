import { useCallback } from 'react';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { Platform } from 'react-native';

/* Platform helpers */
const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

/* Permission Types (JS alternative to enum) */
export const PermissionTypes = {
    CAMERA: 'camera',
};

export const usePermissions = (typeOfPermission) => {
    const getPermission = useCallback(() => {
        // Validate permission type
        if (
            !typeOfPermission ||
            !Object.values(PermissionTypes).includes(typeOfPermission)
        ) {
            throw new Error('Unsupported type of permission.');
        }

        if (isIos) {
            switch (typeOfPermission) {
                case PermissionTypes.CAMERA:
                default:
                    return PERMISSIONS.IOS.CAMERA;
            }
        }

        if (isAndroid) {
            switch (typeOfPermission) {
                case PermissionTypes.CAMERA:
                default:
                    return PERMISSIONS.ANDROID.CAMERA;
            }
        }

        throw new Error('Unsupported Operating System.');
    }, [typeOfPermission]);

    const askPermissions = useCallback(async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await request(getPermission());

                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        return reject({ type: RESULTS.UNAVAILABLE });

                    case RESULTS.DENIED:
                        return reject({ type: RESULTS.DENIED });

                    case RESULTS.GRANTED:
                        return resolve({ type: RESULTS.GRANTED });

                    case RESULTS.BLOCKED:
                        return reject({ type: RESULTS.BLOCKED });

                    case RESULTS.LIMITED:
                        return resolve({ type: RESULTS.LIMITED });

                    default:
                        return reject({ type: result });
                }
            } catch (e) {
                return reject({
                    isError: true,
                    errorMessage:
                        e?.data?.message ||
                        e?.message ||
                        'Something went wrong while asking for permissions.',
                });
            }
        });
    }, [getPermission]);

    return {
        askPermissions,
    };
};
