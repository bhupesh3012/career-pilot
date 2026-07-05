import { GoogleGenAI } from "@google/genai";
import { InterviewQuestion, InterviewEvaluation } from "../types";

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

/**
 * Service to generate target role-based interview questions and evaluate practice answers.
 */
export async function generateInterviewQuestions(
  targetRole: string,
  experienceLevel: string = "Mid-Level"
): Promise<InterviewQuestion[]> {
  try {
    const response = await fetch("/api/interview/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetRole, experienceLevel }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to generate interview questions");
    }

    const data = await response.json();
    return data.questions || [];
  } catch (err: any) {
    console.error("Failed to generate questions, falling back to offline templates:", err);
    return getOfflineQuestions(targetRole);
  }
}

export async function evaluatePracticeAnswer(
  question: string,
  answer: string,
  targetRole: string
): Promise<InterviewEvaluation> {
  const response = await fetch("/api/interview/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, answer, targetRole }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || "Evaluation failed. Please verify your GEMINI_API_KEY in the Secrets panel.");
  }

  return await response.json();
}

/**
 * Generates an interactive set of MCQ questions for the candidate.
 * Safely initializes using VITE_GEMINI_API_KEY and falls back gracefully to a high-fidelity local generator.
 */
export async function generateInterviewMCQs(
  targetRole: string,
  experienceLevel: string,
  totalQuestions: number = 5
): Promise<MCQQuestion[]> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

  // 1. Try direct client-side Gemini call if VITE_GEMINI_API_KEY is configured
  if (apiKey && apiKey.trim() !== "" && !apiKey.includes("YOUR_API_KEY")) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the CareerPilot AI Technical Interviewer. Your task is to generate an interactive set of ${totalQuestions} unique, highly relevant technical multiple-choice questions (MCQs) for a candidate interviewing for a [${targetRole}] role at a [${experienceLevel}] level. 
CRITICAL: The complexity, depth, and domain coverage must perfectly adjust to the selected level. Beginner should evaluate core syntax/concepts. Advanced must test system design, edge cases, caching, concurrency, and architecture patterns. Each question must have exactly 4 options and a single explicitly verified correct answer string. Return only raw, valid JSON matching the schema without introductory text.`;

      const userPrompt = `Generate exactly ${totalQuestions} unique multiple choice questions with 4 options each, a single correct answer (which must match one of the options word-for-word), and an explanation.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Fast structured response
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "INTEGER" },
                question: { type: "STRING" },
                options: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                correctAnswer: { type: "STRING" },
                explanation: { type: "STRING" }
              },
              required: ["id", "question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const responseText = response.text || "";
      if (responseText.trim()) {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as MCQQuestion[];
        }
      }
    } catch (clientErr: any) {
      console.warn("Client-side Gemini MCQ generation failed or was throttled. Trying backend endpoint:", clientErr.message || clientErr);
    }
  }

  // 2. Try the backend route if available
  try {
    const response = await fetch("/api/interview/mcqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRole, experienceLevel, totalQuestions })
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as MCQQuestion[];
      }
    }
  } catch (err) {
    console.warn("Backend MCQ fetch failed. Using local premium fallback generator:", err);
  }

  // 3. Fallback: High-Fidelity Local Question Generator to ensure 100% uptime
  return getLocalMCQFallback(targetRole, experienceLevel, totalQuestions);
}

/**
 * Local Fallback MCQ Generator for premium user experience when offline or keys aren't ready
 */
