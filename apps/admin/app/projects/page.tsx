"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Skill {
  id: number;
  name: string;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  desc: string;
  featured: boolean;
  skills: Skill[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    featured: false,
    skills: [] as string[],
    thumbnail_file: null as File | null, // null is typically better at expressing the user has intentionally not selected a file, as opposed to undefined which could mean it hasn't been initialised
    // thumbnail_path: "" as string,
    showcase_images_files: [] as File[],
    // showcase_images_paths: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchAvailableSkills = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/skills`);
      if (response.ok) {
        const data = await response.json();
        setAvailableSkills(data);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchProjects();
    fetchAvailableSkills();
  }, [router, fetchProjects, fetchAvailableSkills]);


  const handleSkillInputChange = (value: string) => {
    setSkillInput(value);
    if (value.trim().length > 0) {
      const filtered = availableSkills.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !formData.skills.includes(skill)
      );
      setSuggestions(filtered.slice(0, 5)); // Show top 5 matches
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmedSkill] });
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        // Use first suggestion if available
        handleAddSkill(suggestions[0]);
      } else if (skillInput.trim()) {
        // Add the typed skill
        handleAddSkill(skillInput);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = new FormData();
    projectData.append("name", formData.name);
    projectData.append("desc", formData.desc);
    projectData.append("featured", String(formData.featured));
    formData.skills.forEach((skill, index) => projectData.append(`skills[${index}]`, skill)); // brace [] may not be needed

    // Append files if available
    if (formData.thumbnail_file) {
      projectData.append("thumbnail_file", formData.thumbnail_file);
    }
    formData.showcase_images_files.forEach((file) => {
      projectData.append("showcase_images_files", file);
    });

    try {
      if (editingProject) {
        // Update existing project
        const response = await fetch(`${apiUrl}/projects/${editingProject.id}`, {
          method: "PUT",
          body: projectData, // Use FormData directly when involving file uploads
        });
        if (response.ok) {
          await fetchProjects();
          resetForm();
        }
      } else {
        // TODO: add photo uploads as part of project creation
        const response = await fetch(`${apiUrl}/projects`, {
          method: "POST",
          body: projectData,
        });
        if (response.ok) {
          await fetchProjects();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/projects/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      desc: project.desc,
      featured: project.featured,
      skills: project.skills.map((s) => s.name),
      thumbnail_file: null,
      showcase_images_files: [],
    });
    setSkillInput("");
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      desc: "",
      featured: false,
      skills: [],
      thumbnail_file: null,
      showcase_images_files: [],
    });
    setSkillInput("");
    setShowSuggestions(false);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add New Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-[42px] border border-gray-300 rounded-md bg-white">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-indigo-600 focus:outline-none"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => handleSkillInputChange(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      onFocus={() => {
                        if (skillInput.trim().length > 0 && suggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicking on them
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      placeholder={
                        formData.skills.length === 0
                          ? "Type a skill and press Enter..."
                          : ""
                      }
                      className="flex-1 min-w-[120px] outline-none border-none bg-transparent"
                    />
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddSkill(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Type a skill name and press Enter to add. Existing skills will be suggested.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add a thumbnail image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, thumbnail_file: file });
                    }
                  }}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingProject ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                {project.featured && (
                  <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{project.desc}</p>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects found. Create your first project!
          </div>
        )}
      </div>
    </div>
  );
}
