# 🌐 Browser History Manager – DSA Project

> A fully functional browser history simulation built with vanilla JavaScript, demonstrating real-world applications of **Stack**, **Doubly Linked List**, and **HashMap** data structures.

---

## 📋 Project Overview

The **Browser History Manager** is an interactive web application that replicates core browser navigation behaviour — visiting pages, navigating back and forward, searching history, and viewing visit statistics — entirely powered by hand-coded DSA implementations with no libraries or frameworks.

The project was built to demonstrate how the data structures taught in a DSA course map directly to production software. Every click of the Back/Forward button, every instant search result, and every history entry is handled by one of the three custom classes written from scratch in `script.js`.

---

## 👨‍💻 Student Information

| Field      | Details                        |
|------------|-------------------------------|
| **Name**   | Shivam Kumar                  |
| **Course** | B.Tech Computer Science       |
| **Subject**| Data Structures & Algorithms  |
| **Year**   | 2026                          |

---

## 🚀 Live Demo

No server, no build step — just open the file:

```
1. Navigate to the DSA_Project folder
2. Double-click  index.html
3. The app opens in your default browser immediately
```

> **Tip:** The application auto-populates 8 realistic sample history entries on first launch so you can explore all features right away. Your data persists between sessions via `localStorage`.

---

## 📁 Project Structure

```
DSA_Project/
├── index.html      – Application shell and static structure
├── style.css       – Complete styling with dark/light theme support
├── script.js       – All DSA implementations + application logic
└── README.md       – Project documentation (this file)
```

Each file has a single responsibility:

| File         | Responsibility                                              |
|--------------|-------------------------------------------------------------|
| `index.html` | Semantic HTML layout, section scaffolding, DOM hook points  |
| `style.css`  | CSS custom properties, dark/light theming, responsive layout|
| `script.js`  | DSA classes, app state, event handlers, render functions    |
| `README.md`  | Documentation, complexity analysis, presentation notes      |

---

## ✨ Features

- 🔙 **Back Navigation** — LIFO stack pops the previous page and pushes current to forward stack
- 🔜 **Forward Navigation** — mirrors back navigation in reverse; cleared on new visit
- 🌍 **Visit Any URL** — normalises input (adds `https://` if missing), tracks visit counts
- 🔍 **Instant Search** — O(1) average HashMap lookup filters history as you type
- 📊 **Dashboard** — live stats: total visits, unique URLs, back/forward stack sizes, current page
- 📜 **Full History List** — chronological view with timestamps and per-entry delete
- 📦 **Stack Visualiser** — real-time animated view of back and forward stacks
- 🗂️ **URL Index** — HashMap contents displayed as a frequency/visit table
- ℹ️ **About / Complexity** — in-app complexity reference table for all operations
- 🌙 **Dark / Light Theme** — toggle with one click, preference saved to `localStorage`
- 💾 **Persistent Storage** — full state serialised to `localStorage` on every action
- 🗑️ **Delete Entries** — remove individual history items or wipe all history at once
- 📱 **Responsive Design** — works on desktop, tablet, and mobile viewports

---

## 🏗️ DSA Implementations

### 1. Stack

A **Stack** follows the **Last-In, First-Out (LIFO)** principle. Two stack instances power all browser-style navigation.

#### Class Signature

```js
class Stack {
  constructor(name) {
    this.items = [];   // internal array storage
    this.name  = name; // label for visualisation
  }

  push(item)   { this.items.push(item); }          // add to top
  pop()        { return this.items.pop(); }         // remove from top
  peek()       { return this.items[this.items.length - 1]; } // read top
  isEmpty()    { return this.items.length === 0; }
  size()       { return this.items.length; }
  clear()      { this.items = []; }
  toArray()    { return [...this.items]; }          // snapshot for localStorage
}
```

#### How It's Used

| Instance        | Purpose                                                   |
|-----------------|-----------------------------------------------------------|
| `backStack`     | Holds pages you can navigate *back* to                    |
| `forwardStack`  | Holds pages you can navigate *forward* to (cleared on new visit) |

#### Time Complexities

