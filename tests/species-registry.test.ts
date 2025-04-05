import { describe, it, expect, beforeEach } from 'vitest';
import { mockClarity } from './mock-clarity';

// Mock the Clarity environment
const clarity = mockClarity();

describe('Species Registry Contract', () => {
  beforeEach(() => {
    // Reset contract state before each test
    clarity.reset();
  });
  
  it('should register a new species', () => {
    const result = clarity.executePublic('register-species', [
      'Amorphophallus titanum',
      'Corpse Flower',
      'Endangered'
    ]);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(1); // First species ID
    
    const speciesData = clarity.executeReadOnly('get-species', [1]);
    expect(speciesData.value.scientific_name).toBe('Amorphophallus titanum');
    expect(speciesData.value.conservation_status).toBe('Endangered');
  });
  
  it('should update conservation status', () => {
    // First register a species
    clarity.executePublic('register-species', [
      'Rafflesia arnoldii',
      'Corpse Lily',
      'Vulnerable'
    ]);
    
    // Then update its status
    const updateResult = clarity.executePublic('update-conservation-status', [1, 'Critically Endangered']);
    expect(updateResult.success).toBe(true);
    
    // Verify the update
    const speciesData = clarity.executeReadOnly('get-species', [1]);
    expect(speciesData.value.conservation_status).toBe('Critically Endangered');
  });
  
  it('should fail to update non-existent species', () => {
    const result = clarity.executePublic('update-conservation-status', [999, 'Extinct']);
    expect(result.success).toBe(false);
    expect(result.error).toBe(1); // Error code for species not found
  });
});
