---
title: "Portfolio Refresh"
description: "Complete portfolio website redesign featuring modern web technologies, improved accessibility, glassmorphism design, and GitHub API integration."
summary: "Discover the redesign process of my portfolio website, featuring modern CSS techniques, enhanced accessibility, and dynamic project showcasing via GitHub API."
date: "Jan 30 2023"
draft: false
tags:
- Web Development
- Portfolio
- CSS
- Accessibility
- GitHub API
---
![Portfolio refresh banner](./banner_portfolio.png "Updated portfolio website design showcase")

I rebuilt my portfolio site. The goals were simple: make it look right, keep it accessible, and use current CSS instead of working around it. That meant CSS Grid and Flexbox for layout, and one responsive design rather than a desktop page squeezed down to a phone. Visual polish matters, but a site nobody can navigate is a poster, not a portfolio.

## Shaping My Vision

My journey led me to the site you're currently browsing. In the following sections, I'll delve into some of the new features I've introduced and the motivations behind this design transformation.

### Embracing a New Navigation Paradigm

Many websites traditionally rely on headers and footers for navigation. While this suits most scrolling-based content, it can be tricky when you're dealing with a landing page adorned with SVG graphics, like this one. So, I opted for a different approach—dropdown menus activated by two buttons strategically placed at either end of the header. This approach streamlines navigation and offers a comprehensive menu while maintaining a visually appealing, responsive, mobile-first design. This means that users get a consistent navigation experience across devices of all screen sizes.

### Farewell to Footers

Most websites have footers to house social links and other supplementary information. However, I recently developed a dedicated "link in bio" style social landing page inspired by platforms like [Link Tree](https://linktr.ee/). As a result, a link in the navigation menu renders the footer redundant. This decision declutters the site, leveraging the effort I've invested in streamlining it.

### Enhancing Navigation Accessibility

To ensure an inclusive experience, I've made the navigation buttons keyboard-accessible. This accessibility improvement empowers users who can't rely on a mouse for navigation. With a simple press of the <kbd>Tab</kbd> key, users can navigate through the interface, thanks to a distinct highlight outline indicating the active element. Pressing <kbd>Enter</kbd> then selects the highlighted item. While testing with keyboard-focused browsers like [qutebrowser](https://qutebrowser.org/) and [luakit](https://luakit.github.io/) is pending, this functionality works seamlessly with standard browsers. (Pro tip for Firefox users: Enable `caret browsing` in [about:preferences](about:preferences) for a similar experience throughout the browser window.)

### Incorporating the Latest Design Trends

The website's visual appeal extends to embracing contemporary design trends. While neumorphism may pose accessibility challenges, I've adopted the related design approach known as `glassmorphism` to add a touch of style to the site's elements, such as menus and content boxes. These elements now feature outlined borders and controlled transparency, thoughtfully designed to enhance aesthetics without compromising readability.

### New SVG Background

A fresh background banner from [Pattern Monster](https://pattern.monster/) has replaced the previous one sourced from [Hero Patterns](heropatterns.com/). This change injects a refreshing visual twist to the site. The SVG pattern was effortlessly integrated into the `background:` CSS attribute, seamlessly adapting to both light and dark modes while preserving its original appeal.

### Unleashing the GitHub API

Leveraging the GitHub API proved instrumental in showcasing my coding projects on the portfolio website. By tapping into the GitHub API, I gained access to vital information about my repositories, such as names, descriptions, and URLs, which I artfully presented on my website. The result? A visually striking portfolio of my coding skills, customizable with filters, sorting options, and pagination. Visitors can now explore my projects efficiently, elevating their interactive experience. This approach underscores my commitment to my craft, highlighting my coding prowess for all to see.

#### Rethinking the Projects Section

Integrating the GitHub API allows me to display real-time information about my latest projects, offering a comprehensive overview of my coding skills and expertise. Visitors can delve into detailed project information, including names, descriptions, and repository links. This approach keeps my portfolio perpetually up-to-date, automatically incorporating new projects and retiring old ones. This dynamic feature not only showcases my software development skills and accomplishments but also makes a compelling impression on potential employers and clients.

### Code Base Refactoring

Optimizing my portfolio website's code, I've introduced a structured `src` directory with subdirectories for components, data, layouts, lib, pages, and types. This reorganization declutters the repository's top level, making it more organized and manageable. This compartmentalization strategy aids in better codebase navigation, offering an enhanced development experience. The `components` directory houses reusable React components, while the `data` directory contains data files and configurations. Layout components reside in the `layouts` directory, and utility functions and third-party libraries find their place in the `lib` directory. The `pages` directory is dedicated to Next.js pages, while the `types` directory holds TypeScript type definitions. This structure fosters modularity, streamlining collaboration with other developers and enhancing productivity.

### Preact for Production Builds

Switching to Preact, a lightweight alternative to React, has proven beneficial in Next.js websites. Preact's compact size translates to faster page loading times, improving overall website performance. Preact's efficient rendering process, powered by a virtual DOM that updates only what's necessary, ensures swift rendering and a seamless user experience. Better yet, Preact's compatibility with React's API simplifies the transition, allowing developers to maintain familiar programming patterns while enjoying Preact's performance enhancements. All in all, Preact enhances Next.js website performance, facilitating the creation of swift and efficient web applications.

Incorporate these strategies and trends into your web development journey and witness your portfolio website reach new heights. Stay innovative, embrace accessibility, and craft a visually stunning and highly functional web presence.

*For insights into modern development approaches, explore how [switching to Astro](/blog/switching-to-astro) can simplify your build process, or learn about [designing better interfaces](/blog/designing-interfaces) for enhanced user experiences.*
