---
title: "AwesomeWM Remember Geometry"
description: "Implement window geometry memory in AwesomeWM using client.connect_signal to restore window size and position after maximizing and unmaximizing."
summary: "Learn to enhance AwesomeWM window management by implementing geometry memory that remembers window size and position when toggling between maximized states."
date: "Sep 01 2021"
draft: false
tags:
- Linux
- AwesomeWM
- Window Manager
- Lua
- Customization
---
# Optimize Window Management in AwesomeWM

![AwesomeWM window geometry](./awesome-geo.png "AwesomeWM window manager geometry configuration")

Switching between maximized and regular floating windows in AwesomeWM can sometimes disrupt your workflow, especially when you need to adjust the window size after unmaximizing it. Why not simplify this process by storing the window size and restoring it when switching back to the regular state? This guide will walk you through the process, making your AwesomeWM experience even smoother. Familiarity with AwesomeWM's Lua implementation is assumed.

## Your Path to Better Window Management

To begin, create a file in your AwesomeWM configuration directory. For most users, this directory is located at `$HOME/.config/awesome`. I've named this file `remember-geometry.lua`.

Start by requiring the necessary libraries:

```lua
local awful = require('awful')
local client = client
local tag = tag
local ipairs = ipairs
```

Next, let's create a connection signal that will fire when a window changes its state to maximized:

```lua
client.connect_signal(
    'maximize',
    function(c)
        -- Determine if it should be maximized
        local max_h = c.maximized_horizontal
        local max_v = c.maximized_vertical
        local max = (not max_h and not max_v) or not (max_h and max_v)
        c.remember_geometry.maximized_manual = max
        c.maximized_horizontal = max
        c.maximized_vertical = max
        c.maximized = max
    end
)
```

Now, it's time to create the variables when the client is first created and forget them when the window ceases to exist:

```lua
client.connect_signal(
    'manage',
    function(c)
        c.remember_geometry = {
            floating_geometry = c:geometry(),
            maximized_manual = false,
            maximized_horizontal = c.maximized_horizontal,
            maximized_vertical = c.maximized_vertical
        }
    end
)

client.connect_signal(
    'unmanage',
    function(c)
        c.remember_geometry = nil
    end
)
```

Let's ensure these variables can access your client when it's in a floating state, pass them along with the client's `remember_geometry` function and link that to your layout property:

```lua
client.connect_signal(
    'property::floating',
    function(c)
        if c.floating and c.remember_geometry then
            c:geometry(c.remember_geometry.floating_geometry)
        end
    end
)

tag.connect_signal(
    'property::layout',
    function(t)
        if t.layout == awful.layout.suit.floating then
            for k, c in ipairs(t:clients()) do
                c:geometry(c.remember_geometry.floating_geometry)
            end
        end
    end
)
```

Additionally, let's make sure the mouse can resize windows from a maximized state:

```lua
client.connect_signal(
    'request::geometry',
    function(c, context)
        if context == 'mouse.resize' and not c.fullscreen then
            c.maximized_horizontal = false
            c.maximized_vertical = false
        end
    end
)
```

The final piece of the puzzle involves defining what we mean by fullscreen within this context:

```lua
client.connect_signal(
    'property::fullscreen',
    function(c)
        if c.floating and not c.fullscreen then
            c:geometry(c.remember_geometry.floating_geometry)
            if c.remember_geometry.maximized_manual then
                c.maximized_horizontal = true
                c.maximized_vertical = true
            end
        end
    end
)
```

With this configuration, switching between maximized and floating windows in AwesomeWM behaves the way it should. Here's the complete file for reference:

```lua
local awful = require('awful')
local client = client
local tag = tag
local ipairs = ipairs

client.connect_signal(
    'maximize',
    function(c)
        local max_h = c.maximized_horizontal
        local max_v = c.maximized_vertical
        local max = (not max_h and not max_v) or not (max_h and max_v)
        c.remember_geometry.maximized_manual = max
        c.maximized_horizontal = max
        c.maximized_vertical = max
        c.maximized = max
    end
)

client.connect_signal(
    'manage',
    function(c)
        c.remember_geometry = {
            floating_geometry = c:geometry(),
            maximized_manual = false,
            maximized_horizontal = c.maximized_horizontal,
            maximized_vertical = c.maximized_vertical
        }
    end
)

client.connect_signal(
    'unmanage',
    function(c)
        c.remember_geometry = nil
    end
)

client.connect_signal(
    'property::floating',
    function(c)
        if c.floating and c.remember_geometry then
            c:geometry(c.remember_geometry.floating_geometry)
        end
    end
)

tag.connect_signal(
    'property::layout',
    function(t)
        if t.layout == awful.layout.suit.floating then
            for k, c in ipairs(t:clients()) do
                c:geometry(c.remember_geometry.floating_geometry)
            end
        end
    end
)

client.connect_signal(
    'request::geometry',
    function(c, context)
        if context == 'mouse.resize' and not c.fullscreen then
            c.maximized_horizontal = false
            c.maximized_vertical = false
        end
    end
)

client.connect_signal(
    'property::fullscreen',
    function(c)
        if c.floating and not c.fullscreen then
            c:geometry(c.remember_geometry.floating_geometry)
            if c.remember_geometry.maximized_manual then
                c.maximized_horizontal = true
                c.maximized_vertical = true
            end
        end
    end
)
```

*Want to enhance your AwesomeWM setup further? Learn about [window geometry memory](/blog/remember-geometry-awesomewm) or discover the [Vice color scheme](/blog/vice-color-scheme) for a complete desktop transformation.*

Happy customizing!
















































































































































































































































































































