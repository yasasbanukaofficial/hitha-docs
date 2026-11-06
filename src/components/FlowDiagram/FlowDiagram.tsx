import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { LogoNode, InfoNode, DecisionNode, GroupNode } from './FlowNodes';
import { Play, Pause, RotateCcw, X, Info } from 'lucide-react';

export interface FlowStep {
  step: number;
  nodeId?: string;
  edgeId?: string;
  description: string;
}

export interface FlowDiagramProps {
  nodes: Node[];
  edges: Edge[];
  steps?: FlowStep[];
  height?: number | string;
  caption?: string;
  direction?: 'LR' | 'TB';
}

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 70,
    ranksep: 90,
    marginx: 30,
    marginy: 30,
  });

  nodes.forEach((node) => {
    // Standard sizes for dagre
    const width = node.type === 'logoNode' ? 140 : node.type === 'groupNode' ? 360 : 200;
    const height = node.type === 'logoNode' ? 140 : node.type === 'groupNode' ? 220 : 80;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) return node;

    const width = node.type === 'logoNode' ? 140 : node.type === 'groupNode' ? 360 : 200;
    const height = node.type === 'logoNode' ? 140 : node.type === 'groupNode' ? 220 : 80;

    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export default function FlowDiagram({
  nodes: rawNodes,
  edges: rawEdges,
  steps,
  height = 420,
  caption,
  direction = 'LR',
}: FlowDiagramProps): React.JSX.Element {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => getLayoutedElements(rawNodes, rawEdges, direction),
    [rawNodes, rawEdges, direction]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const nodeTypes = useMemo(
    () => ({
      logoNode: LogoNode,
      infoNode: InfoNode,
      decisionNode: DecisionNode,
      groupNode: GroupNode,
    }),
    []
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    flowInstanceRef.current = instance;
    setTimeout(() => instance.fitView({ padding: 0.15 }), 50);
  }, []);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.data?.details || node.data?.title) {
      setSelectedNode(node.data);
    }
  }, []);

  // Step player logic
  useEffect(() => {
    if (!isPlaying || !steps || steps.length === 0) return;

    playTimerRef.current = setTimeout(() => {
      const nextIndex = (currentStepIndex + 1) % steps.length;
      setCurrentStepIndex(nextIndex);

      const step = steps[nextIndex];

      // Highlight active node and edge
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === step.nodeId,
        }))
      );

      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: e.id === step.edgeId,
          style: e.id === step.edgeId
            ? { ...e.style, stroke: '#2160fd', strokeWidth: 3 }
            : { ...e.style, strokeWidth: 1.5 },
        }))
      );
    }, 1800);

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps, setNodes, setEdges]);

  const handleTogglePlay = () => {
    if (!steps || steps.length === 0) return;
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (currentStepIndex === -1) setCurrentStepIndex(0);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setNodes(initialNodes);
    setEdges(initialEdges);
    flowInstanceRef.current?.fitView({ padding: 0.15 });
  };

  return (
    <div className="flow-diagram-wrapper" style={{ margin: '24px 0 32px' }}>
      <div
        className="flow-canvas-container"
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          background: '#f8fbff',
          borderRadius: '16px',
          border: '1px solid #e2eaf8',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Top Control Bar */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {steps && steps.length > 0 && (
            <button
              type="button"
              onClick={handleTogglePlay}
              className="flow-ctrl-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: isPlaying ? '#2160fd' : '#ffffff',
                color: isPlaying ? '#ffffff' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : '▶ Play flow'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flow-ctrl-btn"
            title="Reset View"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Step Indicator Banner */}
        {isPlaying && steps && currentStepIndex >= 0 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '16px',
              zIndex: 10,
              background: '#ffffff',
              border: '1px solid #2160fd',
              borderRadius: '10px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0f172a',
              boxShadow: '0 4px 12px rgba(33, 96, 253, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                background: '#2160fd',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '1px 7px',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              Step {steps[currentStepIndex].step}
            </span>
            <span>{steps[currentStepIndex].description}</span>
          </div>
        )}

        {/* Details Popover Panel on Node Click */}
        {selectedNode && (
          <div
            className="flow-details-popover"
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              zIndex: 20,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 20px',
              maxWidth: '300px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} color="#2160fd" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                  {selectedNode.title || 'Details'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>

            {selectedNode.details ? (
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                {selectedNode.details.className && (
                  <div style={{ marginBottom: '4px' }}>
                    <code style={{ fontSize: '11px' }}>{selectedNode.details.className}</code>
                  </div>
                )}
                <p style={{ margin: 0 }}>{selectedNode.details.description || selectedNode.caption}</p>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedNode.caption}</div>
            )}
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="#c7ddfc" />
          {/* Controls included WITHOUT MiniMap */}
          <Controls showInteractive={false} position="bottom-left" />
        </ReactFlow>
      </div>

      {caption && (
        <div
          className="flow-diagram-caption"
          style={{
            fontSize: '12.5px',
            color: '#64748b',
            marginTop: '8px',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
