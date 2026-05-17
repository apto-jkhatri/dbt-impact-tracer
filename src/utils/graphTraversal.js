/**
 * dbt Impact Tracer - Graph Traversal Algorithm
 * 
 * Purpose: Find all models that form paths between source models and target model
 * 
 * Algorithm: Two-pass graph traversal
 * - Pass 1: Backward from target to find all dependencies leading to target
 * - Pass 2: Forward from sources to find all models reachable from sources
 * - Result: Intersection of both sets = minimal path models
 * 
 * Time Complexity: O(V + E) where V = models, E = dependencies
 * Space Complexity: O(V)
 */

/**
 * Analyze impact path between source models and target model
 * 
 * @param {Set<string>} sourceIds - Set of source model unique IDs
 * @param {string} targetId - Target model unique ID
 * @param {Array<Object>} allModels - Array of model objects with uniqueId, name, depends_on
 * @returns {Array<string>} - Array of model IDs in the impact path
 */
export function analyzeImpactPath(sourceIds, targetId, allModels) {
  const modelMap = new Map(allModels.map(m => [m.uniqueId, m]));

  // PASS 1: Backward search - find all models that lead to target
  const allReachableToTarget = backwardSearch(targetId, modelMap);

  // PASS 2: Forward search - find all models reachable from sources
  const reachableFromSources = forwardSearch(
    Array.from(sourceIds),
    allModels,
    modelMap
  );

  // PASS 3: Intersection - return models in both sets
  const pathModels = Array.from(sourceIds);
  reachableFromSources.forEach(modelId => {
    if (allReachableToTarget.has(modelId) && !sourceIds.has(modelId)) {
      pathModels.push(modelId);
    }
  });

  return pathModels;
}

/**
 * Backward search: Starting from target, find all models (dependencies) that reach it
 * Uses BFS to traverse the dependency graph upstream
 * 
 * @param {string} targetId - Target model unique ID
 * @param {Map<string, Object>} modelMap - Map of model ID to model object
 * @returns {Set<string>} - Set of model IDs reachable to target
 */
function backwardSearch(targetId, modelMap) {
  const reachable = new Set();
  const queue = [targetId];
  const visited = new Set([targetId]);

  while (queue.length > 0) {
    const current = queue.shift();
    reachable.add(current);

    const currentModel = modelMap.get(current);
    if (!currentModel) continue;

    // Follow all dependencies (upstream)
    currentModel.depends_on.forEach(depId => {
      if (!visited.has(depId)) {
        visited.add(depId);
        queue.push(depId);
      }
    });
  }

  return reachable;
}

/**
 * Forward search: Starting from sources, find all models that depend on them
 * Uses BFS to traverse the dependency graph downstream
 * 
 * @param {Array<string>} sourceIds - Array of source model IDs
 * @param {Array<Object>} allModels - All models in the project
 * @param {Map<string, Object>} modelMap - Map of model ID to model object
 * @returns {Set<string>} - Set of model IDs reachable from sources
 */
function forwardSearch(sourceIds, allModels, modelMap) {
  const reachable = new Set(sourceIds);
  const queue = [...sourceIds];
  const visited = new Set(sourceIds);

  while (queue.length > 0) {
    const current = queue.shift();
    const currentModel = modelMap.get(current);
    if (!currentModel) continue;

    // Find all models that depend on current
    allModels.forEach(model => {
      if (visited.has(model.uniqueId)) return;

      if (model.depends_on.includes(current)) {
        visited.add(model.uniqueId);
        reachable.add(model.uniqueId);
        queue.push(model.uniqueId);
      }
    });
  }

  return reachable;
}

/**
 * Generate a dbt build command from model names
 * 
 * @param {Array<string>} modelNames - Array of model names
 * @returns {string} - dbt build command
 */
export function generateDbtCommand(modelNames) {
  if (modelNames.length === 0) {
    return 'dbt build --select model1 model2 ...';
  }
  return `dbt build --select ${modelNames.sort().join(' ')}`;
}

/**
 * Calculate statistics about the impact analysis
 * 
 * @param {number} sourceCount - Number of source models
 * @param {number} pathCount - Number of models in path
 * @param {number} totalModels - Total models in project (default 400)
 * @returns {Object} - Statistics object
 */
export function calculateStats(sourceCount, pathCount, totalModels = 400) {
  return {
    sourceCount,
    pathCount,
    savedPercent: Math.round((1 - pathCount / totalModels) * 100),
    reduction: totalModels - pathCount
  };
}

/**
 * Parse a dbt manifest.json and extract model information
 * 
 * @param {Object} manifest - Parsed manifest.json object
 * @returns {Array<Object>} - Array of model objects
 */
export function extractModelsFromManifest(manifest) {
  if (!manifest || !manifest.nodes) return [];
  
  return Object.entries(manifest.nodes)
    .filter(([key, node]) => node.resource_type === 'model')
    .map(([key, node]) => ({
      uniqueId: key,
      name: node.name,
      schema: node.schema,
      database: node.database,
      depends_on: node.depends_on?.nodes || [],
      description: node.description || '',
      tags: node.tags || []
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Example usage:
 * 
 * const manifest = JSON.parse(fs.readFileSync('target/manifest.json'));
 * const models = extractModelsFromManifest(manifest);
 * 
 * const sources = new Set([
 *   'model.project.fct_monthly_payments_account_fee_mrr',
 *   'model.project.fct_monthly_voip_mrr'
 * ]);
 * const target = 'model.project.union_monthly_mrr_evolution_model';
 * 
 * const pathModels = analyzeImpactPath(sources, target, models);
 * const command = generateDbtCommand(
 *   pathModels.map(id => models.find(m => m.uniqueId === id)?.name)
 * );
 * 
 * console.log(command);
 * // Output: dbt build --select fct_... inter_... union_...
 */
