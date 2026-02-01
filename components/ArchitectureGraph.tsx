
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ArchNode, ArchLink, NodeType } from '../types';

interface Props {
  nodes: ArchNode[];
  links: ArchLink[];
  onNodeClick: (node: ArchNode) => void;
  selectedNodeId?: string;
}

const getIconForType = (type: NodeType) => {
  switch (type) {
    case NodeType.USER: return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z';
    case NodeType.LOAD_BALANCER: return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
    case NodeType.FRONTEND: return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
    case NodeType.BACKEND_API: return 'M5 12h14M5 12l4-4m-4 4l4 4m5 0l4-4m-4 4l4 4';
    case NodeType.DATABASE: return 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4';
    case NodeType.CACHE: return 'M13 10V3L4 14h7v7l9-11h-7z';
    case NodeType.AI_MODEL: return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
    default: return 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4';
  }
};

const getColorForType = (type: NodeType) => {
  switch (type) {
    case NodeType.USER: return '#94a3b8';
    case NodeType.LOAD_BALANCER: return '#f59e0b';
    case NodeType.FRONTEND: return '#10b981';
    case NodeType.BACKEND_API: return '#3b82f6';
    case NodeType.DATABASE: return '#ef4444';
    case NodeType.AI_MODEL: return '#8b5cf6';
    case NodeType.CACHE: return '#06b6d4';
    default: return '#64748b';
  }
};

const ArchitectureGraph: React.FC<Props> = ({ nodes, links, onNodeClick, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);

    // Filter ranks to distribute horizontally
    const maxRank = Math.max(...nodes.map(n => n.rank));

    const simulation = d3.forceSimulation<any>(nodes)
      .force('link', d3.forceLink<any, any>(links).id(d => d.id).distance(180))
      .force('charge', d3.forceManyBody().strength(-2000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX().x(d => {
        // Distribute nodes along the X axis based on their logical rank
        const padding = 150;
        const availableWidth = width - padding * 2;
        return padding + (d.rank / maxRank) * availableWidth;
      }).strength(2.0))
      .force('y', d3.forceY().y(height / 2).strength(0.1))
      .force('collision', d3.forceCollide().radius(100));

    // Glow Filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Marker for arrowheads
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 65)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#475569');

    // Curved Links
    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('opacity', 0.6);

    // Link Labels (mid-points)
    const linkLabels = g.append('g')
      .selectAll('text')
      .data(links)
      .enter().append('text')
      .attr('font-size', '10px')
      .attr('fill', '#64748b')
      .attr('text-anchor', 'middle')
      .attr('font-weight', '500')
      .text(d => d.label);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d))
      .call(d3.drag<any, any>()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        })
      );

    // Node Container
    node.append('rect')
      .attr('width', 140)
      .attr('height', 80)
      .attr('x', -70)
      .attr('y', -40)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', d => d.id === selectedNodeId ? '#1e293b' : '#0f172a')
      .attr('stroke', d => d.id === selectedNodeId ? '#3b82f6' : '#1e293b')
      .attr('stroke-width', 2)
      .style('filter', d => d.id === selectedNodeId ? 'url(#glow)' : 'none');

    // Color Accent Bar
    node.append('rect')
      .attr('width', 4)
      .attr('height', 80)
      .attr('x', -70)
      .attr('y', -40)
      .attr('rx', 2)
      .attr('fill', d => getColorForType(d.type));

    // Icon
    node.append('path')
      .attr('d', d => getIconForType(d.type))
      .attr('transform', 'translate(-12, -28) scale(1)')
      .attr('fill', 'none')
      .attr('stroke', d => getColorForType(d.type))
      .attr('stroke-width', '1.5')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    // Label
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '15')
      .attr('fill', '#f8fafc')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .text(d => d.name);

    // Type Label
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '30')
      .attr('fill', '#64748b')
      .attr('font-size', '9px')
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '0.05em')
      .text(d => d.type.replace('_', ' '));

    simulation.on('tick', () => {
      link.attr('d', d => {
        const sx = (d.source as any).x;
        const sy = (d.source as any).y;
        const tx = (d.target as any).x;
        const ty = (d.target as any).y;
        const dx = tx - sx;
        const dy = ty - sy;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
        // Simple straight-ish curve to avoid clutter
        return `M${sx},${sy}Q${(sx + tx) / 2 + 20},${(sy + ty) / 2 - 20} ${tx},${ty}`;
      });

      linkLabels
        .attr('x', d => ((d.source as any).x + (d.target as any).x) / 2 + 10)
        .attr('y', d => ((d.source as any).y + (d.target as any).y) / 2 - 15);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [nodes, links, onNodeClick, selectedNodeId]);

  return (
    <div className="w-full h-full bg-[#0a0f1e] overflow-hidden rounded-2xl border border-slate-800/50 shadow-inner relative">
       <div className="absolute top-6 left-8 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400/50 animate-pulse" style={{animationDelay: '0.2s'}}></span>
            </div>
            Architecture Topology
          </h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Real-time Traffic Trace</p>
       </div>
       <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default ArchitectureGraph;
