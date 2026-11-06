import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
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
import { Play, Pause, RotateCcw, X, Info, ChevronRight } from 'lucide-react';

export interface FlowStep {
  step: number;
  nodeId?: string;
  edgeId?: string;
  description: string;
}

export interface FlowDiagramProps {
  nodes?: Node[];
  initialNodes?: Node[];
  edges?: Edge[];
  initialEdges?: Edge[];
  steps?: (FlowStep | string)[];
  scenario?: string;
  height?: number | string;
  caption?: string;
  direction?: 'LR' | 'TB';
}

function getLayoutedElements(nodes: Node[] = [], edges: Edge[] = [], direction = 'LR') {
  const safeNodes = (nodes || []).filter(Boolean);
  const safeEdges = (edges || []).filter(Boolean);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 130 : 180,
    ranksep: isHorizontal ? 260 : 160,
    marginx: 40,
    marginy: 40,
  });

  safeNodes.forEach((node) => {
    // Generous bounding box estimates for Dagre to guarantee >= 220px horizontal gap
    const width = node.type === 'logoNode' ? 150 : node.type === 'groupNode' ? 380 : 220;
    const height = node.type === 'logoNode' ? 150 : node.type === 'groupNode' ? 240 : 90;
    dagreGraph.setNode(node.id, { width, height });
  });

  safeEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = safeNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) return node;

    const width = node.type === 'logoNode' ? 150 : node.type === 'groupNode' ? 380 : 220;
    const height = node.type === 'logoNode' ? 150 : node.type === 'groupNode' ? 240 : 90;

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

  // Enhance edge styling with opaque label pills
  const styledEdges = safeEdges.map((edge) => ({
    ...edge,
    markerEnd: edge.markerEnd || { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#2160fd' },
    labelStyle: {
      fill: '#0f172a',
      fontWeight: 600,
      fontSize: 11.5,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      ...edge.labelStyle,
    },
    labelBgStyle: {
      fill: '#ffffff',
      fillOpacity: 0.96,
      ...edge.labelBgStyle,
    },
    labelBgPadding: [8, 4] as [number, number],
    labelBgBorderRadius: 6,
  }));

  return { nodes: layoutedNodes, edges: styledEdges };
}

