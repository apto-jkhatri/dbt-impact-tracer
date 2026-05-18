import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Position
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 44;

function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 30, ranksep: 70 });

  nodes.forEach(node => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layouted = nodes.map(node => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    };
  });

  return { nodes: layouted, edges };
}

function ImpactDAG({ pathModelDetails }) {
  const { nodes, edges } = useMemo(() => {
    if (!pathModelDetails || pathModelDetails.length === 0) {
      return { nodes: [], edges: [] };
    }

    const styleFor = (type) => {
      if (type === 'source') {
        return {
          background: 'var(--color-background-info)',
          color: 'var(--color-text-info)',
          border: '1px solid var(--color-border-info)'
        };
      }
      if (type === 'target') {
        return {
          background: 'var(--color-background-success)',
          color: 'var(--color-text-success)',
          border: '1px solid var(--color-border-success)'
        };
      }
      return {
        background: 'var(--color-background-primary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-secondary)'
      };
    };

    const rawNodes = pathModelDetails.map(m => ({
      id: m.id,
      data: { label: m.name },
      position: { x: 0, y: 0 },
      style: {
        ...styleFor(m.type),
        borderRadius: 'var(--border-radius-md)',
        fontSize: '12px',
        fontWeight: 500,
        padding: '8px 12px',
        width: NODE_WIDTH
      }
    }));

    const rawEdges = [];
    pathModelDetails.forEach(m => {
      m.depends_on.forEach(depId => {
        rawEdges.push({
          id: `${depId}->${m.id}`,
          source: depId,
          target: m.id,
          animated: false,
          style: { stroke: 'var(--color-border-tertiary)', strokeWidth: 1.5 }
        });
      });
    });

    return getLayoutedElements(rawNodes, rawEdges);
  }, [pathModelDetails]);

  if (!nodes.length) return null;

  return (
    <div style={{
      height: '400px',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-md)',
      background: 'var(--color-background-secondary)'
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} color="var(--color-border-primary)" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => node.style?.background || '#eee'}
          maskColor="rgba(0,0,0,0.05)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}

export default ImpactDAG;
