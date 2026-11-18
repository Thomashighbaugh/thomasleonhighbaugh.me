import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal, For, onMount } from "solid-js"
import Fuse from "fuse.js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"
import SearchBar from "@components/SearchBar"

type Props = {
  entry_name: string
  tags: string[]
  data: CollectionEntry<"blog">[] | CollectionEntry<'projects'>[]
}

export default function SearchCollection({ entry_name, data, tags }: Props) {
  const coerced = data.map((entry) => entry as CollectionEntry<'blog'>);

  const [query, setQuery] = createSignal("");
  const [filter, setFilter] = createSignal(new Set<string>())
  const [collection, setCollection] = createSignal<CollectionEntry<'blog'>[]>([])
  const [descending, setDescending] = createSignal(false);

  const fuse = new Fuse(coerced, {
    keys: ["slug", "data.title", "data.summary", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.4,
  })

  createEffect(() => {
    const filtered = (query().length < 2
      ? coerced
      : fuse.search(query()).map((result) => result.item)
    ).filter((entry) =>
      Array.from(filter()).every((value) =>
        entry.data.tags.some((tag: string) =>
          tag.toLowerCase() === String(value).toLowerCase()
        )
      )
    );
    setCollection(descending() ? filtered.toReversed() : filtered)
  })

  function toggleDescending() {
    setDescending(!descending())
  }

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(prev.has(tag)
        ? [...prev].filter((t) => t !== tag)
        : [...prev, tag]
      )
    )
  }

  function clearFilters() {
    setFilter(new Set<string>());
  }

  const onSearchInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setQuery(target.value)
  }

  onMount(() => {
    const wrapper = document.getElementById("search-collection-wrapper");
    if (wrapper) {
      wrapper.style.minHeight = "unset";
    }
    // Land on a pre-filtered view when arriving from a tag link, e.g. /blog?tag=AI
    const tagParam = new URLSearchParams(window.location.search).get("tag")
    if (tagParam) {
      const match = tags.find((t) => t.toLowerCase() === tagParam.toLowerCase())
      if (match) setFilter(new Set([match]))
    }
  })

  const isProjects = entry_name === "projects";
  
  const controlPanel = (
    <div class="col-span-4 sm:col-span-1">
      <div class="sticky top-24 mt-7">
        {/* Search Bar */}
        <SearchBar onSearchInput={onSearchInput} query={query} setQuery={setQuery} placeholderText={`Search ${entry_name}`} />
        {/* Tag Filters */}
        <div class="relative flex flex-row justify-between w-full"><p class="text-sm font-semibold uppercase my-4 text-black dark:text-white">Tags</p>
          {filter().size > 0 && (
            <button
              onClick={clearFilters}
              class="absolute flex justify-center items-center h-full w-10 right-0 top-0 stroke-black/60 dark:stroke-white/60 hover:stroke-black hover:dark:stroke-white"
            >
              <svg class="size-5">
                <use href={`/ui.svg#x`} />
              </svg>
            </button>
          )}</div>
        <div class="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 -mr-2">
          <ul class="flex flex-wrap sm:flex-col gap-1.5">
            <For each={tags}>
              {(tag) => (
                <li class="sm:w-full">
                  <button
                    onClick={() => toggleTag(tag)}
                    class={cn(
                      "w-full px-2 py-1 rounded",
                      "flex gap-2 items-center",
                      "bg-black/5 dark:bg-white/10",
                      "hover:bg-black/10 hover:dark:bg-white/15",
                      "transition-colors duration-300 ease-in-out",
                      filter().has(tag) && "text-black dark:text-white"
                    )}
                  >
                    <svg
                      class={cn(
                        "shrink-0 size-5 fill-black/50 dark:fill-white/50",
                        "transition-colors duration-300 ease-in-out",
                        filter().has(tag) && "fill-black dark:fill-white"
                      )}
                    >
                      <use
                        href={`/ui.svg#square`}
                        class={cn(!filter().has(tag) ? "block" : "hidden")}
                      />
                      <use
                        href={`/ui.svg#square-check`}
                        class={cn(filter().has(tag) ? "block" : "hidden")}
                      />
                    </svg>

                    <span class="truncate block min-w-0 pt-[2px]">
                      {tag}
                    </span>
                  </button>

                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );

  const contentPanel = (
    <div class="col-span-4 sm:col-span-3">
      <div class="flex flex-col">
        {/* Info Bar */}
        <div class='flex justify-between flex-row mb-2'>
          <div class="text-sm uppercase">
            SHOWING {collection().length} OF {data.length} {entry_name}
          </div>
          <button onClick={toggleDescending} class='flex flex-row gap-1 stroke-black/75 dark:stroke-white/75 hover:stroke-black hover:dark:stroke-white text-black/75 dark:text-white/75 hover:text-black hover:dark:text-white'>
            <div class="text-sm uppercase">
              {descending() ? "DESCENDING" : "ASCENDING"}
            </div>
            <svg
              class="size-5 left-2 top-[0.45rem]"
            >
              <use href={`/ui.svg#sort-descending`} class={descending() ? "block" : "hidden"}></use>
              <use href={`/ui.svg#sort-ascending`} class={descending() ? "hidden" : "block"}></use>
            </svg>
          </button>
        </div>
        <ul class="flex flex-col gap-3">
          {collection().map((entry) => (
            <li>
              <ArrowCard entry={entry} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
      {isProjects ? (
        <>
          {contentPanel}
          {controlPanel}
        </>
      ) : (
        <>
          {controlPanel}
          {contentPanel}
        </>
      )}
    </div>
  )
}
