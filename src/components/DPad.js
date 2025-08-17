import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const DPad = ({ onLeft, onRight, onUp, onDown, disabled }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <TouchableOpacity
          style={[styles.button, styles.leftButton]}
          onPress={onLeft}
          disabled={disabled}
        >
          <Text style={styles.arrow}>◄</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.upButton]}
          onPress={onUp}
          disabled={disabled}
        >
          <Text style={styles.arrow}>↻</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rightSide}>
        <TouchableOpacity
          style={[styles.button, styles.downButton]}
          onPress={onDown}
          disabled={disabled}
        >
          <Text style={styles.arrow}>⇊</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  leftSide: {
    flexDirection: 'row',
    gap: 10,
  },
  rightSide: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    width: 60,
    height: 60,
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
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default DPad;