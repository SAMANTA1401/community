

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

      // const data = {
      //   "id": "ai_engineering",
      //   "name": "AI Engineering",
      //   "type": "root",
      //   "meta": {
      //     "description": "Comprehensive roadmap for mastering AI Engineering"
      //   },
      //   "children": [
      //     {
      //       "id": "intro_ai",
      //       "name": "Introduction to AI",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Understand the foundations of Artificial Intelligence"
      //       },
      //       "children": [
      //         { "id": "history", "name": "Definition and History of AI", "type": "topic" },
      //         { "id": "importance", "name": "Importance of AI", "type": "topic" },
      //         { "id": "types_ai", "name": "Types of AI", "type": "topic", "meta": { "details": "Narrow, General, Superintelligent AI" } },
      //         { "id": "applications", "name": "Application areas of AI", "type": "topic" },
      //         { "id": "future_ai", "name": "Future of AI", "type": "topic" },
      //         { "id": "limitations", "name": "Limitations of AI", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "math_ai",
      //       "name": "Mathematics for AI",
      //       "type": "category",
      //       "meta": { "overview": "Mathematical foundations needed for AI modeling and algorithms" },
      //       "children": [
      //         { "id": "linear_algebra", "name": "Linear Algebra", "type": "topic" },
      //         { "id": "calculus", "name": "Calculus", "type": "topic" },
      //         { "id": "probability", "name": "Probability and Statistics", "type": "topic" },
      //         { "id": "optimization", "name": "Optimization", "type": "topic" },
      //         { "id": "graph_theory", "name": "Graph Theory", "type": "topic" },
      //         { "id": "complex_vars", "name": "Complex Variables", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "programming_ai",
      //       "name": "Programming for AI",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Essential programming languages and tools used in AI development"
      //       },
      //       "children": [
      //         { "id": "python", "name": "Python for AI", "type": "topic" },
      //         { "id": "java", "name": "Java for AI", "type": "topic" },
      //         { "id": "r", "name": "R for AI", "type": "topic" },
      //         { "id": "julia", "name": "Julia for AI", "type": "topic" },
      //         { "id": "prolog", "name": "Prolog for AI", "type": "topic" },
      //         { "id": "lisp", "name": "Lisp for AI", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "ml",
      //       "name": "Machine Learning",
      //       "type": "category",
      //       "meta": { "overview": "Core concepts and categories of machine learning" },
      //       "children": [
      //         { "id": "supervised", "name": "Supervised Learning", "type": "topic" },
      //         { "id": "unsupervised", "name": "Unsupervised Learning", "type": "topic" },
      //         { "id": "reinforcement_learning", "name": "Reinforcement Learning", "type": "topic" },
      //         { "id": "semi_supervised", "name": "Semi-Supervised Learning", "type": "topic" },
      //         { "id": "transfer_learning", "name": "Transfer Learning", "type": "topic" },
      //         { "id": "ensemble", "name": "Ensemble Learning", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "dl",
      //       "name": "Deep Learning",
      //       "type": "category",
      //       "meta": { "overview": "Neural networks and deep learning architectures" },
      //       "children": [
      //         { "id": "ann", "name": "Artificial Neural Networks", "type": "topic" },
      //         { "id": "cnn", "name": "Convolutional Neural Networks", "type": "topic" },
      //         { "id": "rnn", "name": "Recurrent Neural Networks", "type": "topic" },
      //         { "id": "gan", "name": "Generative Adversarial Networks", "type": "topic" },
      //         { "id": "deep_rl", "name": "Deep Reinforcement Learning", "type": "topic" },
      //         { "id": "autoencoder", "name": "Autoencoders", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "nlp",
      //       "name": "Natural Language Processing",
      //       "type": "category",
      //       "meta": { "overview": "AI techniques for processing human language" },
      //       "children": [
      //         { "id": "tokenization", "name": "Tokenization", "type": "topic" },
      //         { "id": "stemming", "name": "Lemmatization and Stemming", "type": "topic" },
      //         { "id": "syntax", "name": "Syntax and Parsing", "type": "topic" },
      //         { "id": "semantic", "name": "Semantic Analysis", "type": "topic" },
      //         { "id": "sentiment", "name": "Sentiment Analysis", "type": "topic" },
      //         { "id": "text_gen", "name": "Text Generation", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "cv",
      //       "name": "Computer Vision",
      //       "type": "category",
      //       "meta": { "overview": "Visual perception and understanding using AI" },
      //       "children": [
      //         { "id": "image_acquisition", "name": "Image Acquisition", "type": "topic" },
      //         { "id": "segmentation", "name": "Segmentation and Edge Detection", "type": "topic" },
      //         { "id": "feature", "name": "Feature Extraction", "type": "topic" },
      //         { "id": "object_recognition", "name": "Object, Face and Action Recognition", "type": "topic" },
      //         { "id": "reconstruction", "name": "3D Reconstruction", "type": "topic" },
      //         { "id": "restoration", "name": "Image Restoration", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "reasoning",
      //       "name": "Reasoning and Decision Making",
      //       "type": "category",
      //       "meta": { "overview": "AI decision logic, systems, and inference" },
      //       "children": [
      //         { "id": "rule", "name": "Rule-Based Systems", "type": "topic" },
      //         { "id": "decision_trees", "name": "Decision Trees", "type": "topic" },
      //         { "id": "bayesian", "name": "Bayesian Networks", "type": "topic" },
      //         { "id": "svm", "name": "Support Vector Machines", "type": "topic" },
      //         { "id": "fuzzy", "name": "Fuzzy Logic Systems", "type": "topic" },
      //         { "id": "expert", "name": "Expert Systems", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "robotics",
      //       "name": "Robotics",
      //       "type": "category",
      //       "meta": { "overview": "Mechanical and software systems integrated with AI" },
      //       "children": [
      //         { "id": "robotics_fundamentals", "name": "Fundamentals of Robotics", "type": "topic" },
      //         { "id": "ros", "name": "Robot Operating System (ROS)", "type": "topic" },
      //         { "id": "kinematics", "name": "Robot Kinematics", "type": "topic" },
      //         { "id": "planning", "name": "Planning and Navigation", "type": "topic" },
      //         { "id": "multi_robot", "name": "Multi-Robot Systems", "type": "topic" },
      //         { "id": "interaction", "name": "Human-Robot Interaction", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "ai_project_deployment",
      //       "name": "AI Project Deployment",
      //       "type": "category",
      //       "children": [
      //         { "id": "model_serving", "name": "Model Serving: TensorFlow Serving, TorchServe", "type": "topic" },
      //         { "id": "containerization", "name": "Containerization: Docker, Kubernetes", "type": "topic" },
      //         { "id": "scalability", "name": "Scalability", "type": "topic" },
      //         { "id": "monitoring", "name": "Monitoring and Maintenance", "type": "topic" },
      //         { "id": "versioning", "name": "Model Versioning", "type": "topic" },
      //         { "id": "api_dev", "name": "API Development", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "ai_ethics",
      //       "name": "AI Ethics and Regulations",
      //       "type": "category",
      //       "children": [
      //         { 
      //           "id": "understanding_ethics", 
      //           "name": "Understanding AI Ethics", 
      //           "type": "topic",
      //           "meta": {
      //             "description": "Foundational concepts in AI ethics, including fairness, accountability, and transparency"
      //           },
      //           "children": [
      //             { "id": "ethical_principles", "name": "Ethical Principles in AI", "type": "subtopic" },
      //             { "id": "ethical_decision_making", "name": "Ethical Decision Making in AI", "type": "subtopic" },
      //             { "id": "case_studies_ethics", "name": "Case Studies in AI Ethics", "type": "subtopic" }
      //           ]
      //          },
      //         { "id": "privacy", "name": "Privacy and AI", "type": "topic" },
      //         { "id": "bias", "name": "Bias and Fairness in AI", "type": "topic" },
      //         { "id": "regulations", "name": "Regulations: GDPR, CCPA", "type": "topic" },
      //         { "id": "policy", "name": "Future of AI Policy", "type": "topic" },
      //         { "id": "case_studies", "name": "Case Studies in AI Ethics", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "ai_business_society",
      //       "name": "AI in Business and Society",
      //       "type": "category",
      //       "children": [
      //         { "id": "healthcare", "name": "AI in Healthcare", "type": "topic" },
      //         { "id": "finance", "name": "AI in Finance", "type": "topic" },
      //         { "id": "transport", "name": "AI in Transportation", "type": "topic" },
      //         { "id": "education", "name": "AI in Education", "type": "topic" },
      //         { "id": "manufacturing", "name": "AI in Manufacturing", "type": "topic" },
      //         { "id": "entertainment", "name": "AI in Entertainment", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "research_in_ai",
      //       "name": "Research in AI",
      //       "type": "category",
      //       "children": [
      //         { "id": "reading_papers", "name": "Reading Research Papers", "type": "topic" },
      //         { "id": "writing_papers", "name": "Writing Research Papers", "type": "topic" },
      //         { "id": "conferences", "name": "Participating in Conferences and Journals", "type": "topic" },
      //         { "id": "staying_updated", "name": "Staying Up-to-date with AI Advances", "type": "topic" },
      //         { "id": "reproducibility", "name": "Reproducibility in AI Research", "type": "topic" },
      //         { "id": "open_source", "name": "Open Source Contribution", "type": "topic" }
      //       ]
      //     },
      //     {
      //       "id": "career_dev_ai",
      //       "name": "AI Career Development",
      //       "type": "category",
      //       "children": [
      //         { "id": "industry_expectations", "name": "Industry Expectations for AI Roles", "type": "topic" },
      //         { "id": "certifications", "name": "Obtaining Relevant AI Certifications", "type": "topic" },
      //         { "id": "portfolio", "name": "Building a Portfolio of AI Projects", "type": "topic" },
      //         { "id": "networking", "name": "Networking in the AI Field", "type": "topic" },
      //         { "id": "hiring_process", "name": "Understanding Hiring Process in AI", "type": "topic" },
      //         { "id": "continuing_edu", "name": "Continuing Education in AI", "type": "topic" }
      //       ]
      //     }

      //   ]
      // }

      // const data = {
      //   "id": "data_science",
      //   "name": "Data Science",
      //   "type": "root",
      //   "meta": {
      //     "description": "Comprehensive roadmap for mastering Data Science, tailored for an undergraduate student aiming for a job-ready proficiency."
      //   },
      //   "children": [
      //     {
      //       "id": "foundational_math_stats",
      //       "name": "Foundational Mathematics and Statistics",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Establish a strong foundation in the mathematical and statistical concepts essential for data science."
      //       },
      //       "children": [
      //         {
      //           "id": "linear_algebra",
      //           "name": "Linear Algebra",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Vectors, matrices, matrix operations, eigenvalues, eigenvectors, singular value decomposition (SVD)."
      //           }
      //         },
      //         {
      //           "id": "calculus",
      //           "name": "Calculus",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Derivatives, integrals, optimization, gradient descent."
      //           }
      //         },
      //         {
      //           "id": "probability_theory",
      //           "name": "Probability Theory",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Basic probability, conditional probability, Bayes' theorem, probability distributions."
      //           }
      //         },
      //         {
      //           "id": "statistical_inference",
      //           "name": "Statistical Inference",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Hypothesis testing, confidence intervals, p-values."
      //           }
      //         },
      //         {
      //           "id": "descriptive_statistics",
      //           "name": "Descriptive Statistics",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Measures of central tendency, measures of dispersion, data visualization."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "programming_fundamentals",
      //       "name": "Programming Fundamentals (Python)",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Learn the fundamentals of programming using Python, the primary language for data science."
      //       },
      //       "children": [
      //         {
      //           "id": "python_basics",
      //           "name": "Python Basics",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Data types, variables, operators, control flow (if/else, loops)."  
      //           }
      //         },
      //         {
      //           "id": "data_structures",
      //           "name": "Data Structures",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Lists, dictionaries, tuples, sets."
      //           }
      //         },
      //         {
      //           "id": "functions_modules",
      //           "name": "Functions and Modules",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Defining functions, using built-in modules, creating custom modules."
      //           }
      //         },
      //         {
      //           "id": "object_oriented_programming",
      //           "name": "Object-Oriented Programming (OOP)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Classes, objects, inheritance, polymorphism."
      //           }
      //         },
      //         {
      //           "id": "error_handling",
      //           "name": "Error Handling",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Try-except blocks, exception handling."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "data_manipulation_analysis",
      //       "name": "Data Manipulation and Analysis with Pandas",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Master the Pandas library for data manipulation, cleaning, and analysis."
      //       },
      //       "children": [
      //         {
      //           "id": "pandas_dataframes",
      //           "name": "Pandas DataFrames",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating, reading, writing, and manipulating DataFrames."
      //           }
      //         },
      //         {
      //           "id": "data_cleaning",
      //           "name": "Data Cleaning",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Handling missing values, duplicate data, and inconsistent data."   
      //           }
      //         },
      //         {
      //           "id": "data_transformation",
      //           "name": "Data Transformation",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Filtering, sorting, grouping, and aggregating data."
      //           }
      //         },
      //         {
      //           "id": "data_analysis",
      //           "name": "Data Analysis",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Calculating descriptive statistics, correlation analysis, and creating pivot tables."
      //           }
      //         },
      //         {
      //           "id": "data_visualization_pandas",
      //           "name": "Data Visualization with Pandas",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating basic plots (histograms, scatter plots, bar plots) directly from Pandas DataFrames."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "data_visualization",
      //       "name": "Data Visualization with Matplotlib and Seaborn",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Learn to create compelling and informative visualizations using Matplotlib and Seaborn."
      //       },
      //       "children": [
      //         {
      //           "id": "matplotlib_basics",
      //           "name": "Matplotlib Basics",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating basic plots, customizing plots, and working with subplots."
      //           }
      //         },
      //         {
      //           "id": "seaborn_basics",
      //           "name": "Seaborn Basics",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating statistical plots, customizing plots, and using Seaborn's built-in themes."
      //           }
      //         },
      //         {
      //           "id": "advanced_visualizations",
      //           "name": "Advanced Visualizations",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating complex plots, interactive visualizations, and using different chart types effectively."
      //           }
      //         },
      //         {
      //           "id": "visualization_principles",
      //           "name": "Visualization Principles",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Understanding best practices for data visualization, storytelling with data, and avoiding common pitfalls."
      //           }
      //         },
      //         {
      //           "id": "plotly_dash",
      //           "name": "Introduction to Plotly and Dash (Interactive Visualizations)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating interactive web-based visualizations and dashboards."     
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "machine_learning_fundamentals",
      //       "name": "Machine Learning Fundamentals",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Understand the core concepts and algorithms of machine learning."     
      //       },
      //       "children": [
      //         {
      //           "id": "supervised_learning",
      //           "name": "Supervised Learning",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Regression, classification, model evaluation metrics."
      //           }
      //         },
      //         {
      //           "id": "unsupervised_learning",
      //           "name": "Unsupervised Learning",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Clustering, dimensionality reduction, anomaly detection."
      //           }
      //         },
      //         {
      //           "id": "model_selection",
      //           "name": "Model Selection and Evaluation",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Cross-validation, hyperparameter tuning, bias-variance tradeoff."  
      //           }
      //         },
      //         {
      //           "id": "scikit_learn",
      //           "name": "Introduction to Scikit-learn",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using Scikit-learn for model training, evaluation, and deployment."
      //           }
      //         },
      //         {
      //           "id": "feature_engineering",
      //           "name": "Feature Engineering",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Techniques for creating and selecting features to improve model performance."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "deep_learning_basics",
      //       "name": "Deep Learning Basics",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Introduction to neural networks and deep learning concepts."
      //       },
      //       "children": [
      //         {
      //           "id": "neural_networks",
      //           "name": "Neural Networks Fundamentals",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Perceptrons, multi-layer perceptrons, activation functions."       
      //           }
      //         },
      //         {
      //           "id": "backpropagation",
      //           "name": "Backpropagation Algorithm",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Understanding how neural networks learn."
      //           }
      //         },
      //         {
      //           "id": "tensorflow_keras",
      //           "name": "Introduction to TensorFlow and Keras",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Building and training neural networks with TensorFlow and Keras."  
      //           }
      //         },
      //         {
      //           "id": "cnn",
      //           "name": "Convolutional Neural Networks (CNNs)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Image classification with CNNs."
      //           }
      //         },
      //         {
      //           "id": "rnn",
      //           "name": "Recurrent Neural Networks (RNNs)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Sequence modeling with RNNs."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "databases_sql",
      //       "name": "Databases and SQL",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Learn how to interact with databases using SQL."
      //       },
      //       "children": [
      //         {
      //           "id": "sql_basics",
      //           "name": "SQL Basics",
      //           "type": "topic",
      //           "meta": {
      //             "details": "SELECT, FROM, WHERE, ORDER BY, GROUP BY."
      //           }
      //         },
      //         {
      //           "id": "joins",
      //           "name": "Joins",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Inner join, left join, right join, full outer join."
      //           }
      //         },
      //         {
      //           "id": "subqueries",
      //           "name": "Subqueries",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using subqueries to filter and aggregate data."
      //           }
      //         },
      //         {
      //           "id": "database_design",
      //           "name": "Introduction to Database Design",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Normalization, entity-relationship diagrams (ERDs)."
      //           }
      //         },
      //         {
      //           "id": "nosql_intro",
      //           "name": "Introduction to NoSQL Databases (MongoDB)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Basic concepts of NoSQL and MongoDB."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "cloud_computing",
      //       "name": "Cloud Computing for Data Science (AWS/Azure/GCP)",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Explore cloud computing platforms and their services relevant to data science."
      //       },
      //       "children": [
      //         {
      //           "id": "aws_basics",
      //           "name": "AWS Basics (S3, EC2)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using S3 for data storage and EC2 for compute resources."
      //           }
      //         },
      //         {
      //           "id": "azure_basics",
      //           "name": "Azure Basics (Blob Storage, Virtual Machines)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using Blob Storage for data storage and Virtual Machines for compute resources."
      //           }
      //         },
      //         {
      //           "id": "gcp_basics",
      //           "name": "GCP Basics (Cloud Storage, Compute Engine)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using Cloud Storage for data storage and Compute Engine for compute resources."
      //           }
      //         },
      //         {
      //           "id": "cloud_data_processing",
      //           "name": "Cloud-based Data Processing (Spark on AWS/Azure/GCP)",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using cloud services for large-scale data processing."
      //           }
      //         },
      //         {
      //           "id": "machine_learning_services",
      //           "name": "Cloud Machine Learning Services (SageMaker, Azure ML, Vertex AI)",      
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using cloud-based machine learning platforms."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "big_data_processing",
      //       "name": "Big Data Processing with Spark",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Learn how to process and analyze large datasets using Apache Spark."  
      //       },
      //       "children": [
      //         {
      //           "id": "spark_basics",
      //           "name": "Spark Basics",
      //           "type": "topic",
      //           "meta": {
      //             "details": "RDDs, DataFrames, Spark SQL."
      //           }
      //         },
      //         {
      //           "id": "spark_mlib",
      //           "name": "Spark MLlib",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using Spark MLlib for machine learning tasks."
      //           }
      //         },
      //         {
      //           "id": "spark_streaming",
      //           "name": "Spark Streaming",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Processing real-time data streams with Spark Streaming."
      //           }
      //         },
      //         {
      //           "id": "data_engineering_spark",
      //           "name": "Data Engineering with Spark",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Using Spark for ETL pipelines."
      //           }
      //         },
      //         {
      //           "id": "spark_performance",
      //           "name": "Spark Performance Tuning",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Optimizing Spark applications for performance."
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       "id": "data_science_project",
      //       "name": "Data Science Project and Portfolio Building",
      //       "type": "category",
      //       "meta": {
      //         "overview": "Apply your knowledge to real-world data science projects and build a portfolio to showcase your skills."
      //       },
      //       "children": [
      //         {
      //           "id": "project_selection",
      //           "name": "Project Selection",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Choosing projects that align with your interests and career goals."
      //           }
      //         },
      //         {
      //           "id": "data_collection",
      //           "name": "Data Collection and Preparation",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Gathering data from various sources and preparing it for analysis."
      //           }
      //         },
      //         {
      //           "id": "data_analysis_project",
      //           "name": "Data Analysis and Modeling",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Applying data analysis techniques and building machine learning models."
      //           }
      //         },
      //         {
      //           "id": "project_documentation",
      //           "name": "Project Documentation and Presentation",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Writing clear and concise documentation and presenting your findings effectively."
      //           }
      //         },
      //         {
      //           "id": "portfolio_building",
      //           "name": "Portfolio Building",
      //           "type": "topic",
      //           "meta": {
      //             "details": "Creating a professional portfolio to showcase your projects."      
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // }

      const data = {
        "id": "data_science",
        "name": "Data Science",
        "type": "root",
        "meta": {
          "description": "Comprehensive degree-based roadmap for becoming a Data Scientist, starting from graduation."
        },
        "children": [
          {
            "id": "bachelors_degree",
            "name": "Bachelor’s Degree (if not already obtained)",
            "type": "degree",
            "meta": {
              "overview": "A strong foundation in mathematics, statistics, and computer science is crucial for data science. This stage is skipped if already obtained.",
              "duration": "4 years (if needed)",
              "prerequisites": "High school diploma or equivalent"
            },
            "children": [
              {
                "id": "core_courses_bachelors",
                "name": "Core Coursework",
                "type": "component",
                "meta": {
                  "details": "Calculus, Linear Algebra, Statistics, Probability, Data Structures, Algorithms, Programming (Python, R), Database Management",
                  "importance": "Provides the fundamental mathematical and computational skills required for data analysis and modeling."
                }
              },
              {
                "id": "elective_courses_bachelors",
                "name": "Elective Courses",
                "type": "component",
                "meta": {
                  "details": "Machine Learning (introductory), Data Mining, Optimization, Statistical Modeling, Cloud Computing (introductory)",
                  "importance": "Expands knowledge in specific areas of data science and allows for specialization."
                }
              },
              {
                "id": "research_opportunities_bachelors",
                "name": "Research Opportunities",
                "type": "component",
                "meta": {
                  "details": "Participate in research projects with professors or research groups focusing on data analysis, machine learning, or related fields.",
                  "importance": "Provides hands-on experience in applying theoretical knowledge to real-world problems."
                }
              },
              {
                "id": "internships_bachelors",
                "name": "Internship Opportunities",
                "type": "component",
                "meta": {
                  "details": "Seek internships in companies or organizations that utilize data science techniques. Look for roles such as data analyst intern or machine learning intern.", 
                  "importance": "Provides practical experience in a professional setting and allows for networking with industry professionals."
                }
              }
            ]
          },
          {
            "id": "masters_degree",
            "name": "Master's Degree in Data Science or Related Field",
            "type": "degree",
            "meta": {
              "overview": "A Master's degree provides advanced knowledge and specialized skills in data science.",
              "duration": "1-2 years",
              "prerequisites": "Bachelor's degree in a related field, strong academic record, GRE scores (optional)"
            },
            "children": [
              {
                "id": "core_courses_masters",
                "name": "Core Coursework",
                "type": "component",
                "meta": {
                  "details": "Advanced Machine Learning, Deep Learning, Statistical Inference, Data Visualization, Big Data Analytics, Data Mining, Natural Language Processing",
                  "importance": "Provides in-depth knowledge and advanced skills in various data science techniques."
                }
              },
              {
                "id": "specialization_masters",
                "name": "Specialization",
                "type": "component",
                "meta": {
                  "details": "Choose a specialization area such as machine learning, deep learning, natural language processing, or data engineering based on your interests and career goals.",
                  "importance": "Allows for focused development of expertise in a specific area of data science."
                }
              },
              {
                "id": "capstone_project",
                "name": "Capstone Project",
                "type": "component",
                "meta": {
                  "details": "Complete a capstone project that involves applying data science techniques to solve a real-world problem. This project often involves working with a company or organization.",
                  "importance": "Provides hands-on experience in applying data science skills to a complex problem and demonstrates your abilities to potential employers."
                }
              },
              {
                "id": "networking_masters",
                "name": "Networking Opportunities",
                "type": "component",
                "meta": {
                  "details": "Attend industry conferences, workshops, and meetups to network with data science professionals and learn about the latest trends and technologies.",
                  "importance": "Provides opportunities to connect with industry professionals, learn about job opportunities, and stay up-to-date on the latest trends."
                }
              }
            ]
          },
          {
            "id": "online_courses_and_certifications",
            "name": "Online Courses and Certifications",
            "type": "degree",
            "meta": {
              "overview": "Supplement formal education with online courses and certifications to enhance specific skills and demonstrate expertise.",
              "duration": "Ongoing",
              "prerequisites": "Varies depending on the course or certification"
            },
            "children": [
              {
                "id": "platform_courses",
                "name": "Platform-Specific Courses",
                "type": "component",
                "meta": {
                  "details": "Complete courses on platforms like Coursera, edX, Udacity, and DataCamp in areas such as machine learning, deep learning, data visualization, and big data analytics. Target courses with hands-on projects.",
                  "importance": "Provides flexible learning opportunities and allows for focused development of specific skills."
                }
              },
              {
                "id": "certification_programs",
                "name": "Certification Programs",
                "type": "component",
                "meta": {
                  "details": "Obtain certifications from reputable organizations such as Google, Microsoft, and AWS in areas such as cloud computing, machine learning, and data analytics. Examples: Google Cloud Certified Professional Data Engineer, Microsoft Certified: Azure Data Scientist Associate, AWS Certified Machine Learning – Specialty",
                  "importance": "Demonstrates expertise in specific technologies and enhances your credibility with potential employers."
                }
              },
              {
                "id": "kaggle_competitions",
                "name": "Kaggle Competitions",
                "type": "component",
                "meta": {
                  "details": "Participate in Kaggle competitions to gain experience in solving real-world data science problems and showcase your skills to potential employers.",
                  "importance": "Provides practical experience in applying data science techniques to complex problems and demonstrates your ability to work under pressure."
                }
              }
            ]
          },
          {
            "id": "job_search_and_interview_prep",
            "name": "Job Search and Interview Preparation",
            "type": "degree",
            "meta": {
              "overview": "Prepare for the job search process by building a strong resume, networking with industry professionals, and practicing your interview skills.",
              "duration": "Ongoing",
              "prerequisites": "Completion of relevant education and skills development"
            },
            "children": [
              {
                "id": "resume_building",
                "name": "Resume Building",
                "type": "component",
                "meta": {
                  "details": "Create a resume that highlights your skills, experience, and projects. Tailor your resume to each job application to emphasize the skills and experience that are most relevant to the specific role. Highlight projects and contributions using the STAR method (Situation, Task, Action, Result).",
                  "importance": "A well-crafted resume is essential for attracting the attention of potential employers."
                }
              },
              {
                "id": "portfolio_development",
                "name": "Portfolio Development",
                "type": "component",
                "meta": {
                  "details": "Create a portfolio of data science projects that demonstrates your skills and abilities. Include projects from your coursework, capstone project, and Kaggle competitions. Host the portfolio on GitHub or a personal website.",
                  "importance": "A portfolio provides concrete evidence of your skills and abilities and allows potential employers to see your work."
                }
              },
              {
                "id": "interview_preparation",
                "name": "Interview Preparation",
                "type": "component",
                "meta": {
                  "details": "Practice answering common data science interview questions, including technical questions on machine learning, statistics, and programming. Also, practice behavioral questions to demonstrate your soft skills. Participate in mock interviews with mentors or career counselors.",
                  "importance": "Effective interview skills are essential for landing a data science job."
                }
              },
              {
                "id": "job_applications",
                "name": "Job Applications",
                "type": "component",
                "meta": {
                  "details": "Apply for data science positions through online job boards, company websites, and networking contacts. Tailor your application to each specific role and highlight your relevant skills and experience.",
                  "importance": "Applying for jobs is the first step towards landing a data science job."
                }
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
