/**
 * Browser History Manager - script.js
 * DSA College Project
 * Implements: Stack, DoublyLinkedList, HashMap
 */

'use strict';

/* ============================================================
   1. STACK CLASS
   ============================================================ */

class Stack {
  /**
   * @param {string} name - Display name for this stack
   */
  constructor(name) {
    this.items = [];
    this.name = name;
  }

  /**
   * Push an item onto the top of the stack.
   * Time Complexity: O(1)
   * @param {*} item
   */
  push(item) {
    this.items.push(item);
  }

  /**
   * Remove and return the top item of the stack.
   * Time Complexity: O(1)
   * @returns {*} The top item, or undefined if empty.
   */
  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }

  /**
   * Return (without removing) the top item of the stack.
   * Time Complexity: O(1)
   * @returns {*} The top item, or undefined if empty.
   */
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }

  /**
   * Check if the stack is empty.
   * Time Complexity: O(1)
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Return the number of items in the stack.
   * Time Complexity: O(1)
   * @returns {number}
   */
  size() {
    return this.items.length;
  }

  /**
   * Remove all items from the stack.
   * Time Complexity: O(1)
   */
  clear() {
    this.items = [];
  }

  /**
   * Return a shallow copy of the internal items array.
   * Time Complexity: O(n)
   * @returns {Array}
   */
  toArray() {
    return [...this.items];
  }
}

/* ============================================================
   2. DOUBLY LINKED LIST
   ============================================================ */

class Node {
  /**
   * @param {*} data
   */
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null; // pointer to the "active" node
    this.length = 0;
  }

  /**
   * Insert a new node at the end of the list.
   * Time Complexity: O(1)
   * @param {*} data
   * @returns {Node} The newly inserted node.
   */
  insertAtEnd(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    this.current = newNode;
    return newNode;
  }

  /**
   * Delete a specific node from the list.
   * Time Complexity: O(1) given the node reference.
   * @param {Node} node
   */
  deleteNode(node) {
    if (!node) return;

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      // node is head
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      // node is tail
      this.tail = node.prev;
    }

    if (this.current === node) {
      this.current = node.prev || node.next || null;
    }

    node.prev = null;
    node.next = null;
    this.length--;
  }

  /**
   * Traverse the list from head to tail.
   * Time Complexity: O(n)
   * @returns {Array} Array of node data values.
   */
  traverseForward() {
    const result = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.data);
      curr = curr.next;
    }
    return result;
  }

  /**
   * Traverse the list from tail to head.
   * Time Complexity: O(n)
   * @returns {Array} Array of node data values (reversed).
   */
  traverseBackward() {
    const result = [];
    let curr = this.tail;
    while (curr) {
      result.push(curr.data);
      curr = curr.prev;
    }
    return result;
  }

  /**
   * Find the first node whose data.url matches the given URL.
   * Time Complexity: O(n)
   * @param {string} url
   * @returns {Node|null}
   */
  findNode(url) {
    let curr = this.head;
    while (curr) {
      if (curr.data && curr.data.url === url) return curr;
      curr = curr.next;
    }
    return null;
  }

  /**
   * Find a node matching both url and timestamp.
   * Time Complexity: O(n)
   * @param {string} url
   * @param {number} timestamp
   * @returns {Node|null}
   */
  findNodeByUrlAndTimestamp(url, timestamp) {
    let curr = this.head;
    while (curr) {
      if (curr.data && curr.data.url === url && curr.data.timestamp === timestamp) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }

  /**
   * Clear the entire list.
   * Time Complexity: O(1)
   */
  clear() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.length = 0;
  }
}

/* ============================================================
   3. HASH MAP (Separate Chaining, 53 buckets)
   ============================================================ */

class HashMap {
  /**
   * @param {number} size - Number of buckets (default 53, a prime)
   */
  constructor(size = 53) {
    this.table = new Array(size);
    this.count = 0;
    this._size = size;
  }

  /**
   * Polynomial rolling hash function.
   * Time Complexity: O(k) where k = key length
   * @param {string} key
   * @returns {number} Bucket index
   */
  _hash(key) {
    let total = 0;
    const PRIME = 31;
    const limit = Math.min(key.length, 100);
    for (let i = 0; i < limit; i++) {
      const charCode = key.charCodeAt(i) - 96;
      total = (total * PRIME + charCode) % this._size;
    }
    return Math.abs(total);
  }

