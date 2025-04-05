// A simple mock implementation for Clarity contract testing
// This is a simplified version that doesn't actually execute Clarity code
// but simulates the behavior for testing purposes

export function mockClarity() {
	// In-memory storage for contract state
	let state = {
		species: {},
		conditions: {},
		propagation: {},
		samples: {},
		diversity: {},
		nextIds: {
			species: 1,
			event: 1,
			sample: 1
		}
	};
	
	return {
		// Reset the state
		reset() {
			state = {
				species: {},
				conditions: {},
				propagation: {},
				samples: {},
				diversity: {},
				nextIds: {
					species: 1,
					event: 1,
					sample: 1
				}
			};
		},
		
		// Execute a public function
		executePublic(functionName: string, args: any[]) {
			switch (functionName) {
				case 'register-species':
					return this.registerSpecies(args[0], args[1], args[2]);
				case 'update-conservation-status':
					return this.updateConservationStatus(args[0], args[1]);
				case 'add-growing-conditions':
					return this.addGrowingConditions(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
				case 'update-growing-conditions':
					return this.updateGrowingConditions(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
				case 'record-propagation':
					return this.recordPropagation(args[0], args[1], args[2], args[3], args[4], args[5]);
				case 'register-genetic-sample':
					return this.registerGeneticSample(args[0], args[1], args[2], args[3], args[4]);
				case 'update-viability-status':
					return this.updateViabilityStatus(args[0], args[1]);
				default:
					return { success: false, error: 'Function not implemented in mock' };
			}
		},
		
		// Execute a read-only function
		executeReadOnly(functionName: string, args: any[]) {
			switch (functionName) {
				case 'get-species':
					return this.getSpecies(args[0]);
				case 'get-growing-conditions':
					return this.getGrowingConditions(args[0]);
				case 'get-propagation-event':
					return this.getPropagationEvent(args[0]);
				case 'get-genetic-sample':
					return this.getGeneticSample(args[0]);
				case 'get-species-diversity':
					return this.getSpeciesDiversity(args[0]);
				default:
					return { success: false, error: 'Function not implemented in mock' };
			}
		},
		
		// Species Registry functions
		registerSpecies(scientificName: string, commonName: string, conservationStatus: string) {
			const id = state.nextIds.species;
			state.species[id] = {
				scientific_name: scientificName,
				common_name: commonName,
				conservation_status: conservationStatus,
				registration_date: Date.now(),
				registered_by: 'mock-principal'
			};
			state.nextIds.species++;
			return { success: true, value: id };
		},
		
		getSpecies(id: number) {
			if (state.species[id]) {
				return { success: true, value: state.species[id] };
			}
			return { success: false, error: 'Species not found' };
		},
		
		updateConservationStatus(id: number, newStatus: string) {
			if (state.species[id]) {
				state.species[id].conservation_status = newStatus;
				return { success: true, value: true };
			}
			return { success: false, error: 1 };
		},
		
		// Growing Conditions functions
		addGrowingConditions(
			speciesId: number,
			lightReq: string,
			tempRange: string,
			humidity: string,
			soilType: string,
			watering: string,
			notes: string
		) {
			state.conditions[speciesId] = {
				light_requirements: lightReq,
				temperature_range: tempRange,
				humidity_level: humidity,
				soil_type: soilType,
				watering_frequency: watering,
				additional_notes: notes
			};
			return { success: true, value: true };
		},
		
		getGrowingConditions(speciesId: number) {
			if (state.conditions[speciesId]) {
				return { success: true, value: state.conditions[speciesId] };
			}
			return { success: false, error: 'Conditions not found' };
		},
		
		updateGrowingConditions(
			speciesId: number,
			lightReq: string,
			tempRange: string,
			humidity: string,
			soilType: string,
			watering: string,
			notes: string
		) {
			if (state.conditions[speciesId]) {
				state.conditions[speciesId] = {
					light_requirements: lightReq,
					temperature_range: tempRange,
					humidity_level: humidity,
					soil_type: soilType,
					watering_frequency: watering,
					additional_notes: notes
				};
				return { success: true, value: true };
			}
			return { success: false, error: 1 };
		},
		
		// Propagation Tracking functions
		recordPropagation(
			speciesId: number,
			propType: string,
			quantity: number,
			location: string,
			successRate: number,
			notes: string
		) {
			const id = state.nextIds.event;
			state.propagation[id] = {
				species_id: speciesId,
				propagation_type: propType,
				quantity: quantity,
				location: location,
				date: Date.now(),
				conducted_by: 'mock-principal',
				success_rate: successRate,
				notes: notes
			};
			state.nextIds.event++;
			return { success: true, value: id };
		},
		
		getPropagationEvent(id: number) {
			if (state.propagation[id]) {
				return { success: true, value: state.propagation[id] };
			}
			return { success: false, error: 'Event not found' };
		},
		
		// Genetic Diversity functions
		registerGeneticSample(
			speciesId: number,
			sourceLocation: string,
			geneticMarkers: string,
			storageLocation: string,
			viabilityStatus: string
		) {
			const id = state.nextIds.sample;
			state.samples[id] = {
				species_id: speciesId,
				source_location: sourceLocation,
				collection_date: Date.now(),
				genetic_markers: geneticMarkers,
				stored_by: 'mock-principal',
				storage_location: storageLocation,
				viability_status: viabilityStatus
			};
			
			// Update diversity metrics
			if (!state.diversity[speciesId]) {
				state.diversity[speciesId] = {
					sample_count: 0,
					diversity_index: 0,
					last_updated: Date.now()
				};
			}
			
			state.diversity[speciesId].sample_count++;
			state.diversity[speciesId].diversity_index = this.calculateDiversityIndex(
				speciesId,
				state.diversity[speciesId].sample_count
			);
			state.diversity[speciesId].last_updated = Date.now();
			
			state.nextIds.sample++;
			return { success: true, value: id };
		},
		
		getGeneticSample(id: number) {
			if (state.samples[id]) {
				return { success: true, value: state.samples[id] };
			}
			return { success: false, error: 'Sample not found' };
		},
		
		getSpeciesDiversity(speciesId: number) {
			if (state.diversity[speciesId]) {
				return { success: true, value: state.diversity[speciesId] };
			}
			return { success: false, error: 'Diversity metrics not found' };
		},
		
		updateViabilityStatus(id: number, newStatus: string) {
			if (state.samples[id]) {
				state.samples[id].viability_status = newStatus;
				return { success: true, value: true };
			}
			return { success: false, error: 1 };
		},
		
		// Helper function for diversity
		calculateDiversityIndex(speciesId: number, sampleCount: number) {
			// Simple formula: diversity increases with sample count but with diminishing returns
			if (sampleCount < 2) {
				return 0;
			}
			return Math.pow(2, Math.log2(sampleCount));
		}
	};
}
