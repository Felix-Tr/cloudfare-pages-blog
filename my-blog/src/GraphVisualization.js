import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import * as d3 from 'd3';

const GraphVisualization = () => {
  const svgRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [simulation, setSimulation] = useState(null);

  // Fetch CSV data only once on component mount
  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/Felix-Tr/cloudfare-pages-blog/main/my-blog/src/mockData.csv'
        );
        const data = await response.text();
        const parsedData = d3.csvParse(data);
        setCsvData(parsedData);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchCsvData();
  }, []);

  // Memoize the nodeData and links calculation
  const { nodeData, links } = useMemo(() => {
    const nodeData = csvData.map((d) => ({
      id: d.id,
      title: d.title,
      author: d.author,
      content: d.content,
    }));

    const links = csvData.flatMap((d) => {
      const connectionStrength = d.connection_strength || '';
      const connections = connectionStrength.split(/,\s*(?!{)/g).reduce((acc, pair) => {
        const [key, value] = pair.split(/:\s*/);
        if (key && value) {
          const targetNode = nodeData.find((node) => node.id === key);
          if (targetNode) {
            acc.push({ source: d.id, target: targetNode, strength: parseInt(value, 10) });
          }
        }
        return acc;
      }, []);

      return connections;
    });

    return { nodeData, links };
  }, [csvData]);

  // Memoize the getNodeRadius function
  const getNodeRadius = useCallback(
    (author) => {
      if (!author) {
        return 10; // Return a default radius if author is undefined or null
      }
      return 10 + author.length * 2;
    },
    []
  );

  // Update the simulation when csvData or window size changes
  useEffect(() => {
    if (csvData.length === 0) return;

    const width = window.innerWidth;
    const height = window.innerHeight - 60; // Adjust the height based on the tab height

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const maxStrength = Math.max(...links.map((link) => link.strength));
    const scalingFactor = 200 / maxStrength; // Adjust this value to control the spacing

    const newSimulation = d3
      .forceSimulation(nodeData)
      .force('link', d3.forceLink(links).id((d) => d.id).distance((d) => d.strength * scalingFactor))
      .force('charge', d3.forceManyBody().strength(-500)) // Increased repulsion force
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(getNodeRadius));

    if (simulation) {
      simulation.stop();
    }

    newSimulation.nodes(nodeData);
    newSimulation.force('link').links(links);

    const link = svg
      .selectAll('.links')
      .data([null])
      .join('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => d.strength);

    const node = svg
      .selectAll('.nodes')
      .data([null])
      .join('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodeData)
      .join('g')
      .on('mouseover', (event, d) => setHoveredNode(d))
      .on('mouseout', () => setHoveredNode(null));

    node
      .selectAll('circle')
      .data((d) => [d])
      .join('circle')
      .attr('r', (d) => getNodeRadius(d.author))
      .attr('fill', (d) => d3.schemeCategory10[d.id % 10])
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    node
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .text((d) => d.author)
      .attr('x', (d) => getNodeRadius(d.author) + 5)
      .attr('y', 4)
      .style('fill', '#333')
      .style('font-size', '12px');

    node
      .selectAll('title')
      .data((d) => [d])
      .join('title')
      .text((d) => `${d.title}\n${d.content}`); // Display both title and content in the tooltip

    newSimulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    newSimulation.restart();
    setSimulation(newSimulation);

    function dragstarted(event, d) {
      if (!event.active) newSimulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) newSimulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [csvData, getNodeRadius]);

  // Clean up the simulation on component unmount
  useEffect(() => {
    return () => {
      if (simulation) {
        simulation.stop();
      }
    };
  }, [simulation]);

  return (
    <div>
      <p>
        This tab shows my past podcasts and articles from the last 48 months. Older entries will be added soon, but for now, this is the available history.
      </p>
      <svg ref={svgRef}></svg>
      {hoveredNode && (
        <div className="node-tooltip" style={{ position: 'fixed', background: 'white', padding: '10px', zIndex: 999 }}>
          <h3>{hoveredNode.title}</h3>
          <p>Author: {hoveredNode.author}</p>
          <p>Content: {hoveredNode.content}</p>
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;