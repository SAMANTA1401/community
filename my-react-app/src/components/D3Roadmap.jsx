import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Roadmap = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const tooltip = d3.select(tooltipRef.current);

    const root = d3.hierarchy({
      name: data.title || 'Roadmap',
      children: data.stages.map((stage, i) => ({
        id: i + 1,
        name: `Stage ${stage.stage}: ${stage.title}`,
        type: 'folder',
        meta: 'Stage of career progression',
        children: stage.topics.map((topic, j) => ({
          id: (i + 1) * 10 + (j + 1),
          name: topic.topic,
          type: 'file',
          meta: 'Topic you should learn',
          children: topic.subtopics.map((sub, k) => ({
            id: (i + 1) * 100 + (j + 1) * 10 + (k + 1),
            name: sub,
            type: 'file',
            meta: 'Subtopic detail'
          }))
        }))
      }))
    });

    const treeLayout = d3.tree().nodeSize([50, 200]);
    treeLayout(root);

    const nodes = root.descendants();
    const links = root.links();

    svg
      .attr('width', 1200)
      .attr('height', 600)
      .attr('viewBox', `0 0 1200 600`);

    // Links
    svg
      .selectAll('path.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#b3cde8')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
      );

    // Nodes
    const nodeGroup = svg
      .selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', d => (d.children || d._children ? 'node node--internal' : 'node node--leaf'))
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .on('click', function (event, d) {
        // Collapse all siblings
        if (d.parent && d.parent.children) {
          d.parent.children.forEach(sibling => {
            if (sibling !== d) {
              collapse(sibling);
            }
          });
        }
        // Expand/collapse logic for clicked node
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else if (d._children) {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      });

    const nodeWidth = 70;
    const nodeHeight = 36;
    const circleRadius = 22;

    nodeGroup.each(function (d) {
      if (d.data.id && d.data.id % 2 === 0) {
        // Even id: circle
        d3.select(this)
          .append('circle')
          .attr('r', circleRadius)
          .attr('fill', d.data.type === 'folder' ? '#e3f0fa' : '#d4f8e8')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .on('mouseover', function (event) {
            tooltip
              .style('opacity', 1)
              .html(d.data.meta)
              .style('left', event.pageX + 18 + 'px')
              .style('top', event.pageY - 10 + 'px');
          })
          .on('mousemove', function (event) {
            tooltip
              .style('left', event.pageX + 18 + 'px')
              .style('top', event.pageY - 10 + 'px');
          })
          .on('mouseout', function () {
            tooltip.style('opacity', 0);
          });
      } else {
        // Odd id or root: rectangle
        d3.select(this)
          .append('rect')
          .attr('x', -nodeWidth / 2)
          .attr('y', -nodeHeight / 2)
          .attr('width', nodeWidth)
          .attr('height', nodeHeight)
          .attr('fill', d.data.type === 'folder' ? '#e3f0fa' : '#d4f8e8')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .on('mouseover', function (event) {
            tooltip
              .style('opacity', 1)
              .html(d.data.meta)
              .style('left', event.pageX + 18 + 'px')
              .style('top', event.pageY - 10 + 'px');
          })
          .on('mousemove', function (event) {
            tooltip
              .style('left', event.pageX + 18 + 'px')
              .style('top', event.pageY - 10 + 'px');
          })
          .on('mouseout', function () {
            tooltip.style('opacity', 0);
          });
      }
    });

    nodeGroup
      .append('text')
      .attr('x', 12)
      .attr('y', 0)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'start')
      .text(d => d.data.name);

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {
      treeLayout(root);
      const nodes = root.descendants();
      const links = root.links();

      svg.selectAll('path.link')
        .data(links)
        .transition()
        .duration(400)
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x));

      svg.selectAll('g.node')
        .data(nodes)
        .transition()
        .duration(400)
        .attr('transform', d => `translate(${d.y},${d.x})`);
    }
  }, [data]);

  return (
    <div className="tree-container" style={{ overflowX: 'auto', position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        className="d3-tooltip"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          background: '#fff',
          color: '#222',
          border: '1px solid #b3cde8',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(74,144,226,0.13)',
          padding: '10px 14px',
          fontSize: '0.97rem',
          maxWidth: '340px',
          zIndex: 10,
          opacity: 0,
          lineHeight: 1.5
        }}
      ></div>
    </div>
  );
};

export default D3Roadmap;
