import { Link, Route, Routes } from "react-router-dom";
import { projects } from "./projects/registry.js";
import { buttonGhost, card, heading, subtle } from "./shared/ui.js";

function Index() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className={heading}>React Fundamentals</h1>
      <p className={`${subtle} mt-2`}>
        JSX, props, state, lists, controlled forms and conditional rendering &mdash; one
        small project per concept.
      </p>

      <ul className="mt-8 space-y-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/${project.slug}`}
              className={`${card} block transition hover:border-slate-400`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-slate-900">{project.name}</span>
                <span className={subtle}>{project.difficulty}</span>
              </div>
              <p className={`${subtle} mt-1`}>{project.teaches.join(" · ")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectShell({ project }) {
  const { Component } = project;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/" className={buttonGhost}>
        &larr; All projects
      </Link>
      <h1 className={`${heading} mt-6`}>{project.name}</h1>
      <p className={`${subtle} mt-1`}>{project.teaches.join(" · ")}</p>
      <div className="mt-8">
        <Component />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Index />} />
        {projects.map((project) => (
          <Route
            key={project.slug}
            path={`/${project.slug}`}
            element={<ProjectShell project={project} />}
          />
        ))}
      </Routes>
    </div>
  );
}
