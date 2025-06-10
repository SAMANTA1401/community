import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Roadmap = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const metaText = "The chart is ready for external method calls. If you want to interact with the chart, and call methods after you draw it, you should set up a listener for this event before you call the draw method, and call the methods only after the event is fired.";

    const buildHierarchy = (data) => {
      return {
        id: 1,
        name: data.title,
        type: "folder",
        meta: metaText,
        children: data.stages.map((stage, i) => ({
          id: (i + 1) * 10,
          name: `Stage ${stage.stage}: ${stage.title}`,
          type: "folder",
          meta: metaText,
          children: stage.topics.map((topic, j) => ({
            id: (i + 1) * 100 + (j + 1),
            name: topic.topic,
            type: "file",
            meta: metaText,
            children: topic.subtopics.map((sub, k) => ({
              id: (i + 1) * 1000 + (j + 1) * 10 + (k + 1),
              name: sub,
              type: "file",
              meta: metaText
            }))
          }))
        }))
      };
    };

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    let width = 900, height = 600;
    const margin = { top: 30, right: 60, bottom: 30, left: 60 };

    const root = d3.hierarchy(buildHierarchy(data));
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
      const treeLayout = d3.tree().nodeSize([40, 160]);
      treeLayout(root);

      const nodes = root.descendants();
      const links = root.links();

      const left = Math.min(...nodes.map(d => d.x));
      const right = Math.max(...nodes.map(d => d.x));
      const depth = Math.max(...nodes.map(d => d.depth));

      height = Math.max(400, right - left + margin.top + margin.bottom);
      width = Math.max(350, 180 * (depth + 1));

      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

      nodes.forEach(d => {
        d.y = d.depth * 160 + margin.left;
        d.x = d.x - left + margin.top;
      });

      // LINKS
      const link = svg.selectAll(".link")
        .data(links, d => d.target.data.id || d.target.data.name);

      link.exit().remove();

      link.enter().append("path")
          .attr("class", "link")
        .merge(link)
          .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
          )
          .classed("highlight", d => {
            if (!highlightedPath.length) return false;
            for (let i = 1; i < highlightedPath.length; i++) {
              if (d.source === highlightedPath[i - 1] && d.target === highlightedPath[i]) {
                return true;
              }
            }
            return false;
          });

      // NODES
      const node = svg.selectAll(".node")
        .data(nodes, d => d.data.id || d.data.name);

      node.exit().remove();

      const nodeEnter = node.enter().append("g")
        .attr("class", d =>
          "node" +
          (d.children || d._children ? " node--internal" : " node--leaf")
        )
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .on("click", (event, d) => {
          highlightedPath = getPathToRoot(d);

          // Collapse siblings
          if (d.parent && d.parent.children) {
            d.parent.children.forEach(sibling => {
              if (sibling !== d) {
                collapse(sibling);
              }
            });
          }

          // Expand/collapse clicked node
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else if (d._children) {
            d.children = d._children;
            d._children = null;
          }
          update(d);
        });

      // Draw circle or rectangle
      const nodeWidth = 70, nodeHeight = 36, circleRadius = 22;

      nodeEnter.each(function (d) {
        if (d.data.id && d.data.id % 2 === 0) {
          d3.select(this).append("circle")
            .attr("r", circleRadius)
            .attr("fill", d.data.type === "folder" ? "#28a7de" : "#a54ce0")
            .on("mouseover", function (event) {
              tooltip
                .style("opacity", 1)
                .html(d.data.meta)
                .style("left", `${event.pageX + 18}px`)
                .style("top", `${event.pageY - 10}px`);
            })
            .on("mousemove", function (event) {
              tooltip
                .style("left", `${event.pageX + 18}px`)
                .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => tooltip.style("opacity", 0));
        } else {
          d3.select(this).append("rect")
            .attr("x", -nodeWidth / 2)
            .attr("y", -nodeHeight / 2)
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .attr("fill", d.data.type === "folder" ? "#28a7de" : "#a54ce0")
            .on("mouseover", function (event) {
              tooltip
                .style("opacity", 1)
                .html(d.data.meta)
                .style("left", `${event.pageX + 18}px`)
                .style("top", `${event.pageY - 10}px`);
            })
            .on("mousemove", function (event) {
              tooltip
                .style("left", `${event.pageX + 18}px`)
                .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => tooltip.style("opacity", 0));
        }
      });

      // Text label
      nodeEnter.append("text")
        .attr("x", 12)
        .attr("y", 0)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "start")
        .attr("fill", "#fff")
        .text(d => d.data.name);

      nodeEnter.merge(node)
        .transition()
        .duration(400)
        .attr("transform", d => `translate(${d.y},${d.x})`);

      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);

    window.addEventListener("resize", () => {
      update(root);
    });
  }, [data]);

  return (
    <div className="tree-container">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="d3-tooltip"></div>
    </div>
  );
};

export default D3Roadmap;