function getLocalMCQFallback(role: string, level: string, count: number): MCQQuestion[] {
  const lower = role.toLowerCase();
  let library: Omit<MCQQuestion, "id">[] = [];

  if (lower.includes("front") || lower.includes("react") || lower.includes("ui") || lower.includes("web")) {
    if (level === "Beginner") {
      library = [
        {
          question: "Which hook is used to perform side effects in functional React components?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          correctAnswer: "useEffect",
          explanation: "useEffect is the standard Hook for executing side-effects, subscriptions, or manual DOM adjustments in functional React components."
        },
        {
          question: "What is the correct way to pass a numeric value as a prop in React JSX?",
          options: ["score=42", "score='42'", "score={42}", "score=[42]"],
          correctAnswer: "score={42}",
          explanation: "Curly braces {} are required to pass non-string values like numbers, arrays, objects, or booleans in React JSX attributes."
        },
        {
          question: "What does the 'key' prop do in React list rendering?",
          options: [
            "It uniquely identifies element items to optimize reconciliation and state preservation.",
            "It automatically styles list elements using flex layouts.",
            "It serves as a password for nested child data grids.",
            "It locks child component rendering to avoid state leaks."
          ],
          correctAnswer: "It uniquely identifies element items to optimize reconciliation and state preservation.",
          explanation: "Keys help React identify which items have changed, been added, or been removed, maintaining component state correctly."
        },
        {
          question: "Which CSS display property is default for a standard <div> tag?",
          options: ["flex", "inline-block", "block", "inline"],
          correctAnswer: "block",
          explanation: "The default display value for a standard HTML div element is 'block', which stretches to fill its parent container."
        },
        {
          question: "What is the purpose of the 'alt' attribute on an <img> tag?",
          options: [
            "It overrides the width and height of the image.",
            "It provides an alternative text description for screen readers and search engines.",
            "It applies an alternative high-pass visual filter to the media source.",
            "It lists secondary backup images to load if the original breaks."
          ],
          correctAnswer: "It provides an alternative text description for screen readers and search engines.",
          explanation: "The alt attribute is critical for web accessibility, allowing screen readers and browser errors to represent the image via descriptive text."
        }
      ];
    } else if (level === "Advanced") {
      library = [
        {
          question: "In React 18 Concurrent Mode, what is the purpose of the 'useTransition' hook?",
          options: [
            "It configures sliding visual transitions for canvas elements.",
            "It lets components defer low-priority state updates to prevent blocking UI interactivity.",
            "It acts as a fallback handler for server components rendering failures.",
            "It serializes React state variables for persistent local cache syncing."
          ],
          correctAnswer: "It lets components defer low-priority state updates to prevent blocking UI interactivity.",
          explanation: "useTransition allows state updates to be marked as transitions, letting React prioritize high-priority user actions like typing over heavy rendering updates."
        },
        {
          question: "Which optimization technique prevents parent state modifications from triggering child re-renders without layout updates?",
          options: ["React.memo encapsulation", "CSS containment scoping", "Strict component lazy loading", "Global context bundling"],
          correctAnswer: "React.memo encapsulation",
          explanation: "React.memo is a higher-order component that shallowly compares props, preventing a component from re-rendering if its input props remain identical."
        },
        {
          question: "What is Cumulative Layout Shift (CLS) in Google Core Web Vitals?",
          options: [
            "The sum of all latency variables in server API gateways.",
            "A measurement of unexpected layout movement of visual elements during page loads.",
            "The maximum stack size allocated to web socket pipelines.",
            "An optimization metric tracking lazy load package downloads."
          ],
          correctAnswer: "A measurement of unexpected layout movement of visual elements during page loads.",
          explanation: "CLS measures the visual stability of a page by auditing how often elements shift unexpectedly, disrupting the user's focus."
        },
        {
          question: "How can you safely prevent a memory leak in a React Hook using custom websocket streams?",
          options: [
            "Return a clean-up function within the hook's useEffect to disconnect the stream.",
            "Utilize the useMemo hook to cache the stream connection permanently.",
            "Enforce strict client-side CORS rate limiting constraints.",
            "Force window.reload on every socket disconnect event."
          ],
          correctAnswer: "Return a clean-up function within the hook's useEffect to disconnect the stream.",
          explanation: "Clean-up functions inside useEffect run before the component unmounts and before re-running the effect, allowing you to tear down persistent connections."
        },
        {
          question: "Why should you avoid object destructuring or inline array definitions directly inside a useEffect dependency array?",
          options: [
            "Because objects and arrays have referential identity checks, triggering infinite re-render loops on each render cycle.",
            "Because it throws a fatal compile-time syntax crash in standard Vite configurations.",
            "Because React completely ignores complex objects in the diffing array.",
            "Because inline structures bypass browser garbage collection metrics."
          ],
          correctAnswer: "Because objects and arrays have referential identity checks, triggering infinite re-render loops on each render cycle.",
          explanation: "In JavaScript, {} !== {} and [] !== []. React performs a shallow referential comparison on effect dependencies; thus, new objects recreate on every render, triggering the effect repeatedly."
        }
      ];
    } else {
      // Intermediate Frontend
      library = [
        {
          question: "What does useMemo return compared to useCallback?",
          options: [
            "useMemo returns a memoized value; useCallback returns a memoized function callback.",
            "useMemo triggers server rendering; useCallback handles interactive UI animations.",
            "useMemo manages local state; useCallback maps global configurations.",
            "useMemo is synchronous; useCallback is asynchronous."
          ],
          correctAnswer: "useMemo returns a memoized value; useCallback returns a memoized function callback.",
          explanation: "useMemo caches the result of a calculation between renders, while useCallback caches the function definition itself."
        },
        {
          question: "Which Tailwind CSS class is used to establish a flexbox layout with column orientation?",
          options: ["flex flex-col", "flex-direction-col", "display-col", "flex-grid-col"],
          correctAnswer: "flex flex-col",
          explanation: "'flex flex-col' configures a flexible layout oriented vertically using flexbox."
        },
        {
          question: "In standard React router networks, how do you extract route parameter variables (e.g., /user/:id)?",
          options: ["useParams() hook", "useLocation() query mapping", "window.location.search matching", "useRouteMatch() configuration"],
          correctAnswer: "useParams() hook",
          explanation: "The useParams Hook returns an object of key/value pairs of URL parameters from the current route."
        },
        {
          question: "What is the primary benefit of React dynamic lazy loading (React.lazy)?",
          options: [
            "It decreases initial bundle download size by dynamically splitting imports.",
            "It automatically optimizes images to fit mobile viewports.",
            "It guarantees that server-rendered code never runs on client-side browsers.",
            "It speeds up database write queries in backend controllers."
          ],
          correctAnswer: "It decreases initial bundle download size by dynamically splitting imports.",
          explanation: "React.lazy helps dynamically split code into separate chunks, loading them only when the component is actively rendered to speed up page loads."
        },
        {
          question: "How do you handle error boundaries in modern React applications?",
          options: [
            "Using React class components implementing componentDidCatch or getDerivedStateFromError.",
            "Using a simple try/catch around the JSX render statement.",
            "Wrapping the component in a standard useReducer dispatcher.",
            "Enforcing strict TypeScript validation flags on all props."
          ],
          correctAnswer: "Using React class components implementing componentDidCatch or getDerivedStateFromError.",
          explanation: "Currently, Error Boundaries must be written as Class Components as there is no hook equivalent for componentDidCatch."
        }
      ];
    }
  } else if (lower.includes("back") || lower.includes("node") || lower.includes("api") || lower.includes("system") || lower.includes("database")) {
    if (level === "Beginner") {
      library = [
        {
          question: "Which Node.js core module is used to read and write files on the file system?",
          options: ["fs", "path", "http", "os"],
          correctAnswer: "fs",
          explanation: "The 'fs' (File System) module provides APIs for interacting with the file system in a standard Node.js runtime environment."
        },
        {
          question: "What does the 404 HTTP status code represent?",
          options: ["Internal Server Error", "Resource Not Found", "Unauthorized Credentials Access", "Bad Request payload"],
          correctAnswer: "Resource Not Found",
          explanation: "HTTP 404 indicates that the server cannot locate the requested resource or URL."
        },
        {
          question: "Which database type is characterized by structured table schemas and relational integrity constraints?",
          options: ["Relational (SQL)", "Document-oriented (NoSQL)", "Graph Database", "Key-Value Store"],
          correctAnswer: "Relational (SQL)",
          explanation: "Relational (SQL) databases organize data into rigid tables, enforcing ACID properties and foreign key relationships."
        },
        {
          question: "What is the purpose of CORS in API configurations?",
          options: [
            "To regulate which external origins/domains can request resource assets from your server.",
            "To encrypt data packets being streamed through websocket portals.",
            "To split heavy database columns into partition slices.",
            "To rate-limit incoming DDoS attack volumes."
          ],
          correctAnswer: "To regulate which external origins/domains can request resource assets from your server.",
          explanation: "Cross-Origin Resource Sharing (CORS) is a security mechanism enforced by browsers to prevent scripts on arbitrary domains from accessing your API without permission."
        },
        {
          question: "What is the difference between POST and PUT requests?",
          options: [
            "POST is typically used to create a new resource, whereas PUT is idempotent and used to replace or create.",
            "POST is completely synchronous, whereas PUT is asynchronous.",
            "POST is for client configurations; PUT is for database connections.",
            "POST cannot send request bodies; PUT requires them."
          ],
          correctAnswer: "POST is typically used to create a new resource, whereas PUT is idempotent and used to replace or create.",
          explanation: "POST creates resources and is non-idempotent; PUT replaces a resource fully or creates it, yielding identical states across multiple calls (idempotence)."
        }
      ];
    } else if (level === "Advanced") {
      library = [
        {
          question: "How would you prevent database locking bottlenecks during a flash sale with extremely high concurrent balance updates?",
          options: [
            "Implement Optimistic Concurrency Control using version tracking columns to skip pessimistic locks.",
            "Enforce strict client-side form debouncers to restrict request streams.",
            "Set the database transaction level to READ UNCOMMITTED permanently.",
            "Upgrade your API gateway to block duplicate TCP connection handshakes."
          ],
          correctAnswer: "Implement Optimistic Concurrency Control using version tracking columns to skip pessimistic locks.",
          explanation: "Optimistic locking avoids database-level row locks, allowing high concurrent reads. Updates check if another process changed the version. If not, the edit commits; otherwise, it handles retries gracefully."
        },
        {
          question: "In Node.js, how does the Libuv thread pool handle asynchronous non-blocking I/O operations?",
          options: [
            "Libuv delegates network sockets to the OS kernel, while using a fixed set of background worker threads for heavy tasks like cryptography or disk I/O.",
            "Libuv launches a fresh, independent Node.js process thread for every single client connection.",
            "Libuv forces JavaScript execution to run on multi-core clusters synchronously.",
            "Libuv stores incoming requests inside a high-performance in-memory Redis cluster."
          ],
          correctAnswer: "Libuv delegates network sockets to the OS kernel, while using a fixed set of background worker threads for heavy tasks like cryptography or disk I/O.",
          explanation: "The OS kernel handles network events asynchronously via native polling (epoll/kqueue). Libuv uses its thread pool (default 4 threads) to run non-network async tasks like file system access and crypto libraries."
        },
        {
          question: "What is the purpose of the Saga Pattern in microservices micro-architecture?",
          options: [
            "To guarantee eventual consistency across multiple isolated databases through sequential transaction steps.",
            "To consolidate all microservice assets into a single monolithic deployment unit.",
            "To compress GraphQL payloads using specialized binary converters.",
            "To prevent API rate limiters from exhausting token capacities."
          ],
          correctAnswer: "To guarantee eventual consistency across multiple isolated databases through sequential transaction steps.",
          explanation: "The Saga Pattern manages distributed transactions across multiple microservices using a sequence of local transactions, triggering compensating transactions if any step fails."
        },
        {
          question: "Why would you choose Connection Pooling in SQL database adapters?",
          options: [
            "To reuse a hot cache of pre-established database connections, avoiding high TCP handshaking and thread overhead on each API request.",
            "To automatically replicate write requests to peripheral read nodes.",
            "To compress database query results before sending them over the wire.",
            "To encrypt tabular database records in compliance with HIPAA frameworks."
          ],
          correctAnswer: "To reuse a hot cache of pre-established database connections, avoiding high TCP handshaking and thread overhead on each API request.",
          explanation: "Establishing database connections is computationally expensive. Pooling keeps active connections open for reuse, improving API response times and preventing DB exhaustion."
        },
        {
          question: "Which indexing approach is best for accelerating full-text pattern searches in PostgreSQL?",
          options: ["GIN (Generalized Inverted Index) indexing", "Standard B-Tree indexing", "Sparse linear indexing", "Hash-based pointer indexing"],
          correctAnswer: "GIN (Generalized Inverted Index) indexing",
          explanation: "GIN is specifically designed for split arrays, documents, and complex full-text search configurations, whereas B-Tree indexers excel at simple comparison operators (<, =, >)."
        }
      ];
    } else {
      // Intermediate Backend
      library = [
        {
          question: "What is the primary difference between standard SQL indexing and full-table scans?",
          options: [
            "An index is a lookup data structure (typically a B-Tree) that avoids scanning every row in the database table.",
            "Full table scans are always faster since they read disk sectors sequentially.",
            "Indexes copy the entire table into RAM, whereas full scans run strictly on disk storage.",
            "Full scans require write locks; indexes are read-only structures."
          ],
          correctAnswer: "An index is a lookup data structure (typically a B-Tree) that avoids scanning every row in the database table.",
          explanation: "Indexes act as directories, letting the database lookup specific records instantly in O(log N) operations rather than inspecting each row one-by-one."
        },
        {
          question: "Which middleware is typically used to enable JSON parse capabilities in modern Express.js endpoints?",
          options: ["express.json()", "bodyParser.text()", "express.urlencoded()", "express.static()"],
          correctAnswer: "express.json()",
          explanation: "express.json() is the built-in middleware in Express that parses incoming request payloads containing JSON strings, populating req.body."
        },
        {
          question: "What does the 'idempotent' property mean in the context of REST API endpoints?",
          options: [
            "Making identical API requests multiple times yields the same server state and response effect.",
            "The endpoint only accepts authenticated request profiles.",
            "The client cannot issue simultaneous requests to the controller.",
            "The response is guaranteed to compress file payloads below 1KB."
          ],
          correctAnswer: "Making identical API requests multiple times yields the same server state and response effect.",
          explanation: "An API operation is idempotent if its side-effects on the server are the same whether it is executed once or multiple times (e.g., GET, PUT, DELETE)."
        },
        {
          question: "What is the purpose of JWT (JSON Web Token) in authorization frameworks?",
          options: [
            "To securely encode authorization payload claims in a stateless, digitally signed package.",
            "To encrypt database fields containing credit cards and user credentials.",
            "To compress large image attachments being transmitted to static hosts.",
            "To manage sliding rate limit intervals on gateway nodes."
          ],
          correctAnswer: "To securely encode authorization payload claims in a stateless, digitally signed package.",
          explanation: "JWTs provide a stateless way for servers to verify client claims securely without querying a session database on every incoming request."
        },
        {
          question: "How do you handle unhandled promise rejections in Node.js processes?",
          options: [
            "Listen to the 'unhandledRejection' event on the global process object and handle the logging/cleanups.",
            "Force catch statements on all system calls in package.json configurations.",
            "Wrap the main server execution inside a standard recursive try/catch loop.",
            "Node.js handles rejections automatically by routing them to process.exit(0)."
          ],
          correctAnswer: "Listen to the 'unhandledRejection' event on the global process object and handle the logging/cleanups.",
          explanation: "By listening to 'unhandledRejection' via process.on('unhandledRejection', (reason, promise) => {}), developers can log critical async crashes and safely cycle server containers."
        }
      ];
    }
  } else {
    // General Technical
    library = [
      {
        question: "What is the time complexity of searching for an item in a balanced Binary Search Tree (BST)?",
        options: ["O(N)", "O(1)", "O(log N)", "O(N log N)"],
        correctAnswer: "O(log N)",
        explanation: "In a balanced Binary Search Tree, search operations split the key space in half at each node step, resulting in logarithmic time complexity."
      },
      {
        question: "What does the SOLID acronym stand for in object-oriented system designs?",
        options: [
          "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
          "Structured Organization, Linear Integration, Object Isolation, Direct Injection, Schema Safety",
          "Synchronous Operations, Log Isolation, Inheritance Delegation, Static Delivery, Optimal Runtime",
          "State Preservation, Object Mapping, Light Interface, Defensive Validation, Error Boundary"
        ],
        correctAnswer: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
        explanation: "SOLID represents five critical design guidelines formulated to make software systems cleaner, highly flexible, and simpler to maintain."
      },
      {
        question: "What is the purpose of a Docker multi-stage build?",
        options: [
          "To reduce production container image size by stripping build dependencies and only copying compiled assets.",
          "To run multiple containers simultaneously within a single server host.",
          "To distribute container images to multiple registries synchronously.",
          "To parallelize unit testing suites across virtual architectures."
        ],
        correctAnswer: "To reduce production container image size by stripping build dependencies and only copying compiled assets.",
        explanation: "Multi-stage builds use intermediate containers to compile assets, then copy only the production-ready binaries into a pristine base image, keeping the final size minimal."
      },
      {
        question: "Which protocol operates on top of TCP to provide secure, encrypted browser communication?",
        options: ["HTTP", "HTTPS", "FTP", "DNS"],
        correctAnswer: "HTTPS",
        explanation: "HTTPS encrypts communications over TCP using Transport Layer Security (TLS), preventing eavesdropping and data tempering."
      },
      {
        question: "What is a dead-letter queue (DLQ) in queue-based architectures?",
        options: [
          "A storage queue for message payloads that failed to process successfully after multiple retry attempts.",
          "A secondary cache for inactive, old user profile states.",
          "An administrative server routing deleted data store records.",
          "An endpoint collecting expired rate-limiting tokens."
        ],
        correctAnswer: "A storage queue for message payloads that failed to process successfully after multiple retry attempts.",
        explanation: "DLQs isolate problematic or broken messages so that engineers can debug processing errors without blocking the general workflow pipeline."
      }
    ];
  }

  // Shuffle and pick desired count
  const shuffled = [...library].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item, idx) => ({
    id: idx + 1,
    ...item
  }));
}

