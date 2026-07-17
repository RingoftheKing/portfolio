// a file for all types related to Projects

type Skill = {
    id: number,
    name: string,
    projectId: number,
}

// you can extend this into things like ProjectCard etc.
export interface Project {
    id: number,
    title: string,
    desc: string,
    thumbnail_img: string, // url
    showcase_imgs: string[],
    skills?: Skill[],
    featured?: boolean, // affects if this item is displayed in the carousel (always present in admin view)
}