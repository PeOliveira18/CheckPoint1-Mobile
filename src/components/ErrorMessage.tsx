import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  text: {
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
  },
});
