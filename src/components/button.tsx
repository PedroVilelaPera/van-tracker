import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Button({ label, onPress }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#610202',
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
});
