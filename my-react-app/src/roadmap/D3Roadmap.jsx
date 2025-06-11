import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3SkillRoadmap = ({ data }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const tooltip = d3.select(tooltipRef.current);

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    let width = 900, height = 600;
    const margin = { top: 30, right: 60, bottom: 30, left: 60 };

    const root = d3.hierarchy(data);
    root.x0 = height / 2;
    root.y0 = 0;
    root.children?.forEach(collapse);

    let highlightedPath = [];

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function expand(d) {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      if (d.children) {
        d.children.forEach(expand);
      }
    }

    function getPathToRoot(d) {
      const path = [];
      let current = d;
      while (current) {
        path.push(current);
        current = current.parent;
      }
      return path.reverse();
    }

    function update(source) {
      const treeLayout = d3.tree().nodeSize([60, 200]);
      treeLayout(root);

      const nodes = root.descendants();
      const links = root.links();

      const left = Math.min(...nodes.map(d => d.x));
      const right = Math.max(...nodes.map(d => d.x));
      const depth = Math.max(...nodes.map(d => d.depth));

      height = Math.max(400, right - left + margin.top + margin.bottom);
      width = Math.max(350, 200 * (depth + 1));

      svg.attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]);

      nodes.forEach(d => {
        d.y = d.depth * 200 + margin.left;
        d.x = d.x - left + margin.top;
      });

      const link = g.selectAll(".link").data(links, d => d.target.data.id);

      link.exit().transition().duration(400).attr("opacity", 0).remove();

      const linkEnter = link.enter().append("path")
        .attr("class", "link")
        .attr("opacity", 0)
        .attr("stroke", d => getLinkColor(d.source.depth))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("d", d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      linkEnter.merge(link)
        .transition().duration(600).attr("opacity", 1)
        .attr("stroke", d => getLinkColor(d.source.depth))
        .attr("d", diagonal)
        .attr("class", d => {
          let isHighlight = false;
          for (let i = 1; i < highlightedPath.length; i++) {
            if (d.source === highlightedPath[i - 1] && d.target === highlightedPath[i]) isHighlight = true;
          }
          return isHighlight ? "link highlight" : "link";
        });

      const node = g.selectAll(".node").data(nodes, d => d.data.id);

      const nodeExit = node.exit();
      nodeExit.transition().duration(400).attr("transform", d => `translate(${source.y},${source.x})`).remove();

      const nodeEnter = node.enter().append("g")
        .attr("class", d => "node" + (d.children || d._children ? " node--internal" : " node--leaf"))
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => {
          highlightedPath = getPathToRoot(d);
          if (d.parent && d.parent.children) {
            d.parent.children.forEach(sibling => {
              if (sibling !== d) collapse(sibling);
            });
          }
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else if (d._children) {
            d.children = d._children;
            d._children = null;
          }
          zoomToNode(d);
          update(d);
        });

      nodeEnter.each(function (d) {
        const textElement = d3.select(this).append("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle")
          .attr("fill", "#fff")
          .text(d.data.name);

        const textWidth = textElement.node().getComputedTextLength();
        const textPadding = 12;
        const lineHeight = 20;
        const nodeWidth = textWidth + textPadding * 2;
        const nodeHeight = lineHeight + textPadding * 2;

        d.nodeWidth = nodeWidth;
        d.nodeHeight = nodeHeight;

        d3.select(this).insert("rect", "text")
          .attr("x", -nodeWidth / 2)
          .attr("y", -nodeHeight / 2)
          .attr("width", nodeWidth)
          .attr("height", nodeHeight)
          .attr("fill", getNodeColor(d.data.type))
          .on("mouseover", function (event) {
            tooltip
              .style("opacity", 1)
              .html(formatMeta(d.data.meta))
              .style("left", `${event.pageX + 18}px`)
              .style("top", `${event.pageY - 10}px`);
          })
          .on("mousemove", function (event) {
            tooltip.style("left", `${event.pageX + 18}px`).style("top", `${event.pageY - 10}px`);
          })
          .on("mouseout", () => tooltip.style("opacity", 0));
      });

      nodeEnter.merge(node).transition().duration(600).attr("transform", d => `translate(${d.y},${d.x})`);

      nodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });
    }

    function diagonal(d) {
      const sourceX = d.source.x, sourceY = d.source.y + (d.source.nodeWidth || 0) / 2;
      const targetX = d.target.x, targetY = d.target.y - (d.target.nodeWidth || 0) / 2;
      const curvature = 0.4;
      return `M${sourceY},${sourceX} C${sourceY + (targetY - sourceY) * curvature},${sourceX} ${targetY - (targetY - sourceY) * curvature},${targetX} ${targetY},${targetX}`;
    }

    function getLinkColor(depth) {
      const colors = ["#999", "#6b9bd2", "#4bc0c0", "#f39c12", "#e74c3c"];
      return colors[depth % colors.length];
    }

    function getNodeColor(type) {
      const map = {
        root: "#333",
        skill: "#28a7de",
        portfolio: "#f39c12",
        job: "#e74c3c"
      };
      return map[type] || "#a54ce0";
    }

    function formatMeta(meta) {
      if (!meta) return "";
      return Object.entries(meta).map(([k, v]) => `<div><strong>${k}:</strong> ${Array.isArray(v) ? v.join(", ") : v}</div>`).join("");
    }

    function zoomToNode(d) {
      const scale = 1;
      const translate = [width / 2 - d.y * scale, height / 2 - d.x * scale];
      svg.transition().duration(750).call(zoomBehavior.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    update(root);
    zoomToNode(root);

    window.expandAll = () => { root.each(expand); update(root); };
    window.collapseAll = () => { root.children?.forEach(collapse); update(root); };

    return () => { window.removeEventListener("resize", update); };
  }, [data]);

  return (
    <div className="tree-container">
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => window.expandAll()}>Expand All</button>
        <button onClick={() => window.collapseAll()} style={{ marginLeft: "10px" }}>Collapse All</button>
      </div>
      <svg ref={svgRef} width="100%" height="100%">
        <g ref={gRef}></g>
      </svg>
      <div ref={tooltipRef} className="d3-tooltip" style={{
        position: "absolute",
        opacity: 0,
        background: "#333",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "4px",
        pointerEvents: "none",
        fontSize: "12px"
      }}></div>
    </div>
  );
};

export default D3SkillRoadmap;
