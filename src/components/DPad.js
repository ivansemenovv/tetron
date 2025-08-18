import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const DPad = ({ onLeft, onRight, onUp, onDown, disabled }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.button, styles.downButton]}
          onPress={onDown}
          disabled={disabled}
        >
          <Text style={styles.arrow}>⇊</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.upButton]}
          onPress={onUp}
          disabled={disabled}
        >
          <Text style={styles.arrow}>↻</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.button, styles.leftButton]}
          onPress={onLeft}
          disabled={disabled}
        >
          <Text style={styles.arrow}>◄</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={onRight}
          disabled={disabled}
        >
          <Text style={styles.arrow}>►</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 140,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 65,
    height: 65,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  leftButton: {
    backgroundColor: '#3498db',
  },
  rightButton: {
    backgroundColor: '#3498db',
  },
  upButton: {
    backgroundColor: '#9b59b6',
  },
  downButton: {
    backgroundColor: '#e74c3c',
  },
  arrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default DPad;