export default function FlowDiagram({
  nodes: propNodes,
  initialNodes: propInitialNodes,
  edges: propEdges,
  initialEdges: propInitialEdges,
  steps = [],
  scenario,
  height = 440,
  caption,
  direction = 'LR',
}: FlowDiagramProps): React.JSX.Element {
  const rawNodes = useMemo(() => (propNodes || propInitialNodes || []).filter(Boolean), [propNodes, propInitialNodes]);
  const rawEdges = useMemo(() => (propEdges || propInitialEdges || []).filter(Boolean), [propEdges, propInitialEdges]);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedSteps: FlowStep[] = useMemo(() => {
    if (!steps || !Array.isArray(steps)) return [];
    return steps.map((s, idx) => {
      if (typeof s === 'string') {
        return { step: idx + 1, edgeId: s, description: `Step ${idx + 1}: ${s}` };
      }
      return s;
    });
  }, [steps]);
  const [effectiveDirection, setEffectiveDirection] = useState<'LR' | 'TB'>(direction);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Responsive switch: on narrow screens, auto-switch to TB
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 640) {
          setEffectiveDirection((prev) => (prev !== 'TB' ? 'TB' : prev));
        } else {
          setEffectiveDirection((prev) => (prev !== direction ? direction : prev));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [direction]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => getLayoutedElements(rawNodes, rawEdges, effectiveDirection),
    [rawNodes, rawEdges, effectiveDirection]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state ONLY when computed layout actually changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
    setTimeout(() => instance.fitView({ padding: 0.15 }), 60);
  }, []);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.data?.details || node.data?.title) {
      setSelectedNode(node.data);
    }
  }, []);

  // Step player animation
  useEffect(() => {
    if (!isPlaying || !normalizedSteps || normalizedSteps.length === 0) return;

    playTimerRef.current = setTimeout(() => {
      const nextIndex = (currentStepIndex + 1) % normalizedSteps.length;
      setCurrentStepIndex(nextIndex);

      const step = normalizedSteps[nextIndex];

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
          animated: e.id === step.edgeId || !step.edgeId,
          style: e.id === step.edgeId
            ? { ...e.style, stroke: '#2160fd', strokeWidth: 3 }
            : { ...e.style, strokeWidth: 1.5 },
        }))
      );
    }, 2000);

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, normalizedSteps, setNodes, setEdges]);

  const handleTogglePlay = () => {
    if (!normalizedSteps || normalizedSteps.length === 0) return;
    if (isPlaying) {
      setIsPlaying(false);
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    } else {
      setIsPlaying(true);
      if (currentStepIndex === -1) {
        setCurrentStepIndex(0);
        const step = normalizedSteps[0];
        setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === step.nodeId })));
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setCurrentStepIndex(-1);
    setNodes(initialNodes.map((n) => ({ ...n, selected: false })));
    setEdges(initialEdges.map((e) => ({ ...e, style: { ...e.style, strokeWidth: 1.5 } })));
    flowInstanceRef.current?.fitView({ padding: 0.15, duration: 300 });
  };

  const handleSelectStep = (index: number) => {
    if (!normalizedSteps || index < 0 || index >= normalizedSteps.length) return;
    setCurrentStepIndex(index);
    const step = normalizedSteps[index];
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === step.nodeId })));
  };

  const currentStep = normalizedSteps && currentStepIndex >= 0 ? normalizedSteps[currentStepIndex] : null;

  return (
    <div className="flow-diagram-wrapper" style={{ margin: '32px 0' }} ref={containerRef}>
      {/* Top Scenario Bar & Playback Controls */}
      <div
        className="flow-diagram-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#ffffff',
          border: '1px solid #e2eaf8',
          borderBottom: 'none',
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2160fd' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
            {scenario ? scenario : 'Interactive Architectural Flow'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {normalizedSteps && normalizedSteps.length > 0 && (
            <button
              type="button"
              onClick={handleTogglePlay}
              className="flow-control-btn play-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                background: isPlaying ? '#eff6ff' : '#2160fd',
                color: isPlaying ? '#2160fd' : '#ffffff',
                border: isPlaying ? '1px solid #bfdbfe' : 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play flow'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flow-control-btn reset-btn"
            title="Reset Zoom & Flow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div
        className="flow-diagram-container"
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          background: '#f8fbff',
          border: '1px solid #e2eaf8',
          borderBottomLeftRadius: normalizedSteps && normalizedSteps.length > 0 ? '0' : '14px',
          borderBottomRightRadius: normalizedSteps && normalizedSteps.length > 0 ? '0' : '14px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Technical Details Side Panel */}
        {selectedNode && (
          <div
            className="flow-node-details-drawer"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '300px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15)',
              zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info className="w-4 h-4 text-blue-600" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2160fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TECHNICAL DETAILS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              {selectedNode.title || selectedNode.label}
            </h4>

            {selectedNode.details ? (
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                {selectedNode.details.className && (
                  <div style={{ marginBottom: '6px' }}>
                    <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {selectedNode.details.className}
                    </code>
                  </div>
                )}
                <p style={{ margin: 0 }}>{selectedNode.details.description || selectedNode.caption}</p>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedNode.caption}</div>
            )}
          </div>
        )}

        {/* React Flow Viewport - strictly NO <Controls /> per Rule 2 */}
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onInit={onInit}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            zoomOnScroll={false}
            preventScrolling={false}
            zoomActivationKeyPressed="Control"
            panOnDrag={true}
            attributionPosition="bottom-right"
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="#c7ddfc" />
          </ReactFlow>
        </ReactFlowProvider>

        {/* Subtle Canvas Navigation Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '12px',
            fontSize: '11px',
            color: '#94a3b8',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          Ctrl + scroll to zoom · Drag to pan
        </div>
      </div>

      {/* Narration Bar (Rule 1 & 2) */}
      {normalizedSteps && normalizedSteps.length > 0 && (
        <div
          className="flow-narration-bar"
          style={{
            padding: '12px 16px',
            background: '#ffffff',
            border: '1px solid #e2eaf8',
            borderTop: 'none',
            borderBottomLeftRadius: '14px',
            borderBottomRightRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <span
              style={{
                background: currentStep ? '#eff6ff' : '#f1f5f9',
                color: currentStep ? '#2160fd' : '#64748b',
                border: currentStep ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {currentStep ? `Step ${currentStep.step} of ${normalizedSteps.length}` : 'Interactive Flow'}
            </span>

            <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>
              {currentStep ? currentStep.description : 'Press "Play flow" or click on any node to view real-life execution.'}
            </span>
          </div>

          {/* Clickable Step Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {normalizedSteps.map((st, idx) => (
              <button
                key={st.step}
                type="button"
                onClick={() => handleSelectStep(idx)}
                title={`Jump to step ${st.step}: ${st.description}`}
                style={{
                  width: idx === currentStepIndex ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: idx === currentStepIndex ? '#2160fd' : '#cbd5e1',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {caption && (
        <div
          className="flow-diagram-caption"
          style={{
            fontSize: '12.5px',
            color: '#64748b',
            marginTop: '24px',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
