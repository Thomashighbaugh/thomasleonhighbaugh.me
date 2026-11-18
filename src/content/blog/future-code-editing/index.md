---
title: "Transitioning to NeoVim"
description: "My journey from VS Code to NeoVim: why modal editing with Lua configuration offers better ergonomics, performance, and customization for developers."
summary: "Discover why transitioning from VS Code to NeoVim transformed my coding workflow, offering superior ergonomics, performance, and customization through modal editing."
date: "Dec 15 2022"
draft: false
tags:
- NeoVim
- Linux
- Code Editor
- Lua
- Development Tools
---
# Transitioning to NeoVim

![NeoVim editor](./neovim.png "NeoVim text editor logo and interface")

## The Future of Code Editing for Me

In the fast-evolving world of code editors, it's crucial to stay ahead of the curve. Recently, I embarked on a transformative journey in my coding practice – transitioning from Visual Studio Code (VS Code) to NeoVim. This shift from a conventional text editor to a modal one has been nothing short of a revelation, redefining the way I interact with my code and, consequently, my productivity.

## The Quest for Efficiency

As developers, our primary goal is to write clean and efficient code. To achieve this, our choice of code editor plays a pivotal role. As a long-time user of VS Code, I was content with my workflow, but I couldn't help but notice that certain repetitive tasks and code navigation could be optimized further.

Modal code editors like NeoVim offer a unique solution. By separating insert mode from normal mode, they provide a more ergonomic and efficient way to interact with code. This design philosophy encourages developers to keep their hands on the keyboard, minimizing the need to reach for the mouse and improving overall coding speed.

## Low Overhead

NeoVim has an incredibly low system overhead profile compared to VSCode, itself a lot less demanding than WebStorm which I had been using prior to it. Running from within the terminal, where I spend a lot of time regardless and prefer my system terminal emulator to an integrated one for the vast majority of tasks involving development tasks and general system interaction. Using `kitty` to fire up NeoVim takes milliseconds of time, literally, whereas VSCode has a start up process and then subsequent async calls to update plugins, etc.

Keeping a low resource profile also means I can use my same coding environment almost anywhere and expect identical functionality. I just have to pull in my GitHub repo that houses the configuration and then go through the initial boot during which the package manager runs through the configured plugins, installs them and then I am exactly where I want to be on basically any x86-64 or aarm system I have tried without any appreciable lag or resorting to a more limited or streamlined system.

## Lazy Package Manager

A big game changer that has eased my transition has been that I have been thoroughly impressed with the speed and relative ease of configuring NeoVim after moving from Packer to Lazy as the default package manager for NeoVim. Lazy is significantly faster in installing the plugins I have configured, uses relatively easy to write plugin configurations as the means of even determining the plugins to pull and does not make the code editor run sluggishly, which has been a huge improvement and made using NeoVim more like using a well-configured emacs distribution.

## The Power of NeoVim

Among the various modal code editors, NeoVim stands out for several compelling reasons. Firstly, NeoVim uses Lua as its extensibility language, and that is what won me over. As someone already familiar with Lua through my experience with AwesomeWM, I found NeoVim's scripting environment to be intuitive and robust. This familiarity enabled me to customize and extend NeoVim to fit my exact needs seamlessly.

The Lua integration in NeoVim opens the door to a world of possibilities. I harnessed this power to create custom plugins, keybindings, and even automate repetitive tasks within my code editor. Whether it's building a specific workflow or crafting an entirely personalized environment, NeoVim's Lua integration empowers users to mold their coding experience to perfection.

## A Versatile Ecosystem

One of the many advantages of transitioning to NeoVim is its extensive plugin ecosystem. NeoVim users have access to an array of community-driven plugins, each designed to streamline specific aspects of the coding process. From Git integrations to code linting, NeoVim's plugin ecosystem provides a versatile toolkit for enhancing your development workflow.

Personalizing your NeoVim environment is a breeze, thanks to the countless plugins available. Whether you're focused on web development, data science, or machine learning, you'll find plugins that cater to your needs. It's this flexibility and adaptability that makes NeoVim a top choice for developers of various backgrounds and preferences.

## A Smooth Transition

Adopting a new code editor can be a daunting process, but transitioning to NeoVim was surprisingly smooth. With a bit of patience and a willingness to learn, I was able to rewire my muscle memory and adapt to the modal editing style. NeoVim's extensive documentation, vibrant community, and readily available resources make the learning curve less steep.

One crucial aspect of the transition was the ability to import my existing VS Code snippets into NeoVim. This made the process less jarring and allowed me to leverage my existing snippets in such a way as to have at hand the same code blocks and skeleton functions I expect, which is a real bonus in terms of quality of life and keeping the temptation to fire up VSCode at bay.

## That's All Folks

In the ever-evolving landscape of code editors, NeoVim represents the future. Its focus on modality, extensibility through Lua, and rich plugin ecosystem have redefined my coding experience. I've found a new sense of productivity and efficiency in my daily development tasks.

If you're considering a shift to a modal code editor, NeoVim is a compelling choice. Its powerful combination of efficiency and extensibility, paired with an inclusive and vibrant community, makes it a worthwhile investment in your coding journey. For those ready to dive deeper, check out our guide on [installing the latest NeoVim](/blog/neovim-lua) to get started with bleeding-edge features.

Embrace the future of code editing – make the switch to NeoVim and unlock your true coding potential. Happy coding!

*This is just the beginning of my NeoVim journey, and I'm excited to see where it takes me next!*