/**
 * High-quality fallback templates if backend/API is offline or key is unconfigured.
 */
function getOfflineQuestions(role: string): InterviewQuestion[] {
  const lower = role.toLowerCase();
  
  if (lower.includes("frontend") || lower.includes("react") || lower.includes("ui") || lower.includes("web")) {
    return [
      {
        id: "fq-1",
        question: "Explain the difference between virtual DOM and shadow DOM in React, and when you would use each.",
        category: "Technical",
        difficulty: "Medium",
        suggestedStructure: "Define Virtual DOM vs Shadow DOM, mention real-world browser usage, explain reconciliation.",
        hint: "Virtual DOM is a lightweight React-specific abstraction; Shadow DOM is a browser-native technology for custom elements scoping."
      },
      {
        id: "fq-2",
        question: "How do you optimize state rendering performance in deep React component trees? Detail techniques like memoization and state colocation.",
        category: "Technical",
        difficulty: "Hard",
        suggestedStructure: "Identify root causes of re-renders, discuss React.memo, useMemo, state colocation, context splitting.",
        hint: "Mention profiling tools, avoiding unnecessary parent state changes, and pushing state down where possible."
      },
      {
        id: "fq-3",
        question: "Describe a time when you had to make a compromise between design/user-experience and performance or engineering timelines. How did you negotiate and deliver?",
        category: "Behavioral",
        difficulty: "Medium",
        suggestedStructure: "Use STAR (Situation, Task, Action, Result) format, emphasize communication and compromise.",
        hint: "Focus on how you measured performance, proposed iterative milestones, and aligned with stakeholders."
      },
      {
        id: "fq-4",
        question: "Design a high-performance infinite scroll component that fetches paginated API responses. What edge cases must you handle?",
        category: "System Design",
        difficulty: "Hard",
        suggestedStructure: "IntersectionObserver vs Scroll Listener, list virtualization, DOM recycling, debouncing, and offline caching.",
        hint: "Be sure to handle fast scrolling, errors, network retries, and cleanups to avoid memory leaks."
      }
    ];
  }

  return [
    {
      id: "gq-1",
      question: "Explain the difference between optimistic concurrency control and pessimistic locking, and when to choose which.",
      category: "Technical",
      difficulty: "Medium",
      suggestedStructure: "Define both locking modes, weigh write conflicts rate, describe latency and rollback implications.",
      hint: "Use optimistic locking for low-collision, high-throughput environments; use pessimistic locking for high-collision environments like financial transactions."
    }
  ];
}
