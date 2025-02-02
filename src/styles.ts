import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#6750a4',
    background: '#f0eef6',
    message: {
        ai: '#e1dced',
        user: '#b4a8d2'
    },
    error: {
        background: '#f5c3c6',
        text: 'red'
    }
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    input: {
        marginBottom: 12,
        backgroundColor: colors.background,
    },
    button: {
        marginTop: 8,
    }
});
