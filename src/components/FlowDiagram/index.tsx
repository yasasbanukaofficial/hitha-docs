import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { LogoNode, InfoNode, DecisionNode, GroupNode } from './customNodes';
import { FlowNodeData } from './types';
import { Play, Pause, RotateCcw, X, Info } from 'lucide-react';

export interface FlowDiagramProps {
  initialNodes: Node<FlowNodeData>[];
  initialEdges: Edge[];
  height?: number | string;
  caption?: string;
  direction?: 'LR' | 'TB';
  steps?: string[]; // IDs of edges in sequential order for play flow
}

function FlowDiagramInner({
  initialNodes,
  initialEdges,
  height = 420,
  caption,
  direction = 'LR',
  steps,
}: FlowDiagramProps) {
  const { fitView } = useReactFlow();
  const [selectedNodeData, setSelectedNodeData] = useState<FlowNodeData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Auto-layout with Dagre
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    const isLR = direction === 'LR';
    g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 90 });

    initialNodes.forEach((node) => {
      // rough node width and height
      const width = node.type === 'logoNode' ? 140 : node.type === 'groupNode' ? 320 : 180;
      const height = node.type === 'logoNode' ? 140 : node.type === 'groupNode' ? 240 : 80;
      g.setNode(node.id, { width, height });
    });

    initialEdges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const nodes = initialNodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      if (nodeWithPosition && !node.position?.x) {
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - (node.type === 'logoNode' ? 70 : 90),
            y: nodeWithPosition.y - (node.type === 'logoNode' ? 70 : 40),
          },
        };
      }
      return node;
    });

    return { layoutedNodes: nodes, layoutedEdges: initialEdges };
  }, [initialNodes, initialEdges, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const nodeTypes = useMemo(
    () => ({
      logoNode: LogoNode,
      infoNode: InfoNode,
      decisionNode: DecisionNode,
      groupNode: GroupNode,
    }),
    []
  );

  // Click on a node to see details
  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.data && (node.data as FlowNodeData).details) {
      setSelectedNodeData(node.data as FlowNodeData);
    }
  }, []);

  // Play flow sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && steps && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = (prev + 1) % steps.length;
          // highlight edge
          const activeEdgeId = steps[next];
          setEdges((eds) =>
            eds.map((e) => ({
              ...e,
              animated: e.id === activeEdgeId,
              style: {
                ...e.style,
                strokeWidth: e.id === activeEdgeId ? 3.5 : 2,
              },
            }))
          );
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps, setEdges]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setEdges(layoutedEdges);
    fitView({ padding: 0.2, duration: 400 });
  };

  return (
    <div
      className="flow-diagram-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        background: '#f8fbff',
        borderRadius: 16,
        border: '1px solid #e2eaf8',
        overflow: 'hidden',
        margin: '24px 0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Top Play / Reset Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          gap: 6,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {steps && steps.length > 0 && (
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: isPlaying ? '#eff6ff' : 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 11.5,
              fontWeight: 600,
              color: isPlaying ? '#2160fd' : '#475569',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: 'none',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 11.5,
            fontWeight: 600,
            color: '#64748b',
            cursor: 'pointer',
          }}
          title="Reset zoom and layout"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1.25} color="#c7ddfc" />
        {/* Intentionally NO MiniMap as requested by user */}
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Node Details Popover / Drawer */}
      {selectedNodeData && selectedNodeData.details && (
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            width: 320,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15)',
            zIndex: 20,
            padding: 16,
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Info size={15} color="#2160fd" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{selectedNodeData.label}</span>
            </div>
            <button
              onClick={() => setSelectedNodeData(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94a3b8' }}
            >
              <X size={15} />
            </button>
          </div>

          <div style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.5, marginBottom: 8 }}>
            {selectedNodeData.details.description}
          </div>

          {selectedNodeData.details.className && (
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#2563eb', marginBottom: 4 }}>
              Class: {selectedNodeData.details.className}
            </div>
          )}

          {selectedNodeData.details.config && (
            <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#16a34a' }}>
              Config: {selectedNodeData.details.config}
            </div>
          )}
        </div>
      )}

      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            borderTop: '1px solid #e2eaf8',
            padding: '6px 14px',
            fontSize: 11.5,
            color: '#64748b',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

export default function FlowDiagram(props: FlowDiagramProps) {
  return (
    <ReactFlowProvider>
      <FlowDiagramInner {...props} />
    </ReactFlowProvider>
  );
}
