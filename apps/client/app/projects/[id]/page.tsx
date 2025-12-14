import React from "react";
import {appendFile} from "node:fs";

interface ProjectItem {
    id: number,
    media: string, // url
    title: string,
    description: string,
    project_link? : string,
    project_file? : File,
}

const ProjectItemPage = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/"); // placeholder only
    const project : ProjectItem = await res.json();
    return <main>
      <div>ProjectItemPage</div>
      <h1>project.title</h1>
      <p>project.description</p>
    </main>
}

export default ProjectItemPage;