| Operation | Time     | Notes                        |
|-----------|----------|------------------------------|
| `push`    | O(1)     | Array `push` is amortised O(1)|
| `pop`     | O(1)     | Array `pop` is O(1)          |
| `peek`    | O(1)     | Index access                 |
| `isEmpty` | O(1)     | Length check                 |
| `size`    | O(1)     | Length property              |
| `clear`   | O(1)     | Reference replacement        |

---

### 2. Doubly Linked List

A **Doubly Linked List** maintains the full, ordered browsing history. Each node holds the page data plus pointers to both the previous and next nodes, enabling O(1) insertion and O(n) traversal in either direction.

#### Node Class

```js
class Node {
  constructor(data) {
    this.data = data;   // { url, title, timestamp }
    this.prev = null;   // pointer to previous node
    this.next = null;   // pointer to next node
  }
}
```

#### DoublyLinkedList Class

```js
class DoublyLinkedList {
  constructor() {
    this.head    = null;  // first node
    this.tail    = null;  // last node
    this.current = null;  // active page node
    this.length  = 0;
  }

  insertAtEnd(data)          { /* O(1) – uses tail pointer */ }
  deleteNode(node)           { /* O(1) – rewires prev/next pointers */ }
  traverseForward()          { /* O(n) – returns array of data objects */ }
  traverseBackward()         { /* O(n) – returns array in reverse */ }
  findNode(url)              { /* O(n) – linear scan by url */ }
  clear()                    { /* O(1) – nulls head, tail, current */ }
}
```

#### How It's Used

Every call to `visitPage()` appends a new `Node` at the tail — O(1). The `current` pointer tracks which node represents the active page. Deleting an entry rewires two pointers, also O(1), without shifting any elements.

#### Time Complexities

| Operation          | Time  | Notes                              |
|--------------------|-------|------------------------------------|
| `insertAtEnd`      | O(1)  | Direct tail pointer update         |
| `deleteNode`       | O(1)  | Pointer rewiring only              |
| `traverseForward`  | O(n)  | Visits every node once             |
| `traverseBackward` | O(n)  | Visits every node once             |
| `findNode`         | O(n)  | Linear scan (worst case)           |
| `clear`            | O(1)  | Reference nulling                  |

---

### 3. HashMap

A **HashMap** (hash table) with **separate chaining** provides O(1) average-case URL lookup, duplicate detection, and visit-count tracking.

#### Class Signature

```js
class HashMap {
  constructor(size = 53) {
    this.table = new Array(size); // 53 buckets (prime → better distribution)
    this.count = 0;
  }

  _hash(key) {
    // Polynomial rolling hash
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      total = (total * PRIME + key.charCodeAt(i)) % this.table.length;
    }
    return total;
  }

  set(key, value)  { /* insert/update with chaining */ }
  get(key)         { /* O(1) avg – hash then scan bucket */ }
  has(key)         { /* O(1) avg – boolean existence check */ }
  delete(key)      { /* O(1) avg – splice from bucket array */ }
  clear()          { /* O(1) – reset table reference */ }
  size()           { /* O(1) – returns this.count */ }
  entries()        { /* O(n) – flattens all buckets */ }
}
```

#### Hash Function

The `_hash` method uses a **polynomial rolling hash** with prime base `31` modulo the bucket count `53`. Using a prime modulus reduces clustering and distributes keys more uniformly across buckets.

#### Collision Handling

Each bucket (`this.table[index]`) is an **array of `[key, value]` pairs**. When two keys hash to the same index they are appended to that bucket's array. Retrieval scans only the (typically very short) bucket list.

#### How It's Used

| Key          | Value stored                                          |
|--------------|-------------------------------------------------------|
| Normalised URL | `{ title, visitCount, lastVisited }` |

When the same URL is visited again, `visitCount` increments and `lastVisited` updates — no duplicate nodes needed.

#### Time Complexities

| Operation | Time (avg) | Time (worst) | Notes                          |
|-----------|------------|--------------|--------------------------------|
| `set`     | O(1)       | O(n)         | Worst case: all keys collide   |
| `get`     | O(1)       | O(n)         | Bucket scan                    |
| `has`     | O(1)       | O(n)         | Boolean get                    |
| `delete`  | O(1)       | O(n)         | Splice from bucket             |
| `entries` | O(n)       | O(n)         | Full table scan                |
| `size`    | O(1)       | O(1)         | Tracked counter                |