  /**
   * Insert or update a key-value pair.
   * Time Complexity: O(1) average, O(n) worst case (all keys in one bucket)
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    const index = this._hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }
    const bucket = this.table[index];
    const existing = bucket.find(pair => pair[0] === key);
    if (existing) {
      existing[1] = value;
    } else {
      bucket.push([key, value]);
      this.count++;
    }
  }

  /**
   * Retrieve the value for a key.
   * Time Complexity: O(1) average
   * @param {string} key
   * @returns {*} The value, or undefined if not found.
   */
  get(key) {
    const index = this._hash(key);
    const bucket = this.table[index];
    if (!bucket) return undefined;
    const pair = bucket.find(p => p[0] === key);
    return pair ? pair[1] : undefined;
  }

  /**
   * Check if a key exists in the map.
   * Time Complexity: O(1) average
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key-value pair.
   * Time Complexity: O(1) average
   * @param {string} key
   * @returns {boolean} true if deleted, false if not found.
   */
  delete(key) {
    const index = this._hash(key);
    const bucket = this.table[index];
    if (!bucket) return false;
    const idx = bucket.findIndex(p => p[0] === key);
    if (idx === -1) return false;
    bucket.splice(idx, 1);
    this.count--;
    return true;
  }

  /**
   * Clear all entries from the map.
   * Time Complexity: O(n) where n = number of buckets
   */
  clear() {
    this.table = new Array(this._size);
    this.count = 0;
  }

  /**
   * Return the number of unique keys stored.
   * Time Complexity: O(1)
   * @returns {number}
   */
  size() {
    return this.count;
  }

  /**
   * Return all [key, value] pairs stored in the map.
   * Time Complexity: O(n + b) where b = bucket count
   * @returns {Array} Array of [key, value] pairs.
   */
  entries() {
    const result = [];
    for (let i = 0; i < this._size; i++) {
      if (this.table[i]) {
        for (const pair of this.table[i]) {
          result.push(pair);
        }
      }
    }
    return result;
  }
}

/* ============================================================
   4. APPLICATION STATE
   ============================================================ */

const backStack    = new Stack('Back Stack');
const forwardStack = new Stack('Forward Stack');
const historyList  = new DoublyLinkedList();
const urlMap       = new HashMap();

let currentPage    = null; // { url, title, timestamp }
let currentSection = 'dashboard';
let showAllBuckets = false; // for hashmap viz toggle

/* ============================================================
   5. UTILITY FUNCTIONS
   ============================================================ */

/**
 * Format a Unix timestamp (ms) into a human-readable string.
 * @param {number} ts
 * @returns {string} e.g. "Nov 24, 2026, 12:34 AM"
 */
