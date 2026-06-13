'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ReactFlow, Background, Position, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Brain, Info, HelpCircle } from 'lucide-react';
import { MOCK_CONSTELLATION_NODES, MOCK_CONSTELLATION_EDGES } from '@/lib/mockData';
import { StructuredGeminiAnalysis } from '@/lib/types';

interface StressConstellationProps {
  latestAnalysis: StructuredGeminiAnalysis | null;
}

// Custom Node component
function ConstellationNode({ data }: { data: any }) {
  const size = data.size || 50;
  
  // High contrast mode check is done via Tailwind class
  const nodeStyles = useMemo(() => {
    switch (data.nodeType) {
      case 'subject':
        return 'bg-primary/20 text-foreground border-primary hover:bg-primary/30 shadow-[0_0_20px_rgba(99,102,241,0.25)]';
      case 'psychological':
        return 'bg-secondary/20 text-foreground border-secondary hover:bg-secondary/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]';
      default:
        return 'bg-accent/20 text-foreground border-accent hover:bg-accent/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]';
    }
  }, [data.nodeType]);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.max(9, size / 6.5)}px`,
      }}
      className={`rounded-full flex items-center justify-center text-center p-2 font-bold border transition-all duration-300 ease-out select-none cursor-pointer ${nodeStyles}`}
    >
      <span className="leading-tight leading-3 font-semibold break-words">{data.label}</span>
    </div>
  );
}

const nodeTypes = {
  constellation: ConstellationNode,
};

export default function StressConstellation({ latestAnalysis }: StressConstellationProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{ id: string; label: string; type: string; size: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute nodes and edges dynamically based on the latest Gemini analysis
  const { nodes, edges } = useMemo(() => {
    const defaultNodes = MOCK_CONSTELLATION_NODES;
    const defaultEdges = MOCK_CONSTELLATION_EDGES;

    if (!latestAnalysis?.stressConstellationUpdates) {
      return {
        nodes: defaultNodes.map(n => ({
          id: n.id,
          type: 'constellation',
          position: { x: n.x, y: n.y },
          data: { label: n.label, size: n.size, nodeType: n.type },
        })),
        edges: defaultEdges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          animated: true,
          style: { strokeWidth: e.weight / 2.5, stroke: 'var(--color-primary)' },
        })),
      };
    }

    // Map custom updates from Gemini API
    const updates = latestAnalysis.stressConstellationUpdates;
    const updatedNodes = defaultNodes.map(n => {
      const match = updates.nodes.find(un => un.id === n.id);
      return {
        id: n.id,
        type: 'constellation',
        position: { x: n.x, y: n.y },
        data: { label: n.label, size: match ? match.size : n.size, nodeType: n.type },
      };
    });

    const updatedEdges = updates.edges.map((e, idx) => ({
      id: `e-gemini-${idx}`,
      source: e.source,
      target: e.target,
      animated: true,
      style: { strokeWidth: Math.max(1.5, e.weight / 2.5), stroke: 'var(--color-secondary)' },
    }));

    return { nodes: updatedNodes, edges: updatedEdges };
  }, [latestAnalysis]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    const matchedNode = MOCK_CONSTELLATION_NODES.find(n => n.id === node.id);
    setSelectedNode({
      id: node.id,
      label: node.data.label as string,
      type: matchedNode?.type || 'General',
      size: node.data.size as number,
    });
  };

  const getNodeExplanation = (nodeId: string) => {
    switch (nodeId) {
      case 'Physics':
        return 'Physics triggers heavy concept dread due to rotatory mechanics backlog. Highly correlated with drops in overall test confidence.';
      case 'Sleep':
        return 'High levels of study anxiety disrupt REM cycles. Sleeping under 6 hours dramatically increases emotional volatility and exam panic.';
      case 'ParentPressure':
        return 'Parent expectations generate extrinsic pressure. The fear of disappointing them directly fuels daily anxiety spikes.';
      case 'MockTests':
        return 'Mock tests are currently acting as an anxiety trigger instead of diagnostic feedback. A lower score immediately causes confidence to plummet.';
      case 'Anxiety':
        return 'Central psychological bridge node. Transmits mock exam and parent pressure directly into physiological sleep disruption.';
      case 'Confidence':
        return 'Critical resilience dampener. When confidence drops, it triggers general exam avoidance and study procrastination.';
      case 'Backlog':
        return 'Accumulating topics generate background guilt, leading to frantic, late-night study sessions that disrupt sleep.';
      default:
        return 'Active trigger contributing to exam stress. Addressing this node helps dismantle the correlation web.';
    }
  };

  return (
    <div 
      className="glass-panel rounded-2xl p-6 flex flex-col h-full min-h-[460px]"
      aria-label="Interactive Stress Constellation Graph"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Brain size={20} className="text-primary" />
            Stress Constellation
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            AI-mapped causal loops. Node sizes indicate stress impact; connection thicknesses show correlation.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] flex items-center gap-1 bg-white/5 border border-card-border px-2 py-0.5 rounded text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Subject
          </span>
          <span className="text-[10px] flex items-center gap-1 bg-white/5 border border-card-border px-2 py-0.5 rounded text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span> Psychological
          </span>
        </div>
      </div>

      <div className="flex-1 border border-card-border/55 bg-black/30 rounded-xl overflow-hidden relative min-h-[300px]">
        {mounted ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesConnectable={false}
            nodesDraggable={true}
            zoomOnScroll={false}
            panOnDrag={true}
            aria-label="Interactive node network of stress triggers"
          >
            <Background color="rgba(255,255,255,0.05)" gap={16} size={1} />
          </ReactFlow>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
            Mapping stress loops...
          </div>
        )}

        {/* Floating guidance note */}
        <div className="absolute bottom-2 left-2 bg-slate-900/90 text-foreground border border-card-border rounded px-2.5 py-1 text-[10px] flex items-center gap-1 shadow-md">
          <Info size={12} className="text-primary" />
          <span>Interactive: Click or drag nodes to investigate patterns</span>
        </div>
      </div>

      {/* Node explanation drawer */}
      {selectedNode && (
        <div className="mt-4 bg-white/5 border border-card-border rounded-xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-1">
              <Brain size={12} />
              Trigger Detail: {selectedNode.label}
            </span>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-xs text-text-muted hover:text-foreground focus:outline-none"
              aria-label="Dismiss detail"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-foreground">{getNodeExplanation(selectedNode.id)}</p>
          <div className="flex gap-4 mt-3 pt-3 border-t border-card-border/30 text-xs">
            <span className="text-text-muted">
              Impact Score: <strong className="text-foreground">{Math.round((selectedNode.size / 90) * 10)}/10</strong>
            </span>
            <span className="text-text-muted">
              Type: <strong className="text-foreground capitalize">{selectedNode.type}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