---

## 🧭 How the Navigation Works

```
Initial state:  currentPage = null | backStack = [] | forwardStack = []
```

| Step | Action                     | backStack            | forwardStack | currentPage  |
|------|----------------------------|----------------------|--------------|--------------|
| 1    | Visit **google.com**       | `[]`                 | `[]`         | google.com   |
| 2    | Visit **youtube.com**      | `[google]`           | `[]`         | youtube.com  |
| 3    | Visit **github.com**       | `[google, youtube]`  | `[]`         | github.com   |
| 4    | Click **Back**             | `[google]`           | `[github]`   | youtube.com  |
| 5    | Click **Back**             | `[]`                 | `[github, youtube]` | google.com |
| 6    | Click **Forward**          | `[google]`           | `[github]`   | youtube.com  |
| 7    | Visit **new page**         | `[google, youtube]`  | `[]` ← **cleared** | new page |

> **Key insight:** visiting a new page always clears the forward stack — exactly how real browsers work.

---

## ⏱️ Time Complexity Reference Table

| Operation              | Data Structure      | Time Complexity | Space Complexity | Notes                              |
|------------------------|---------------------|-----------------|------------------|------------------------------------|
| Visit new page         | Stack + DLL + HashMap | O(1)          | O(1)             | Push, insertAtEnd, set are all O(1)|
| Go back                | Stack               | O(1)            | O(1)             | Pop backStack, push forwardStack   |
| Go forward             | Stack               | O(1)            | O(1)             | Pop forwardStack, push backStack   |
| Search history (URL)   | HashMap             | O(1) avg        | O(1)             | Hash lookup                        |
| View full history      | Doubly Linked List  | O(n)            | O(n)             | Full forward traversal             |
| Delete history entry   | Doubly Linked List  | O(1)            | O(1)             | Pointer rewiring after find        |
| Find node by URL       | Doubly Linked List  | O(n)            | O(1)             | Linear scan                        |
| Check URL visited      | HashMap             | O(1) avg        | O(1)             | `has()` call                       |
| Get visit count        | HashMap             | O(1) avg        | O(1)             | `get()` then read property         |
| Clear all history      | All three           | O(1)            | O(1)             | Reset head/tail/table references   |
| Load from localStorage | All three           | O(n)            | O(n)             | Reconstruct from saved array       |

---

## 🛠️ Setup Instructions

1. **Download or clone** the project folder to your machine:
   ```bash
   git clone <repo-url>
   # — or — download and extract the ZIP
   ```

2. **No installation required** — zero dependencies, zero build step.

3. **Open in browser:**
   ```
   Double-click  DSA_Project/index.html
   ```
   Or drag the file into any browser window.

4. **Sample data loads automatically** on first launch — 8 realistic URLs are pre-populated so every feature is immediately visible.

5. **Your data persists** — all history, stacks, and settings are saved to `localStorage` and restored on every subsequent visit.

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Notes                   |
|---------|-----------------|-------------------------|
| Chrome  | 90+             | Fully tested ✅          |
| Firefox | 88+             | Fully tested ✅          |
| Edge    | 90+             | Fully tested ✅          |
| Safari  | 14+             | Fully tested ✅          |

> Requires ES6+ support (`class`, `const`/`let`, arrow functions, `localStorage`). All modern browsers qualify.

---

## 🏛️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  index.html  ·  style.css                                   │
│  Sections: Dashboard · History · Stacks · URL Map · About   │
│  Dark / Light theme toggle · Responsive layout              │
└──────────────────────────┬──────────────────────────────────┘
                           │  DOM events & render calls
┌──────────────────────────▼──────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  script.js — event handlers & render functions              │
│  visitPage() · goBack() · goForward()                       │
│  deleteHistoryEntry() · clearAllHistory() · searchHistory() │
│  saveToLocalStorage() · loadFromLocalStorage()              │
└──────────┬──────────────────────┬──────────────────────────┘
           │                      │                      │