function formatTimestamp(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Extract the domain from a full URL for favicon fetching.
 * @param {string} url
 * @returns {string} domain (e.g. "github.com")
 */
function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

/**
 * Generate a readable title from a URL by capitalising the domain name.
 * @param {string} url
 * @returns {string}
 */
function generateTitle(url) {
  const domain = extractDomain(url);
  const base = domain.replace(/^www\./, '').split('.')[0];
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/**
 * Normalize a URL: add https:// if the scheme is missing.
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  url = url.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

/**
 * Show a brief toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showNotification(message, type = 'info') {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText =
      'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colorMap = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };
  const iconMap  = { success: '✓', error: '✕', info: 'ℹ' };
  toast.style.cssText =
    `background:${colorMap[type] || colorMap.info};color:#fff;padding:10px 16px;border-radius:8px;` +
    `font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.3);display:flex;align-items:center;gap:8px;` +
    `max-width:320px;animation:slideIn .3s ease;`;
  toast.innerHTML =
    `<span style="font-weight:700;font-size:16px;">${iconMap[type] || iconMap.info}</span>` +
    `<span>${message}</span>`;

  if (!document.getElementById('toast-anim-style')) {
    const style = document.createElement('style');
    style.id = 'toast-anim-style';
    style.textContent =
      '@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}' +
      '@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}';
    document.head.appendChild(style);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ============================================================
   6. CORE FUNCTIONS
   ============================================================ */

/**
 * Visit a page: update all data structures and persist state.
 * @param {string} url
 * @param {string} [title='']
 * @param {boolean} [addToHistory=true]
 */
function visitPage(url, title = '', addToHistory = true) {
  url = normalizeUrl(url);
  if (!url) {
    showNotification('Please enter a valid URL.', 'error');
    return;
  }

  if (!title || !title.trim()) {
    title = generateTitle(url);
  }
  title = title.trim();

  // Push current page onto back stack
  if (currentPage) {
    backStack.push(currentPage);
  }

  // Clear forward stack on new navigation
  forwardStack.clear();

  const timestamp = Date.now();
  currentPage = { url, title, timestamp };

  // Insert into doubly linked list
  historyList.insertAtEnd(currentPage);

  // Update url map
  if (urlMap.has(url)) {
    const meta = urlMap.get(url);
    meta.visitCount++;
    meta.lastVisited = timestamp;
    urlMap.set(url, meta);
  } else {
    urlMap.set(url, { title, visitCount: 1, lastVisited: timestamp });
  }

  saveToLocalStorage();
  renderAll();
}

/**
 * Navigate back in history.
 */
function goBack() {
  if (backStack.isEmpty()) {
    showNotification('No pages to go back to.', 'info');
    return;
  }
  forwardStack.push(currentPage);
  currentPage = backStack.pop();

  // Update the linked list current pointer
  const node = historyList.findNodeByUrlAndTimestamp(currentPage.url, currentPage.timestamp);
  if (node) historyList.current = node;

  saveToLocalStorage();
  renderAll();
  showNotification(`Navigated back to ${currentPage.title}`, 'info');
}

/**
 * Navigate forward in history.
 */
function goForward() {
  if (forwardStack.isEmpty()) {
    showNotification('No pages to go forward to.', 'info');
    return;
  }
  backStack.push(currentPage);
  currentPage = forwardStack.pop();

  const node = historyList.findNodeByUrlAndTimestamp(currentPage.url, currentPage.timestamp);
  if (node) historyList.current = node;

  saveToLocalStorage();
  renderAll();
  showNotification(`Navigated forward to ${currentPage.title}`, 'info');
}

/**
 * Delete a single history entry identified by url + timestamp.
 * @param {string} url
 * @param {number} timestamp
 */
function deleteHistoryEntry(url, timestamp) {
  // Remove from doubly linked list
  const node = historyList.findNodeByUrlAndTimestamp(url, timestamp);
  if (node) historyList.deleteNode(node);

  // Check if any other entry in history has the same url
  const stillExists = historyList.traverseForward().some(d => d.url === url);
  if (!stillExists) urlMap.delete(url);

  // Remove matching entries from back stack
  backStack.items = backStack.items.filter(
    p => !(p.url === url && p.timestamp === timestamp)
  );

  // Remove matching entries from forward stack
  forwardStack.items = forwardStack.items.filter(
    p => !(p.url === url && p.timestamp === timestamp)
  );

  // If the deleted entry was current page, set currentPage to backStack top or null
  if (currentPage && currentPage.url === url && currentPage.timestamp === timestamp) {
    currentPage = backStack.peek() || null;
    if (currentPage) {
      const newNode = historyList.findNodeByUrlAndTimestamp(currentPage.url, currentPage.timestamp);
      if (newNode) historyList.current = newNode;
    } else {
      historyList.current = historyList.tail;
    }
  }

  saveToLocalStorage();
  renderAll();
  showNotification('History entry deleted.', 'success');
}

/**
 * Clear all browser history and reset state.
 */
function clearAllHistory() {
  historyList.clear();
  backStack.clear();
  forwardStack.clear();
  urlMap.clear();
  currentPage = null;
  saveToLocalStorage();
  renderAll();
  showNotification('All history cleared.', 'success');
}

/**
 * Search history by URL or title (case-insensitive).
 * @param {string} query
 * @returns {Array} Matching [key, value] pairs from urlMap.
 */
function searchHistory(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return urlMap.entries().filter(
    ([key, value]) => key.toLowerCase().includes(q) || value.title.toLowerCase().includes(q)
  );
}

/* ============================================================
   7. LOCAL STORAGE PERSISTENCE
   ============================================================ */

const LS_KEY = 'browserHistoryManager_v1';

/**
 * Save current state to localStorage.
 */
function saveToLocalStorage() {
  const payload = {
    history: historyList.traverseForward(),
    currentUrl: currentPage ? currentPage.url : null,
    currentTimestamp: currentPage ? currentPage.timestamp : null,
    backStack: backStack.toArray(),
    forwardStack: forwardStack.toArray()
  };
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

/**
 * Load state from localStorage WITHOUT calling visitPage.
 * @returns {boolean} true if data was loaded, false if none found.
 */
function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;

    const payload = JSON.parse(raw);
    if (!payload || !Array.isArray(payload.history) || payload.history.length === 0) return false;

    // Reconstruct doubly linked list and urlMap
    for (const entry of payload.history) {
      historyList.insertAtEnd(entry);
      if (urlMap.has(entry.url)) {
        const meta = urlMap.get(entry.url);
        meta.visitCount++;
        if (entry.timestamp > meta.lastVisited) meta.lastVisited = entry.timestamp;
        urlMap.set(entry.url, meta);
      } else {
        urlMap.set(entry.url, {
          title: entry.title,
          visitCount: 1,
          lastVisited: entry.timestamp
        });
      }
    }

    // Reconstruct stacks
    for (const item of (payload.backStack || [])) {
      backStack.push(item);
    }
    for (const item of (payload.forwardStack || [])) {
      forwardStack.push(item);
    }

    // Set current page
    if (payload.currentUrl && payload.currentTimestamp) {
      const node = historyList.findNodeByUrlAndTimestamp(
        payload.currentUrl,
        payload.currentTimestamp
      );
      if (node) {
        currentPage = node.data;
        historyList.current = node;
      }
    }

    return true;
  } catch (e) {
    console.warn('localStorage load failed:', e);
    return false;
  }
}

/* ============================================================
   8. RENDER FUNCTIONS
   ============================================================ */

/** Safely get a DOM element by ID without throwing. */
function el(id) {
  return document.getElementById(id);
}

/** Safely set textContent. */
function setText(id, text) {
  const element = el(id);
  if (element) element.textContent = text;
}

/** Safely set innerHTML. */
function setHTML(id, html) {
  const element = el(id);
  if (element) element.innerHTML = html;
}

/**
 * Render the dashboard statistics and navigation buttons.
 */
function renderDashboard() {
  setText('total-visits', historyList.length);
  setText('unique-urls', urlMap.size());
  setText('back-stack-size', backStack.size());
  setText('forward-stack-size', forwardStack.size());

  const display = el('current-page-display');
  if (display) {
    if (currentPage) {
      display.innerHTML =
        `<span class="cp-title">${escapeHtml(currentPage.title)}</span>` +
        `<span class="cp-url">${escapeHtml(currentPage.url)}</span>`;
    } else {
      display.textContent = 'No page visited';
    }
  }

  const backBtn = el('back-btn');
  const fwdBtn  = el('forward-btn');
  if (backBtn) backBtn.disabled = backStack.isEmpty();
  if (fwdBtn)  fwdBtn.disabled  = forwardStack.isEmpty();

  // Dashboard preview widgets
  renderRecentHistory();
  renderMostVisited();
  renderDSAStatus();
}

/**
 * Render the 5 most recent history entries in the dashboard preview.
 */
function renderRecentHistory() {
  const container = el('recent-history-preview');
  if (!container) return;
  const entries = historyList.traverseBackward().slice(0, 5);
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📭</span><p>No history yet.</p></div>';
    return;
  }
  container.innerHTML = entries.map(entry => {
    const domain = extractDomain(entry.url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
    return `
      <div class="recent-history-item">
        <div class="rh-favicon">
          <img src="${escapeAttr(faviconUrl)}" alt="" width="16" height="16"
               onerror="this.style.display='none'">
        </div>
        <span class="rh-title">${escapeHtml(entry.title)}</span>
        <span class="rh-time">${formatTimestamp(entry.timestamp)}</span>
      </div>`;
  }).join('');
}

/**
 * Render the top 5 most-visited URLs in the dashboard preview.
 */
function renderMostVisited() {
  const container = el('most-visited-preview');
  if (!container) return;
  const all = urlMap.entries();
  if (all.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No data yet.</p></div>';
    return;
  }
  const sorted = all.sort((a, b) => b[1].visitCount - a[1].visitCount).slice(0, 5);
  container.innerHTML = sorted.map(([url, meta], i) => `
    <div class="most-visited-item">
      <span class="mv-rank">#${i+1}</span>
      <span class="mv-title">${escapeHtml(meta.title)}</span>
      <span class="mv-count">${meta.visitCount}×</span>
    </div>`).join('');
}

/**
 * Render DSA structure status panels in the dashboard.
 */
function renderDSAStatus() {
  // Stack status
  const stackEl = el('stack-status-info');
  if (stackEl) {
    stackEl.innerHTML = `
      <div class="dsa-status-info-item"><span class="label">Back Stack Size</span><span class="value">${backStack.size()}</span></div>
      <div class="dsa-status-info-item"><span class="label">Forward Stack Size</span><span class="value">${forwardStack.size()}</span></div>
      <div class="dsa-status-info-item"><span class="label">Back TOP</span><span class="value">${backStack.peek() ? escapeHtml(backStack.peek().title) : '—'}</span></div>
      <div class="dsa-status-info-item"><span class="label">Fwd TOP</span><span class="value">${forwardStack.peek() ? escapeHtml(forwardStack.peek().title) : '—'}</span></div>`;
  }

  // Linked list status
  const llEl = el('ll-status-info');
  if (llEl) {
    const head = historyList.head ? escapeHtml(historyList.head.data.title) : '—';
    const tail = historyList.tail ? escapeHtml(historyList.tail.data.title) : '—';
    const curr = historyList.current ? escapeHtml(historyList.current.data.title) : '—';
    llEl.innerHTML = `
      <div class="dsa-status-info-item"><span class="label">Total Nodes</span><span class="value">${historyList.length}</span></div>
      <div class="dsa-status-info-item"><span class="label">HEAD</span><span class="value">${head}</span></div>
      <div class="dsa-status-info-item"><span class="label">TAIL</span><span class="value">${tail}</span></div>
      <div class="dsa-status-info-item"><span class="label">CURRENT</span><span class="value">${curr}</span></div>`;
  }

  // HashMap status
  const hmEl = el('hm-status-info');
  if (hmEl) {
    const loadFactor = (urlMap.size() / 53).toFixed(3);
    hmEl.innerHTML = `
      <div class="dsa-status-info-item"><span class="label">Entries</span><span class="value">${urlMap.size()}</span></div>
      <div class="dsa-status-info-item"><span class="label">Buckets</span><span class="value">53</span></div>
      <div class="dsa-status-info-item"><span class="label">Load Factor</span><span class="value">${loadFactor}</span></div>
      <div class="dsa-status-info-item"><span class="label">Collisions</span><span class="value">${countCollisions()}</span></div>`;
  }

  // Linked list viz header stats
  setText('ll-node-count', historyList.length);
  setText('ll-head-label', historyList.head ? historyList.head.data.title : '—');
  setText('ll-tail-label', historyList.tail ? historyList.tail.data.title : '—');

  // HashMap header stats
  setText('hm-entry-count', urlMap.size());
  setText('hm-load-factor', (urlMap.size() / 53).toFixed(3));
}

/**
 * Count number of hash collision chains (buckets with > 1 entry).
 * @returns {number}
 */
function countCollisions() {
  let count = 0;
  for (let i = 0; i < 53; i++) {
    if (urlMap.table[i] && urlMap.table[i].length > 1) {
      count += urlMap.table[i].length - 1;
    }
  }
  return count;
}

/**
 * Render the full browsing history as cards (newest first).
 */
function renderHistoryList() {
  const container = el('history-list-container');
  if (!container) return;

  const entries = historyList.traverseBackward();
  if (entries.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">📭</span><p>No history yet. Start browsing!</p></div>';
    return;
  }

  container.innerHTML = entries.map(entry => {
    const domain     = extractDomain(entry.url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
    const meta       = urlMap.get(entry.url);
    const visitCount = meta ? meta.visitCount : 1;
    const isActive   = currentPage &&
                       currentPage.url === entry.url &&
                       currentPage.timestamp === entry.timestamp;

    return `
      <div class="history-card ${isActive ? 'history-card--active' : ''}" data-url="${escapeAttr(entry.url)}">
        <div class="history-card__favicon">
          <img src="${escapeAttr(faviconUrl)}" alt="" width="32" height="32"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="favicon-fallback" style="display:none;">${escapeHtml(domain.charAt(0).toUpperCase())}</div>
        </div>
        <div class="history-card__info">
          <div class="history-card__title">${escapeHtml(entry.title)}</div>
          <div class="history-card__url">${escapeHtml(entry.url)}</div>
          <div class="history-card__meta">
            <span class="meta-time">🕐 ${formatTimestamp(entry.timestamp)}</span>
            <span class="meta-visits">👁 ${visitCount} visit${visitCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="history-card__actions">
          ${isActive ? '<span class="badge badge--active">Current</span>' : ''}
          <button class="btn btn--icon btn--danger"
            onclick="deleteHistoryEntry('${escapeAttr(entry.url)}', ${entry.timestamp})"
            title="Delete this entry">🗑</button>
          <button class="btn btn--icon"
            onclick="visitPage('${escapeAttr(entry.url)}', '${escapeAttr(entry.title)}')"
            title="Revisit">↗</button>
        </div>
      </div>`;
  }).join('');
}

/**
 * Render the Back Stack visualisation.
 */
function renderBackStack() {
  const container = el('back-stack-container');
  if (!container) return;

  const items = backStack.toArray().reverse(); // top first
  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>Back stack is empty.</p></div>';
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    const isTop = idx === 0;
    return `
      <div class="stack-item ${isTop ? 'stack-item--top' : ''}">
        <div class="stack-item__index">${isTop ? '▶ TOP' : `#${items.length - idx}`}</div>
        <div class="stack-item__content">
          <div class="stack-item__title">${escapeHtml(item.title)}</div>
          <div class="stack-item__url">${escapeHtml(item.url)}</div>
          <div class="stack-item__time">${formatTimestamp(item.timestamp)}</div>
        </div>
      </div>`;
  }).join('');
}

/**
 * Render the Forward Stack visualisation.
 */
function renderForwardStack() {
  const container = el('forward-stack-container');
  if (!container) return;

  const items = forwardStack.toArray().reverse(); // top first
  if (items.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>Forward stack is empty.</p></div>';
    return;
  }

  container.innerHTML = items.map((item, idx) => {
    const isTop = idx === 0;
    return `
      <div class="stack-item ${isTop ? 'stack-item--top' : ''}">
        <div class="stack-item__index">${isTop ? '▶ TOP' : `#${items.length - idx}`}</div>
        <div class="stack-item__content">
          <div class="stack-item__title">${escapeHtml(item.title)}</div>
          <div class="stack-item__url">${escapeHtml(item.url)}</div>
          <div class="stack-item__time">${formatTimestamp(item.timestamp)}</div>
        </div>
      </div>`;
  }).join('');
}

/**
 * Render the Doubly Linked List as a horizontal node-arrow diagram.
 */
function renderLinkedListViz() {
  const container = el('linked-list-viz');
  if (!container) return;

  const entries = historyList.traverseForward();
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">🔗</span><p>No nodes in the list.</p></div>';
    return;
  }

  const nodesHtml = entries.map((entry, idx) => {
    const isCurrent = currentPage &&
                      entry.url === currentPage.url &&
                      entry.timestamp === currentPage.timestamp;
    const isHead = idx === 0;
    const isTail = idx === entries.length - 1;

    return `
      <div class="ll-node-wrapper">
        ${!isHead ? '<div class="ll-arrow ll-arrow--back" title="prev pointer">◀</div>' : '<div class="ll-arrow ll-arrow--null">NULL</div>'}
        <div class="ll-node ${isCurrent ? 'll-node--current' : ''}">
          <div class="ll-node__label">
            ${isHead ? '<span class="ll-badge">HEAD</span>' : ''}
            ${isTail ? '<span class="ll-badge ll-badge--tail">TAIL</span>' : ''}
            ${isCurrent ? '<span class="ll-badge ll-badge--curr">CURRENT</span>' : ''}
          </div>
          <div class="ll-node__title" title="${escapeAttr(entry.url)}">${escapeHtml(entry.title)}</div>
          <div class="ll-node__url">${escapeHtml(extractDomain(entry.url))}</div>
          <div class="ll-node__time">${formatTimestamp(entry.timestamp)}</div>
        </div>
        ${!isTail ? '<div class="ll-arrow" title="next pointer">▶</div>' : '<div class="ll-arrow ll-arrow--null">NULL</div>'}
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="ll-scroll-wrapper">
      <div class="ll-nodes">${nodesHtml}</div>
    </div>
    <div class="ll-info">
      <span>Total nodes: <strong>${historyList.length}</strong></span>
      ${currentPage ? `<span>Current: <strong>${escapeHtml(currentPage.title)}</strong></span>` : ''}
    </div>`;
}

/**
 * Render the HashMap as a bucket visualisation.
 */
function renderHashMapViz() {
  const container = el('hashmap-viz');
  if (!container) return;

  let html = `
    <div class="hm-controls">
      <label class="toggle-label">
        <input type="checkbox" id="show-all-buckets" ${showAllBuckets ? 'checked' : ''}
          onchange="showAllBuckets=this.checked;renderHashMapViz();">
        Show all 53 buckets
      </label>
      <span class="hm-stats">Load factor: ${(urlMap.size() / 53).toFixed(3)} | Entries: ${urlMap.size()}</span>
    </div>
    <div class="hm-buckets">`;

  for (let i = 0; i < 53; i++) {
    const bucket = urlMap.table[i];
    const hasData = bucket && bucket.length > 0;

    if (!showAllBuckets && !hasData) continue;

    html += `<div class="hm-bucket ${hasData ? 'hm-bucket--filled' : 'hm-bucket--empty'}" data-bucket-index="${i}">
      <div class="hm-bucket__index">[${i}]</div>
      <div class="hm-bucket__chain">`;

    if (hasData) {
      html += bucket.map(([key, value], chainIdx) =>
        `<div class="hm-entry">
          ${chainIdx > 0 ? '<span class="hm-chain-arrow">→</span>' : ''}
          <div class="hm-entry__key">${escapeHtml(key)}</div>
          <div class="hm-entry__value">
            <span class="hm-val-label">title:</span> ${escapeHtml(value.title)}<br>
            <span class="hm-val-label">visits:</span> ${value.visitCount}<br>
            <span class="hm-val-label">last:</span> ${formatTimestamp(value.lastVisited)}
          </div>
        </div>`
      ).join('');
    } else {
      html += '<span class="hm-empty-bucket">∅ empty</span>';
    }

    html += '</div></div>';
  }

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Render search results.
 * @param {Array} results - Array of [key, value] pairs.
 */
function renderSearchResults(results) {
  const container = el('search-results');
  if (!container) return;

  if (!results || results.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">🔍</span><p>No results found.</p></div>';
    return;
  }

  container.innerHTML = results.map(([url, meta]) => {
    const domain     = extractDomain(url);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
    return `
      <div class="history-card search-result-card">
        <div class="history-card__favicon">
          <img src="${escapeAttr(faviconUrl)}" alt="" width="32" height="32"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="favicon-fallback" style="display:none;">${escapeHtml(domain.charAt(0).toUpperCase())}</div>
        </div>
        <div class="history-card__info">
          <div class="history-card__title">${escapeHtml(meta.title)}</div>
          <div class="history-card__url">${escapeHtml(url)}</div>
          <div class="history-card__meta">
            <span class="meta-visits">👁 ${meta.visitCount} visit${meta.visitCount !== 1 ? 's' : ''}</span>
            <span class="meta-time">🕐 Last: ${formatTimestamp(meta.lastVisited)}</span>
          </div>
        </div>
        <div class="history-card__actions">
          <button class="btn btn--icon" onclick="visitPage('${escapeAttr(url)}', '${escapeAttr(meta.title)}')"
            title="Visit">↗</button>
        </div>
      </div>`;
  }).join('');
}

/**
 * Render all sections that are currently visible.
 */
function renderAll() {
  renderDashboard();

  switch (currentSection) {
    case 'history':       renderHistoryList();   break;
    case 'back-stack':    renderBackStack();     break;
    case 'forward-stack': renderForwardStack();  break;
    case 'linked-list':   renderLinkedListViz(); break;
    case 'hashmap':       renderHashMapViz();    break;
    // dashboard and about need no extra render
  }
}

/* ============================================================
   9. ESCAPE HELPERS (XSS safety)
   ============================================================ */

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (typeof str !== 'string') return String(str);
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/* ============================================================
   10. SECTION NAVIGATION
   ============================================================ */

const SECTIONS = [
  'dashboard',
  'history',
  'back-stack',
  'forward-stack',
  'linked-list',
  'hashmap',
  'about'
];

/**
 * Switch the active section in the UI.
 * @param {string} sectionName
 */
function switchSection(sectionName) {
  if (!SECTIONS.includes(sectionName)) return;
  currentSection = sectionName;

  // Hide all sections
  SECTIONS.forEach(s => {
    const sEl = el(`section-${s}`);
    if (sEl) sEl.style.display = 'none';
  });

  // Show active section
  const activeEl = el(`section-${sectionName}`);
  if (activeEl) activeEl.style.display = '';

  // Update nav link active states
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionName);
  });

  renderAll();
}

/* ============================================================
   11. EVENT LISTENERS SETUP
   ============================================================ */

function setupEventListeners() {
  // Visit button
  const visitBtn = el('visit-btn');
  if (visitBtn) {
    visitBtn.addEventListener('click', () => {
      const url   = (el('url-input')   || {}).value || '';
      const title = (el('title-input') || {}).value || '';
      if (!url.trim()) {
        showNotification('Please enter a URL.', 'error');
        return;
      }
      visitPage(url, title);
      if (el('url-input'))   el('url-input').value   = '';
      if (el('title-input')) el('title-input').value = '';
      showNotification('Page visited!', 'success');
    });
  }

  // Enter key in URL input
  const urlInput = el('url-input');
  if (urlInput) {
    urlInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (visitBtn) visitBtn.click();
      }
    });
  }

  // Back button
  const backBtn = el('back-btn');
  if (backBtn) backBtn.addEventListener('click', goBack);

  // Forward button
  const fwdBtn = el('forward-btn');
  if (fwdBtn) fwdBtn.addEventListener('click', goForward);

  // Clear history button
  const clearBtn = el('clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
        clearAllHistory();
      }
    });
  }

  // Search input
  const searchInput = el('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const results = searchHistory(searchInput.value);
      renderSearchResults(results);
    });
  }

  // Theme toggle
  const themeToggle = el('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeToggle.textContent = isLight ? '🌙' : '☀️';
      try { localStorage.setItem('bhm_theme', isLight ? 'light' : 'dark'); } catch {}
    });
  }

  // Sidebar navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) switchSection(section);
    });
  });

  // Linked list traversal buttons (animate highlight)
  const traverseFwdBtn = el('traverse-forward-btn');
  const traverseBwdBtn = el('traverse-backward-btn');

  if (traverseFwdBtn) {
    traverseFwdBtn.addEventListener('click', () => animateTraversal('forward'));
  }
  if (traverseBwdBtn) {
    traverseBwdBtn.addEventListener('click', () => animateTraversal('backward'));
  }

  // Mobile menu toggle — open/close sidebar
  const menuToggle = el('menu-toggle');
  if (menuToggle) {
    // Create overlay dynamically if not present
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    menuToggle.addEventListener('click', () => {
      const sidebar = el('sidebar');
      if (!sidebar) return;
      sidebar.classList.toggle('sidebar-open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      const sidebar = el('sidebar');
      if (sidebar) sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('active');
    });

    // Close sidebar when a nav link is clicked on mobile
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          const sidebar = el('sidebar');
          if (sidebar) sidebar.classList.remove('sidebar-open');
          overlay.classList.remove('active');
        }
      });
    });
  }

  // HashMap search / hash demo
  const hmSearchBtn = el('hm-search-btn');
  const hmSearchInput = el('hm-search-input');
  const hmHashResult = el('hm-hash-result');

  function hashDemo() {
    if (!hmSearchInput || !hmHashResult) return;
    const key = hmSearchInput.value.trim();
    if (!key) {
      hmHashResult.style.display = 'none';
      return;
    }
    const hash = urlMap._hash(key);
    const existing = urlMap.get(key);
    let msg = `hash("${key}") = ${hash} → bucket [${hash}]`;
    if (existing) {
      msg += ` ✓ Found: "${existing.title}" (${existing.visitCount} visits)`;
    } else {
      msg += ` — key not in table`;
    }
    hmHashResult.textContent = msg;
    hmHashResult.style.display = 'block';

    // Scroll to and highlight the bucket in the viz
    if (currentSection === 'hashmap') {
      setTimeout(() => {
        const buckets = document.querySelectorAll('.hm-bucket');
        buckets.forEach(b => b.style.outline = '');
        const target = document.querySelector(`.hm-bucket[data-bucket-index="${hash}"]`);
        if (target) {
          target.style.outline = '2px solid var(--accent)';
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }

  if (hmSearchBtn) {
    hmSearchBtn.addEventListener('click', hashDemo);
  }
  if (hmSearchInput) {
    hmSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') hashDemo();
    });
  }
}

/* ============================================================
   12. LINKED LIST TRAVERSAL ANIMATION
   ============================================================ */

let traversalTimer = null;

/**
 * Animate traversal through linked list nodes by temporarily highlighting each.
 * @param {'forward'|'backward'} direction
 */
function animateTraversal(direction) {
  if (traversalTimer) clearInterval(traversalTimer);

  renderLinkedListViz();
  const container = el('linked-list-viz');
  if (!container) return;

  const nodes = Array.from(container.querySelectorAll('.ll-node'));
  if (nodes.length === 0) return;

  const ordered = direction === 'backward' ? [...nodes].reverse() : nodes;
  let idx = 0;

  // Remove any previous animation classes
  nodes.forEach(n => n.classList.remove('ll-node--traversing'));

  traversalTimer = setInterval(() => {
    nodes.forEach(n => n.classList.remove('ll-node--traversing'));
    if (idx < ordered.length) {
      ordered[idx].classList.add('ll-node--traversing');
      idx++;
    } else {
      clearInterval(traversalTimer);
      traversalTimer = null;
      // Re-render to remove traversal classes
      setTimeout(() => renderLinkedListViz(), 400);
    }
  }, 500);
}

/* ============================================================
   13. SAMPLE DATA (first launch only)
   ============================================================ */

function loadSampleData() {
  const samples = [
    { url: 'google.com',         title: 'Google Search'  },
    { url: 'github.com',         title: 'GitHub'          },
    { url: 'stackoverflow.com',  title: 'Stack Overflow'  },
    { url: 'youtube.com',        title: 'YouTube'         },
    { url: 'mdn.webdocs.org',    title: 'MDN Web Docs'    },
    { url: 'medium.com',         title: 'Medium Blog'     },
    { url: 'npmjs.com',          title: 'npm Registry'    },
    { url: 'wikipedia.org',      title: 'Wikipedia'       }
  ];

  samples.forEach(({ url, title }) => visitPage(url, title));
}

/* ============================================================
   14. INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Restore theme preference
  try {
    const savedTheme = localStorage.getItem('bhm_theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      const toggle = el('theme-toggle');
      if (toggle) toggle.textContent = '🌙';
    }
  } catch {}

  // Load persisted state or seed sample data
  const loaded = loadFromLocalStorage();
  if (!loaded) {
    loadSampleData();
  }

  // Set up all event listeners
  setupEventListeners();

  // Show dashboard section by default
  switchSection('dashboard');

  // Initial render
  renderAll();
});
