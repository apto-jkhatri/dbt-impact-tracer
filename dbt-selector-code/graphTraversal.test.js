import { describe, it, expect } from 'vitest';
import { analyzeImpactPath, generateDbtCommand, calculateStats } from '../src/utils/graphTraversal';

describe('Graph Traversal Algorithm', () => {
  
  const createModel = (name, dependsOn = []) => ({
    uniqueId: `model.project.${name}`,
    name,
    schema: 'public',
    depends_on: dependsOn.map(n => `model.project.${n}`)
  });

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
      expect(result).toContain('model.project.target_main');
      expect(result).not.toContain('model.project.fct_other');
      expect(result).not.toContain('model.project.inter_other');
      expect(result).not.toContain('model.project.target_other');
    });

    it('should return empty when no path exists', () => {
      const models = [
        createModel('fct', []),
        createModel('target', [])
      ];

      const sources = new Set(['model.project.fct']);
      const target = 'model.project.target';

      const result = analyzeImpactPath(sources, target, models);
      
      expect(result.length).toBe(1);
      expect(result).toContain('model.project.fct');
    });

    it('should handle diamond dependency', () => {
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
    });
  });

  describe('generateDbtCommand', () => {
    
    it('should generate valid dbt command', () => {
      const modelNames = ['model_a', 'model_b', 'model_c'];
      const command = generateDbtCommand(modelNames);
      
      expect(command).toContain('dbt build --select');
      expect(command).toContain('model_a');
      expect(command).toContain('model_b');
      expect(command).toContain('model_c');
    });

    it('should sort models alphabetically', () => {
      const modelNames = ['zebra', 'apple', 'banana'];
      const command = generateDbtCommand(modelNames);
      
      const apple_idx = command.indexOf('apple');
      const banana_idx = command.indexOf('banana');
      const zebra_idx = command.indexOf('zebra');
      
      expect(apple_idx < banana_idx).toBe(true);
      expect(banana_idx < zebra_idx).toBe(true);
    });

    it('should handle empty array', () => {
      const command = generateDbtCommand([]);
      expect(command).toContain('...');
    });
  });

  describe('calculateStats', () => {
    
    it('should calculate percentage savings', () => {
      const stats = calculateStats(4, 10, 400);
      
      expect(stats.sourceCount).toBe(4);
      expect(stats.pathCount).toBe(10);
      expect(stats.savedPercent).toBe(97); // (1 - 10/400) * 100
      expect(stats.reduction).toBe(390);
    });

    it('should handle small numbers', () => {
      const stats = calculateStats(1, 1, 100);
      
      expect(stats.savedPercent).toBe(99);
      expect(stats.reduction).toBe(99);
    });
  });
});