┌──────────▼──────┐  ┌────────────▼──────┐  ┌───────────▼────┐
│   STACK (×2)    │  │  DOUBLY LINKED    │  │   HASH MAP     │
│                 │  │      LIST         │  │                │
│  backStack      │  │  historyList      │  │  urlMap        │
│  forwardStack   │  │  head/tail/current│  │  53 buckets    │
│  LIFO navigation│  │  Ordered history  │  │  O(1) lookup   │
└─────────────────┘  └───────────────────┘  └────────────────┘
                           │
              ┌────────────▼────────────┐
              │     localStorage        │
              │  Persistence across     │
              │  browser sessions       │
              └─────────────────────────┘
```

---

## 💡 Key Design Decisions

### Why Stack for Navigation?
The **LIFO** (Last-In, First-Out) property perfectly mirrors browser back/forward behaviour. The last page you visited is the first one you return to when you press Back. No other data structure models this as naturally or efficiently — every operation is O(1).

### Why Doubly Linked List for History?
History is an **ordered sequence** where:
- New entries are always appended at the **tail** → O(1) insertion
- Entries can be deleted anywhere without shifting → O(1) deletion
- The list must be traversed in **both directions** (forward for display, backward for reverse-chronological views) → bidirectional pointers

An array would require O(n) shifting on deletion; a singly linked list would not support efficient backward traversal.

### Why HashMap for the URL Index?
Duplicate-URL detection and visit-count lookups need to be **instantaneous** regardless of history length. The HashMap's O(1) average `has()` and `get()` operations keep search snappy even with hundreds of entries. A linear scan through the linked list for every keystroke would be O(n) and would feel sluggish.

### Why Separate Files?
Splitting into `index.html`, `style.css`, and `script.js` enforces a **clean separation of concerns**:
- Designers can restyle without touching logic
- Logic can be tested independently of markup
- Each file has a single, clear purpose

### Why localStorage?
`localStorage` delivers **zero-dependency persistence** — data survives page refreshes and browser restarts with no backend server, no database, and no network request. This is ideal for a client-side demo project that must run purely offline.

---

## 🎓 College Presentation Notes

Use these talking points when presenting to your teacher / lab examiner:

### Opening Statement
> *"This project simulates browser navigation — something we use every day — and shows how three fundamental data structures from our DSA course are what make it work. Every Back button press, every search result, and every visit count is handled by a Stack, a Doubly Linked List, or a HashMap that I wrote from scratch."*

### DSA Connection Explanation
Walk through each structure with the visualiser open:
1. **Stack** — Point to the Stack Visualiser panel. Push a few pages, hit Back and watch the stack update live. Say: *"This is LIFO in action — exactly what a Stack is designed for."*
2. **Doubly Linked List** — Open the History section. Say: *"Every row is a node. The arrows represent prev/next pointers. Deleting a row is O(1) — I just rewire two pointers."*
3. **HashMap** — Open the URL Map section. Say: *"Each URL is hashed to a bucket. This gives me O(1) lookup to detect duplicates and count visits, regardless of how many entries exist."*

### Live Demo Walkthrough
1. Open `index.html` fresh in Incognito (clears localStorage for a clean slate)
2. Type `google.com` → Visit → show dashboard update
3. Type `youtube.com` → Visit → show back stack grow to 1
4. Type `github.com` → Visit → show back stack grow to 2
5. Click **Back** twice → watch stacks and current page update
6. Click **Forward** once → show forward stack shrink
7. Type a letter in the Search box → show instant HashMap-powered results
8. Delete one entry → show O(1) list update

### Conclusion
> *"Real browsers — Chrome, Firefox — use the same underlying concepts internally. By implementing them myself, I didn't just learn the theory; I built something that actually works. The complexity table in the About section shows that every critical operation is O(1), which is why the app feels instant regardless of history size."*

---

## 📄 License

```
MIT License

Copyright (c) 2026 Shivam Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

**Free for educational use. ✅**

---

<div align="center">

Made with ❤️ by **Shivam Kumar** · B.Tech CSE · DSA Project 2026

*Stack · Doubly Linked List · HashMap*

</div>
