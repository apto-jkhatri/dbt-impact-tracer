/**
 * dbt Impact Tracer - Graph Traversal Algorithm
 * 
 * Purpose: Find all models that form paths between source models and target model
 * 
 * Algorithm: Two-pass graph traversal
 * - Pass 1: Backward from target to find all dependencies leading to target
 * - Pass 2: Forward from sources to find all models reachable from sources
 * - Result: Intersection of both sets = minimal path models
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
 * 
 * Time: O(V + E) where V = models, E = dependencies
 * Space: O(V)
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
 * 
 * Time: O(V²) - for each source, we scan all models
 * Space: O(V)
 * 
 * Note: Could be optimized with reverse dependency map for larger graphs
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
 * Helper: Generate dbt build command from model names
 */
export function generateDbtCommand(modelNames) {
  if (modelNames.length === 0) {
    return 'dbt build --select model1 model2 ...';
  }
  return `dbt build --select ${modelNames.sort().join(' ')}`;
}

/**
 * Helper: Calculate statistics
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
 * Example usage:
 * 
 * const manifest = JSON.parse(fs.readFileSync('target/manifest.json'));
 * const models = extractModels(manifest);
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
