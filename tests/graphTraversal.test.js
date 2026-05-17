import { describe, it, expect } from 'vitest';
import { analyzeImpactPath, generateDbtCommand, calculateStats, extractModelsFromManifest } from '../src/utils/graphTraversal';

/**
 * Test helper to create mock model objects
 */
const createModel = (name, dependsOn = []) => ({
  uniqueId: `model.project.${name}`,
  name,
  schema: 'public',
  depends_on: dependsOn.map(n => `model.project.${n}`)
});

describe('Graph Traversal Algorithm', () => {
  
  describe('analyzeImpactPath', () => {
    
    it('should find simple linear path', () => {
      const models = [
        createModel('source_model', []),
        createModel('intermediate_model', ['source_model']),
        createModel('target_model', ['intermediate_model'])
      ];

      const sources = new Set(['model.project.source_model']);
      const target = 'model.project.target_model';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result).toContain('model.project.source_model');
      expect(result).toContain('model.project.intermediate_model');
      expect(result).toContain('model.project.target_model');
      expect(result.length).toBe(3);
    });

    it('should find path with multiple sources', () => {
      const models = [
        createModel('fct_a', []),
        createModel('fct_b', []),
        createModel('inter_a', ['fct_a']),
        createModel('inter_b', ['fct_b']),
        createModel('union_model', ['inter_a', 'inter_b']),
        createModel('unrelated', [])
      ];

      const sources = new Set([
        'model.project.fct_a',
        'model.project.fct_b'
      ]);
      const target = 'model.project.union_model';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result).toContain('model.project.fct_a');
      expect(result).toContain('model.project.fct_b');
      expect(result).toContain('model.project.inter_a');
      expect(result).toContain('model.project.inter_b');
      expect(result).toContain('model.project.union_model');
      expect(result).not.toContain('model.project.unrelated');
    });

    it('should handle multiple layers', () => {
      const models = [
        createModel('fct', []),
        createModel('inter1', ['fct']),
        createModel('inter2', ['inter1']),
        createModel('inter3', ['inter2']),
        createModel('target', ['inter3'])
      ];

      const sources = new Set(['model.project.fct']);
      const target = 'model.project.target';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result.length).toBe(5);
      expect(result).toContain('model.project.fct');
      expect(result).toContain('model.project.inter1');
      expect(result).toContain('model.project.inter2');
      expect(result).toContain('model.project.inter3');
      expect(result).toContain('model.project.target');
    });

    it('should exclude unrelated branches', () => {
      const models = [
        createModel('fct_main', []),
        createModel('inter_main', ['fct_main']),
        createModel('target_main', ['inter_main']),
        
        createModel('fct_other', []),
        createModel('inter_other', ['fct_other']),
        createModel('target_other', ['inter_other'])
      ];

      const sources = new Set(['model.project.fct_main']);
      const target = 'model.project.target_main';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result).toContain('model.project.fct_main');
      expect(result).toContain('model.project.inter_main');
      expect(result).toContain('model.project.target_main');
      expect(result).not.toContain('model.project.fct_other');
      expect(result).not.toContain('model.project.inter_other');
      expect(result).not.toContain('model.project.target_other');
    });

    it('should return only source when no path exists', () => {
      const models = [
        createModel('fct', []),
        createModel('target', [])  // No connection to fct
      ];

      const sources = new Set(['model.project.fct']);
      const target = 'model.project.target';

      const result = analyzeImpactPath(sources, target, models);
      
      // Should only include source since there's no path
      expect(result.length).toBe(1);
      expect(result).toContain('model.project.fct');
    });

    it('should handle diamond dependency pattern', () => {
      // Diamond pattern: source splits then merges
      //        source
      //       /      \
      //    branch_a  branch_b
      //       \      /
      //        target
      const models = [
        createModel('source', []),
        createModel('branch_a', ['source']),
        createModel('branch_b', ['source']),
        createModel('target', ['branch_a', 'branch_b'])
      ];

      const sources = new Set(['model.project.source']);
      const target = 'model.project.target';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result.length).toBe(4);
      expect(result).toContain('model.project.source');
      expect(result).toContain('model.project.branch_a');
      expect(result).toContain('model.project.branch_b');
      expect(result).toContain('model.project.target');
    });

    it('should handle complex graph with multiple paths', () => {
      // Real-world scenario: MRR calculation
      const models = [
        createModel('fct_payments_mrr', []),
        createModel('fct_voip_mrr', []),
        createModel('inter_payments_calc', ['fct_payments_mrr']),
        createModel('inter_voip_calc', ['fct_voip_mrr']),
        createModel('inter_combined', ['inter_payments_calc', 'inter_voip_calc']),
        createModel('union_mrr_final', ['inter_combined']),
        createModel('unrelated_model', [])
      ];

      const sources = new Set([
        'model.project.fct_payments_mrr',
        'model.project.fct_voip_mrr'
      ]);
      const target = 'model.project.union_mrr_final';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result).toContain('model.project.fct_payments_mrr');
      expect(result).toContain('model.project.fct_voip_mrr');
      expect(result).toContain('model.project.union_mrr_final');
      expect(result).not.toContain('model.project.unrelated_model');
    });

    it('should handle empty sources', () => {
      const models = [
        createModel('model_a', []),
        createModel('model_b', ['model_a'])
      ];

      const sources = new Set();
      const target = 'model.project.model_b';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result.length).toBe(0);
    });
  });

  describe('generateDbtCommand', () => {
    
    it('should generate valid dbt command', () => {
      const modelNames = ['model_a', 'model_b', 'model_c'];
      const command = generateDbtCommand(modelNames);
      
      expect(command).toBe('dbt build --select model_a model_b model_c');
    });

    it('should sort models alphabetically', () => {
      const modelNames = ['zebra', 'apple', 'banana'];
      const command = generateDbtCommand(modelNames);
      
      expect(command).toBe('dbt build --select apple banana zebra');
    });

    it('should handle empty array', () => {
      const command = generateDbtCommand([]);
      expect(command).toContain('...');
    });

    it('should handle single model', () => {
      const command = generateDbtCommand(['single_model']);
      expect(command).toBe('dbt build --select single_model');
    });
  });

  describe('calculateStats', () => {
    
    it('should calculate percentage savings correctly', () => {
      const stats = calculateStats(4, 10, 400);
      
      expect(stats.sourceCount).toBe(4);
      expect(stats.pathCount).toBe(10);
      expect(stats.savedPercent).toBe(98); // (1 - 10/400) * 100 = 97.5, rounded to 98
      expect(stats.reduction).toBe(390);
    });

    it('should handle small numbers', () => {
      const stats = calculateStats(1, 1, 100);
      
      expect(stats.savedPercent).toBe(99);
      expect(stats.reduction).toBe(99);
    });

    it('should handle full rebuild scenario', () => {
      const stats = calculateStats(100, 400, 400);
      
      expect(stats.savedPercent).toBe(0);
      expect(stats.reduction).toBe(0);
    });

    it('should use default total models', () => {
      const stats = calculateStats(2, 5);
      
      expect(stats.savedPercent).toBe(99); // (1 - 5/400) * 100
    });
  });

  describe('extractModelsFromManifest', () => {
    
    it('should extract models from valid manifest', () => {
      const manifest = {
        nodes: {
          'model.project.model_a': {
            resource_type: 'model',
            name: 'model_a',
            schema: 'public',
            depends_on: { nodes: ['model.project.source'] }
          },
          'model.project.model_b': {
            resource_type: 'model',
            name: 'model_b',
            schema: 'staging',
            depends_on: { nodes: [] }
          },
          'test.project.test_a': {
            resource_type: 'test',
            name: 'test_a'
          }
        }
      };

      const models = extractModelsFromManifest(manifest);
      
      expect(models.length).toBe(2);
      expect(models[0].name).toBe('model_a');
      expect(models[1].name).toBe('model_b');
    });

    it('should handle empty manifest', () => {
      const models = extractModelsFromManifest({});
      expect(models.length).toBe(0);
    });

    it('should handle null manifest', () => {
      const models = extractModelsFromManifest(null);
      expect(models.length).toBe(0);
    });

    it('should sort models by name', () => {
      const manifest = {
        nodes: {
          'model.project.zebra': { resource_type: 'model', name: 'zebra', depends_on: { nodes: [] } },
          'model.project.apple': { resource_type: 'model', name: 'apple', depends_on: { nodes: [] } },
          'model.project.banana': { resource_type: 'model', name: 'banana', depends_on: { nodes: [] } }
        }
      };

      const models = extractModelsFromManifest(manifest);
      
      expect(models[0].name).toBe('apple');
      expect(models[1].name).toBe('banana');
      expect(models[2].name).toBe('zebra');
    });
  });
});
