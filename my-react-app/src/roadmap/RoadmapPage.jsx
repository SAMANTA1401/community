

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import D3Roadmap from './D3Roadmap';
import D3SkillRoadmap from './D3Roadmap';

const RoadmapPage = () => {
  const { career } = useParams();
  const [currentState, setCurrentState] = useState('');
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('degree'); // degree or skill
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setError('');
    // Optionally clear old roadmap while generating:
    // setRoadmapData(null);

    try {
      // const response = await fetch('http://localhost:8000/generate-roadmap', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     career,
      //     current_state: currentState,
      //     target,
      //     mode
      //   })
      // });

      // if (!response.ok) {
      //   throw new Error(`Server error: ${response.status}`);
      // }

      // const data = await response.json();
      const data = {
        "id": "skill_root",
        "name": "Class 12 Student",
        "type": "root",
        "meta": {
          "description": "Completed Class 12, pursuing AI Engineering through self-learning and skills"
        },
        "children": [
          {
            "id": "learn_programming",
            "name": "Learn Python & Math",
            "type": "skill",
            "meta": {
              "duration": "3-6 months",
              "resources": ["Khan Academy", "freeCodeCamp", "Python Docs"],
              "skills_covered": ["Variables", "Loops", "Linear Algebra", "Calculus"]
            },
            "edge": {
              "transition": "Start self-paced online learning"
            },
            "children": [
              {
                "id": "ml_basics",
                "name": "ML Basics & Projects",
                "type": "skill",
                "meta": {
                  "duration": "3-4 months",
                  "resources": ["Coursera ML by Andrew Ng", "Kaggle"],
                  "skills_covered": ["Supervised Learning", "Unsupervised Learning"]
                },
                "edge": {
                  "transition": "Complete projects and assignments"
                },
                "children": [
                  {
                    "id": "deep_learning",
                    "name": "Deep Learning Specialization",
                    "type": "skill",
                    "meta": {
                      "duration": "4-6 months",
                      "resources": ["DeepLearning.AI", "fast.ai"],
                      "skills_covered": ["CNN", "RNN", "Transformer"]
                    },
                    "edge": {
                      "transition": "Hands-on projects with PyTorch/TensorFlow"
                    },
                    "children": [
                      {
                        "id": "portfolio_build",
                        "name": "AI Portfolio & GitHub",
                        "type": "portfolio",
                        "meta": {
                          "description": "Build a strong portfolio with 3-5 AI projects",
                          "platforms": ["GitHub", "Kaggle", "HuggingFace"]
                        },
                        "edge": {
                          "transition": "Push projects + write blogs"
                        },
                        "children": [
                          {
                            "id": "freelance_intern",
                            "name": "Freelance/Internship",
                            "type": "job",
                            "meta": {
                              "description": "Apply for real-world AI work",
                              "platforms": ["Upwork", "Internshala", "LinkedIn"]
                            },
                            "edge": {
                              "transition": "Cold email, apply via platforms"
                            }
                          },
                          {
                            "id": "ai_engineer_self",
                            "name": "AI Engineer Job (Self-Taught)",
                            "type": "job",
                            "meta": {
                              "description": "Apply to startups/companies",
                              "requirements": ["GitHub profile", "Interview prep"]
                            },
                            "edge": {
                              "transition": "Interview + project demo"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "id": "ml_basics",
                "name": "ML Basics & Projects",
                "type": "skill",
                "meta": {
                  "duration": "3-4 months",
                  "resources": ["Coursera ML by Andrew Ng", "Kaggle"],
                  "skills_covered": ["Supervised Learning", "Unsupervised Learning"]
                },
                "edge": {
                  "transition": "Complete projects and assignments"
                },
                "children": [
                  {
                    "id": "deep_learning",
                    "name": "Deep Learning Specialization",
                    "type": "skill",
                    "meta": {
                      "duration": "4-6 months",
                      "resources": ["DeepLearning.AI", "fast.ai"],
                      "skills_covered": ["CNN", "RNN", "Transformer"]
                    },
                    "edge": {
                      "transition": "Hands-on projects with PyTorch/TensorFlow"
                    },
                    "children": [
                      {
                        "id": "portfolio_build",
                        "name": "AI Portfolio & GitHub",
                        "type": "portfolio",
                        "meta": {
                          "description": "Build a strong portfolio with 3-5 AI projects",
                          "platforms": ["GitHub", "Kaggle", "HuggingFace"]
                        },
                        "edge": {
                          "transition": "Push projects + write blogs"
                        },
                        "children": [
                          {
                            "id": "freelance_intern",
                            "name": "Freelance/Internship",
                            "type": "job",
                            "meta": {
                              "description": "Apply for real-world AI work",
                              "platforms": ["Upwork", "Internshala", "LinkedIn"]
                            },
                            "edge": {
                              "transition": "Cold email, apply via platforms"
                            }
                          },
                          {
                            "id": "ai_engineer_self",
                            "name": "AI Engineer Job (Self-Taught)",
                            "type": "job",
                            "meta": {
                              "description": "Apply to startups/companies",
                              "requirements": ["GitHub profile", "Interview prep"]
                            },
                            "edge": {
                              "transition": "Interview + project demo"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }


            ]
          },
          {
            "id": "learn_programming",
            "name": "Learn Python & Math",
            "type": "skill",
            "meta": {
              "duration": "3-6 months",
              "resources": ["Khan Academy", "freeCodeCamp", "Python Docs"],
              "skills_covered": ["Variables", "Loops", "Linear Algebra", "Calculus"]
            },
            "edge": {
              "transition": "Start self-paced online learning"
            },
            "children": [
              {
                "id": "ml_basics",
                "name": "ML Basics & Projects",
                "type": "skill",
                "meta": {
                  "duration": "3-4 months",
                  "resources": ["Coursera ML by Andrew Ng", "Kaggle"],
                  "skills_covered": ["Supervised Learning", "Unsupervised Learning"]
                },
                "edge": {
                  "transition": "Complete projects and assignments"
                },
                "children": [
                  {
                    "id": "deep_learning",
                    "name": "Deep Learning Specialization",
                    "type": "skill",
                    "meta": {
                      "duration": "4-6 months",
                      "resources": ["DeepLearning.AI", "fast.ai"],
                      "skills_covered": ["CNN", "RNN", "Transformer"]
                    },
                    "edge": {
                      "transition": "Hands-on projects with PyTorch/TensorFlow"
                    },
                    "children": [
                      {
                        "id": "portfolio_build",
                        "name": "AI Portfolio & GitHub",
                        "type": "portfolio",
                        "meta": {
                          "description": "Build a strong portfolio with 3-5 AI projects",
                          "platforms": ["GitHub", "Kaggle", "HuggingFace"]
                        },
                        "edge": {
                          "transition": "Push projects + write blogs"
                        },
                        "children": [
                          {
                            "id": "freelance_intern",
                            "name": "Freelance/Internship",
                            "type": "job",
                            "meta": {
                              "description": "Apply for real-world AI work",
                              "platforms": ["Upwork", "Internshala", "LinkedIn"]
                            },
                            "edge": {
                              "transition": "Cold email, apply via platforms"
                            }
                          },
                          {
                            "id": "ai_engineer_self",
                            "name": "AI Engineer Job (Self-Taught)",
                            "type": "job",
                            "meta": {
                              "description": "Apply to startups/companies",
                              "requirements": ["GitHub profile", "Interview prep"]
                            },
                            "edge": {
                              "transition": "Interview + project demo"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
      
   
      console.log('Received roadmap:', data);
      setRoadmapData(data);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  

  // When mode changes, reset loading and error (and optionally roadmapData)
  useEffect(() => {
    setLoading(false);
    setError('');
    setRoadmapData(null); // Optional: clear old roadmap when switching mode
  }, [mode]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{career} Roadmap Generator</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Current Education State:{' '}
          <input
            type="text"
            value={currentState}
            onChange={(e) => setCurrentState(e.target.value)}
            placeholder="e.g. 12th pass, BSc, Diploma"
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Target Role (Optional):{' '}
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. Data Scientist"
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Roadmap Mode:{' '}
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="degree">Degree-based Roadmap</option>
            <option value="skill">Skill-based Roadmap</option>
          </select>
        </label>
      </div>

      <button onClick={handleGenerateRoadmap} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Roadmap'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {roadmapData && (
        <>
          <h3 style={{ marginTop: '20px' }}>
            Generated Roadmap ({mode} mode)
          </h3>
          <D3SkillRoadmap key={mode} data={roadmapData} />
        </>
      )}
    </div>
  );
};

export default RoadmapPage;
