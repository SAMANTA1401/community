// src/roadmapUtils.js
let idCounter = 1;

export function convertRoadmapToFlow(roadmap) {
  const nodes = [];
  const edges = [];

  roadmap.stages.forEach((stage, stageIndex) => {
    const stageId = `stage-${idCounter++}`;
    nodes.push({
      id: stageId,
      data: { label: `${stage.title} (${stage.duration})` },
      position: { x: 250 * stageIndex, y: 0 },
      type: 'input',
    });

    stage.topics.forEach((topic, topicIndex) => {
      const topicId = `topic-${idCounter++}`;
      nodes.push({
        id: topicId,
        data: { label: topic.topic },
        position: { x: 250 * stageIndex, y: 100 + topicIndex * 100 },
      });
      edges.push({ id: `${stageId}-${topicId}`, source: stageId, target: topicId });

      topic.subtopics.forEach((subtopic, subIndex) => {
        const subId = `sub-${idCounter++}`;
        nodes.push({
          id: subId,
          data: { label: subtopic },
          position: { x: 250 * stageIndex, y: 200 + topicIndex * 100 + subIndex * 50 },
        });
        edges.push({ id: `${topicId}-${subId}`, source: topicId, target: subId });
      });
    });
  });

  return { nodes, edges };
}
