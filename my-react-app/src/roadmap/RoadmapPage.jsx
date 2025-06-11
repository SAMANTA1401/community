

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

      // const data = {
      //   "id": "skill_root",
      //   "name": "Class 12 Student",
      //   "type": "root",
      //   "meta": {
      //     "description": "Completed Class 12, pursuing AI Engineering through self-learning and skills"
      //   },
      //   "children": [
      //     {
      //       "id": "learn_programming",
      //       "name": "Learn Python & Math",
      //       "type": "skill",
      //       "meta": {
      //         "duration": "3-6 months",
      //         "resources": ["Khan Academy", "freeCodeCamp", "Python Docs"],
      //         "skills_covered": ["Variables", "Loops", "Linear Algebra", "Calculus"]
      //       },
      //       "edge": {
      //         "transition": "Start self-paced online learning"
      //       },
      //       "children": [
      //         {
      //           "id": "ml_basics",
      //           "name": "ML Basics & Projects",
      //           "type": "skill",
      //           "meta": {
      //             "duration": "3-4 months",
      //             "resources": ["Coursera ML by Andrew Ng", "Kaggle"],
      //             "skills_covered": ["Supervised Learning", "Unsupervised Learning"]
      //           },
      //           "edge": {
      //             "transition": "Complete projects and assignments"
      //           },
      //           "children": [
      //             {
      //               "id": "deep_learning",
      //               "name": "Deep Learning Specialization",
      //               "type": "skill",
      //               "meta": {
      //                 "duration": "4-6 months",
      //                 "resources": ["DeepLearning.AI", "fast.ai"],
      //                 "skills_covered": ["CNN", "RNN", "Transformer"]
      //               },
      //               "edge": {
      //                 "transition": "Hands-on projects with PyTorch/TensorFlow"
      //               },
      //               "children": [
      //                 {
      //                   "id": "portfolio_build",
      //                   "name": "AI Portfolio & GitHub",
      //                   "type": "portfolio",
      //                   "meta": {
      //                     "description": "Build a strong portfolio with 3-5 AI projects",
      //                     "platforms": ["GitHub", "Kaggle", "HuggingFace"]
      //                   },
      //                   "edge": {
      //                     "transition": "Push projects + write blogs"
      //                   },
      //                   "children": [
      //                     {
      //                       "id": "freelance_intern",
      //                       "name": "Freelance/Internship",
      //                       "type": "job",
      //                       "meta": {
      //                         "description": "Apply for real-world AI work",
      //                         "platforms": ["Upwork", "Internshala", "LinkedIn"]
      //                       },
      //                       "edge": {
      //                         "transition": "Cold email, apply via platforms"
      //                       }
      //                     },
      //                     {
      //                       "id": "ai_engineer_self",
      //                       "name": "AI Engineer Job (Self-Taught)",
      //                       "type": "job",
      //                       "meta": {
      //                         "description": "Apply to startups/companies",
      //                         "requirements": ["GitHub profile", "Interview prep"]
      //                       },
      //                       "edge": {
      //                         "transition": "Interview + project demo"
      //                       }
      //                     }
      //                   ]
      //                 }
      //               ]
      //             }
      //           ]
      //         },
      //         {
      //           "id": "ml_basics",
      //           "name": "ML Basics & Projects",
      //           "type": "skill",
      //           "meta": {
      //             "duration": "3-4 months",
      //             "resources": ["Coursera ML by Andrew Ng", "Kaggle"],
      //             "skills_covered": ["Supervised Learning", "Unsupervised Learning"]
      //           },
      //           "edge": {
      //             "transition": "Complete projects and assignments"
      //           },
      //           "children": [
      //             {
      //               "id": "deep_learning",
      //               "name": "Deep Learning Specialization",
      //               "type": "skill",
      //               "meta": {
      //                 "duration": "4-6 months",
      //                 "resources": ["DeepLearning.AI", "fast.ai"],
      //                 "skills_covered": ["CNN", "RNN", "Transformer"]
      //               },
      //               "edge": {
      //                 "transition": "Hands-on projects with PyTorch/TensorFlow"
      //               },
      //               "children": [
      //                 {
      //                   "id": "portfolio_build",
      //                   "name": "AI Portfolio & GitHub",
      //                   "type": "portfolio",
      //                   "meta": {
      //                     "description": "Build a strong portfolio with 3-5 AI projects",
      //                     "platforms": ["GitHub", "Kaggle", "HuggingFace"]
      //                   },
      //                   "edge": {
      //                     "transition": "Push projects + write blogs"
      //                   },
      //                   "children": [
      //                     {
      //                       "id": "freelance_intern",
      //                       "name": "Freelance/Internship",
      //                       "type": "job",
      //                       "meta": {
      //                         "description": "Apply for real-world AI work",
      //                         "platforms": ["Upwork", "Internshala", "LinkedIn"]
      //                       },
      //                       "edge": {
      //                         "transition": "Cold email, apply via platforms"
      //                       }
      //                     },
      //                     {
      //                       "id": "ai_engineer_self",
      //                       "name": "AI Engineer Job (Self-Taught)",
      //                       "type": "job",
      //                       "meta": {
      //                         "description": "Apply to startups/companies",
      //                         "requirements": ["GitHub profile", "Interview prep"]
      //                       },
      //                       "edge": {
      //                         "transition": "Interview + project demo"
      //                       }
      //                     }
      //                   ]
      //                 }
      //               ]
      //             }
      //           ]
      //         }


      //       ]
      //     },
      //     {
      //       "id": "learn_programming",
      //       "name": "Learn Python & Math",
      //       "type": "skill",
      //       "meta": {
      //         "duration": "3-6 months",
      //         "resources": ["Khan Academy", "freeCodeCamp", "Python Docs"],
      //         "skills_covered": ["Variables", "Loops", "Linear Algebra", "Calculus"]
      //       },
      //       "edge": {
      //         "transition": "Start self-paced online learning"
      //       },
      //       "children": [
      //         {
      //           "id": "ml_basics",
      //           "name": "ML Basics & Projects",
      //           "type": "skill",
      //           "meta": {
      //             "duration": "3-4 months",
      //             "resources": ["Coursera ML by Andrew Ng", "Kaggle"],
      //             "skills_covered": ["Supervised Learning", "Unsupervised Learning"]
      //           },
      //           "edge": {
      //             "transition": "Complete projects and assignments"
      //           },
      //           "children": [
      //             {
      //               "id": "deep_learning",
      //               "name": "Deep Learning Specialization",
      //               "type": "skill",
      //               "meta": {
      //                 "duration": "4-6 months",
      //                 "resources": ["DeepLearning.AI", "fast.ai"],
      //                 "skills_covered": ["CNN", "RNN", "Transformer"]
      //               },
      //               "edge": {
      //                 "transition": "Hands-on projects with PyTorch/TensorFlow"
      //               },
      //               "children": [
      //                 {
      //                   "id": "portfolio_build",
      //                   "name": "AI Portfolio & GitHub",
      //                   "type": "portfolio",
      //                   "meta": {
      //                     "description": "Build a strong portfolio with 3-5 AI projects",
      //                     "platforms": ["GitHub", "Kaggle", "HuggingFace"]
      //                   },
      //                   "edge": {
      //                     "transition": "Push projects + write blogs"
      //                   },
      //                   "children": [
      //                     {
      //                       "id": "freelance_intern",
      //                       "name": "Freelance/Internship",
      //                       "type": "job",
      //                       "meta": {
      //                         "description": "Apply for real-world AI work",
      //                         "platforms": ["Upwork", "Internshala", "LinkedIn"]
      //                       },
      //                       "edge": {
      //                         "transition": "Cold email, apply via platforms"
      //                       }
      //                     },
      //                     {
      //                       "id": "ai_engineer_self",
      //                       "name": "AI Engineer Job (Self-Taught)",
      //                       "type": "job",
      //                       "meta": {
      //                         "description": "Apply to startups/companies",
      //                         "requirements": ["GitHub profile", "Interview prep"]
      //                       },
      //                       "edge": {
      //                         "transition": "Interview + project demo"
      //                       }
      //                     }
      //                   ]
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // }

      const data = {
        "id": "ai_engineering",
        "name": "AI Engineering",
        "type": "root",
        "meta": {
          "description": "Comprehensive roadmap for mastering AI Engineering"
        },
        "children": [
          {
            "id": "intro_ai",
            "name": "Introduction to AI",
            "type": "category",
            "meta": {
              "overview": "Understand the foundations of Artificial Intelligence"
            },
            "children": [
              { "id": "history", "name": "Definition and History of AI", "type": "topic" },
              { "id": "importance", "name": "Importance of AI", "type": "topic" },
              { "id": "types_ai", "name": "Types of AI", "type": "topic", "meta": { "details": "Narrow, General, Superintelligent AI" } },
              { "id": "applications", "name": "Application areas of AI", "type": "topic" },
              { "id": "future_ai", "name": "Future of AI", "type": "topic" },
              { "id": "limitations", "name": "Limitations of AI", "type": "topic" }
            ]
          },
          {
            "id": "math_ai",
            "name": "Mathematics for AI",
            "type": "category",
            "meta": { "overview": "Mathematical foundations needed for AI modeling and algorithms" },
            "children": [
              { "id": "linear_algebra", "name": "Linear Algebra", "type": "topic" },
              { "id": "calculus", "name": "Calculus", "type": "topic" },
              { "id": "probability", "name": "Probability and Statistics", "type": "topic" },
              { "id": "optimization", "name": "Optimization", "type": "topic" },
              { "id": "graph_theory", "name": "Graph Theory", "type": "topic" },
              { "id": "complex_vars", "name": "Complex Variables", "type": "topic" }
            ]
          },
          {
            "id": "programming_ai",
            "name": "Programming for AI",
            "type": "category",
            "meta": {
              "overview": "Essential programming languages and tools used in AI development"
            },
            "children": [
              { "id": "python", "name": "Python for AI", "type": "topic" },
              { "id": "java", "name": "Java for AI", "type": "topic" },
              { "id": "r", "name": "R for AI", "type": "topic" },
              { "id": "julia", "name": "Julia for AI", "type": "topic" },
              { "id": "prolog", "name": "Prolog for AI", "type": "topic" },
              { "id": "lisp", "name": "Lisp for AI", "type": "topic" }
            ]
          },
          {
            "id": "ml",
            "name": "Machine Learning",
            "type": "category",
            "meta": { "overview": "Core concepts and categories of machine learning" },
            "children": [
              { "id": "supervised", "name": "Supervised Learning", "type": "topic" },
              { "id": "unsupervised", "name": "Unsupervised Learning", "type": "topic" },
              { "id": "reinforcement_learning", "name": "Reinforcement Learning", "type": "topic" },
              { "id": "semi_supervised", "name": "Semi-Supervised Learning", "type": "topic" },
              { "id": "transfer_learning", "name": "Transfer Learning", "type": "topic" },
              { "id": "ensemble", "name": "Ensemble Learning", "type": "topic" }
            ]
          },
          {
            "id": "dl",
            "name": "Deep Learning",
            "type": "category",
            "meta": { "overview": "Neural networks and deep learning architectures" },
            "children": [
              { "id": "ann", "name": "Artificial Neural Networks", "type": "topic" },
              { "id": "cnn", "name": "Convolutional Neural Networks", "type": "topic" },
              { "id": "rnn", "name": "Recurrent Neural Networks", "type": "topic" },
              { "id": "gan", "name": "Generative Adversarial Networks", "type": "topic" },
              { "id": "deep_rl", "name": "Deep Reinforcement Learning", "type": "topic" },
              { "id": "autoencoder", "name": "Autoencoders", "type": "topic" }
            ]
          },
          {
            "id": "nlp",
            "name": "Natural Language Processing",
            "type": "category",
            "meta": { "overview": "AI techniques for processing human language" },
            "children": [
              { "id": "tokenization", "name": "Tokenization", "type": "topic" },
              { "id": "stemming", "name": "Lemmatization and Stemming", "type": "topic" },
              { "id": "syntax", "name": "Syntax and Parsing", "type": "topic" },
              { "id": "semantic", "name": "Semantic Analysis", "type": "topic" },
              { "id": "sentiment", "name": "Sentiment Analysis", "type": "topic" },
              { "id": "text_gen", "name": "Text Generation", "type": "topic" }
            ]
          },
          {
            "id": "cv",
            "name": "Computer Vision",
            "type": "category",
            "meta": { "overview": "Visual perception and understanding using AI" },
            "children": [
              { "id": "image_acquisition", "name": "Image Acquisition", "type": "topic" },
              { "id": "segmentation", "name": "Segmentation and Edge Detection", "type": "topic" },
              { "id": "feature", "name": "Feature Extraction", "type": "topic" },
              { "id": "object_recognition", "name": "Object, Face and Action Recognition", "type": "topic" },
              { "id": "reconstruction", "name": "3D Reconstruction", "type": "topic" },
              { "id": "restoration", "name": "Image Restoration", "type": "topic" }
            ]
          },
          {
            "id": "reasoning",
            "name": "Reasoning and Decision Making",
            "type": "category",
            "meta": { "overview": "AI decision logic, systems, and inference" },
            "children": [
              { "id": "rule", "name": "Rule-Based Systems", "type": "topic" },
              { "id": "decision_trees", "name": "Decision Trees", "type": "topic" },
              { "id": "bayesian", "name": "Bayesian Networks", "type": "topic" },
              { "id": "svm", "name": "Support Vector Machines", "type": "topic" },
              { "id": "fuzzy", "name": "Fuzzy Logic Systems", "type": "topic" },
              { "id": "expert", "name": "Expert Systems", "type": "topic" }
            ]
          },
          {
            "id": "robotics",
            "name": "Robotics",
            "type": "category",
            "meta": { "overview": "Mechanical and software systems integrated with AI" },
            "children": [
              { "id": "robotics_fundamentals", "name": "Fundamentals of Robotics", "type": "topic" },
              { "id": "ros", "name": "Robot Operating System (ROS)", "type": "topic" },
              { "id": "kinematics", "name": "Robot Kinematics", "type": "topic" },
              { "id": "planning", "name": "Planning and Navigation", "type": "topic" },
              { "id": "multi_robot", "name": "Multi-Robot Systems", "type": "topic" },
              { "id": "interaction", "name": "Human-Robot Interaction", "type": "topic" }
            ]
          },
          {
            "id": "ai_project_deployment",
            "name": "AI Project Deployment",
            "type": "category",
            "children": [
              { "id": "model_serving", "name": "Model Serving: TensorFlow Serving, TorchServe", "type": "topic" },
              { "id": "containerization", "name": "Containerization: Docker, Kubernetes", "type": "topic" },
              { "id": "scalability", "name": "Scalability", "type": "topic" },
              { "id": "monitoring", "name": "Monitoring and Maintenance", "type": "topic" },
              { "id": "versioning", "name": "Model Versioning", "type": "topic" },
              { "id": "api_dev", "name": "API Development", "type": "topic" }
            ]
          },
          {
            "id": "ai_ethics",
            "name": "AI Ethics and Regulations",
            "type": "category",
            "children": [
              { 
                "id": "understanding_ethics", 
                "name": "Understanding AI Ethics", 
                "type": "topic",
                "meta": {
                  "description": "Foundational concepts in AI ethics, including fairness, accountability, and transparency"
                },
                "children": [
                  { "id": "ethical_principles", "name": "Ethical Principles in AI", "type": "subtopic" },
                  { "id": "ethical_decision_making", "name": "Ethical Decision Making in AI", "type": "subtopic" },
                  { "id": "case_studies_ethics", "name": "Case Studies in AI Ethics", "type": "subtopic" }
                ]
               },
              { "id": "privacy", "name": "Privacy and AI", "type": "topic" },
              { "id": "bias", "name": "Bias and Fairness in AI", "type": "topic" },
              { "id": "regulations", "name": "Regulations: GDPR, CCPA", "type": "topic" },
              { "id": "policy", "name": "Future of AI Policy", "type": "topic" },
              { "id": "case_studies", "name": "Case Studies in AI Ethics", "type": "topic" }
            ]
          },
          {
            "id": "ai_business_society",
            "name": "AI in Business and Society",
            "type": "category",
            "children": [
              { "id": "healthcare", "name": "AI in Healthcare", "type": "topic" },
              { "id": "finance", "name": "AI in Finance", "type": "topic" },
              { "id": "transport", "name": "AI in Transportation", "type": "topic" },
              { "id": "education", "name": "AI in Education", "type": "topic" },
              { "id": "manufacturing", "name": "AI in Manufacturing", "type": "topic" },
              { "id": "entertainment", "name": "AI in Entertainment", "type": "topic" }
            ]
          },
          {
            "id": "research_in_ai",
            "name": "Research in AI",
            "type": "category",
            "children": [
              { "id": "reading_papers", "name": "Reading Research Papers", "type": "topic" },
              { "id": "writing_papers", "name": "Writing Research Papers", "type": "topic" },
              { "id": "conferences", "name": "Participating in Conferences and Journals", "type": "topic" },
              { "id": "staying_updated", "name": "Staying Up-to-date with AI Advances", "type": "topic" },
              { "id": "reproducibility", "name": "Reproducibility in AI Research", "type": "topic" },
              { "id": "open_source", "name": "Open Source Contribution", "type": "topic" }
            ]
          },
          {
            "id": "career_dev_ai",
            "name": "AI Career Development",
            "type": "category",
            "children": [
              { "id": "industry_expectations", "name": "Industry Expectations for AI Roles", "type": "topic" },
              { "id": "certifications", "name": "Obtaining Relevant AI Certifications", "type": "topic" },
              { "id": "portfolio", "name": "Building a Portfolio of AI Projects", "type": "topic" },
              { "id": "networking", "name": "Networking in the AI Field", "type": "topic" },
              { "id": "hiring_process", "name": "Understanding Hiring Process in AI", "type": "topic" },
              { "id": "continuing_edu", "name": "Continuing Education in AI", "type": "topic" }
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
