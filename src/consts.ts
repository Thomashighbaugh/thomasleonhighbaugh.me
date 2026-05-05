import type { Site, Page, Links } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Thomas Leon Highbaugh",
  DESCRIPTION: "Welcome to Thomas Leon Highbaugh, a portfolio and blog for designers and developers.",
  AUTHOR: "Thomas Leon Highbaugh",
}



// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "About", 
    HREF: "/about", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
  { 
    TEXT: "Resume", 
    HREF: "https://resume.thomasleonhighbaugh.me", 
  },
  { 
    TEXT: "Links", 
    HREF: "https://links.thomasleonhighbaugh.me", 
  },
]

// Socials — all links are at the central links page
export const SOCIALS_LINKS_HREF = "https://links.thomasleonhighbaugh.me"

