import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button, TextInput, Divider, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import {useUser} from "@/src/contexts/UserContsxt";
import { styles as root_styles, colors } from "@/src/styles";

export default function Profile() {
    const { user, updateUser, setAvatar } = useUser();
    const { logout } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(user);

    const handleAvatarPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            await setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        await updateUser(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(user);
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };

    return (
        <ScrollView style={root_styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>

                    {user.avatar ? <Avatar.Image
                        size={120}
                        source={{uri: user.avatar}}
                    /> : <Avatar.Icon size={100} icon="account" />}
                    <IconButton
                        icon="camera"
                        size={24}
                        onPress={handleAvatarPick}
                        style={styles.avatarEditButton}
                        iconColor='#fff'
                    />
                </View>
            </View>

            <View style={styles.content}>
                <TextInput
                    label="Name"
                    value={isEditing ? editData.name : user.name}
                    onChangeText={text => setEditData({ ...editData, name: text })}
                    mode="outlined"
                    style={root_styles.input}
                    disabled={!isEditing}
                />

                <TextInput
                    label="Email"
                    value={user.email}
                    mode="outlined"
                    style={root_styles.input}
                    disabled
                />

                <Divider style={styles.divider} />

                {isEditing ? (
                    <View style={styles.editButtons}>
                        <Button
                            mode="outlined"
                            onPress={handleCancel}
                            style={[root_styles.button, styles.cancelButton, styles.button]}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={[root_styles.button, styles.button]}
                        >
                            Save
                        </Button>
                    </View>
                ) : (
                    <Button
                        mode="contained"
                        onPress={() => setIsEditing(true)}
                        style={root_styles.button}
                    >
                        Edit Profile
                    </Button>
                )}

                <Button
                    mode="outlined"
                    onPress={handleLogout}
                    style={[root_styles.button, styles.logoutButton]}
                    textColor={colors.error.text}
                >
                    Logout
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: colors.background
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarEditButton: {
        position: 'absolute',
        right: -8,
        bottom: -8,
        backgroundColor: colors.primary,
    },
    content: {
        padding: 16,
    },
    divider: {
        marginVertical: 24,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    logoutButton: {
        marginTop: 24,
        borderColor: colors.error.text,
        backgroundColor: colors.error.background,
    },
    cancelButton: {
        borderColor: colors.primary,
    },
    button: {
        flex: 1,
    }
});
