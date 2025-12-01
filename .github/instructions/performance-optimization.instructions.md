---
applyTo: '*'
description: 'The most comprehensive, practical, and engineer-authored performance optimization instructions for frontend.
---

# Performance Optimization Best Practices

## Introduction

Performance isn't just a buzzword—it's the difference between a product people love and one they abandon. I've seen firsthand how a slow app can frustrate users, rack up cloud bills, and even lose customers. This guide is a living collection of the most effective, real-world performance practices I've used and reviewed, covering frontend, as well as advanced topics. Use it as a reference, a checklist, and a source of inspiration for building fast, efficient, and scalable software.

---

## General Principles

- **Measure First, Optimize Second:** Always profile and measure before optimizing. Use benchmarks, profilers, and monitoring tools to identify real bottlenecks. Guessing is the enemy of performance.
  - _Pro Tip:_ Use tools like Chrome DevTools, Lighthouse, New Relic, Datadog, Py-Spy, or your language's built-in profilers.
- **Optimize for the Common Case:** Focus on optimizing code paths that are most frequently executed. Don't waste time on rare edge cases unless they're critical.
- **Avoid Premature Optimization:** Write clear, maintainable code first; optimize only when necessary. Premature optimization can make code harder to read and maintain.
- **Minimize Resource Usage:** Use memory, CPU, network, and disk resources efficiently. Always ask: "Can this be done with less?"
- **Prefer Simplicity:** Simple algorithms and data structures are often faster and easier to optimize. Don't over-engineer.
- **Document Performance Assumptions:** Clearly comment on any code that is performance-critical or has non-obvious optimizations. Future maintainers (including you) will thank you.
- **Understand the Platform:** Know the performance characteristics of your language, framework, and runtime. What's fast in Python may be slow in JavaScript, and vice versa.
- **Automate Performance Testing:** Integrate performance tests and benchmarks into your CI/CD pipeline. Catch regressions early.
- **Set Performance Budgets:** Define acceptable limits for load time, memory usage, API latency, etc. Enforce them with automated checks.

---

## Frontend Performance

### Rendering and DOM

- **React Compiler Integration:** This workspace uses React Compiler, which automatically optimizes React components by memoizing expensive computations and preventing unnecessary re-renders. Manual `React.memo`, `useMemo`, and `useCallback` optimizations are typically unnecessary and may interfere with the compiler's optimizations.
- **Keys in Lists:** Always use stable keys in lists to help virtual DOM diffing. Avoid using array indices as keys unless the list is static.
- **Avoid Inline Styles:** Inline styles can trigger layout thrashing. Prefer CSS classes.
- **CSS Animations:** Use CSS transitions/animations over JavaScript for smoother, GPU-accelerated effects.
- **Defer Non-Critical Rendering:** Use `requestIdleCallback` or similar to defer work until the browser is idle.

### Asset Optimization

- **Image Compression:** Use tools like ImageOptim, Squoosh, or TinyPNG. Prefer modern formats (WebP, AVIF) for web delivery.
- **SVGs for Icons:** SVGs scale well and are often smaller than PNGs for simple graphics.
- **Minification and Bundling:** Use Webpack, Rollup, or esbuild to bundle and minify JS/CSS. Enable tree-shaking to remove dead code.
- **Cache Headers:** Set long-lived cache headers for static assets. Use cache busting for updates.
- **Lazy Loading:** Use `loading="lazy"` for images, and dynamic imports for JS modules/components.
- **Font Optimization:** Use only the character sets you need. Subset fonts and use `font-display: swap`.

### JavaScript Performance

- **Avoid Blocking the Main Thread:** Offload heavy computation to Web Workers.
- **Debounce/Throttle Events:** For scroll, resize, and input events, use debounce/throttle to limit handler frequency.
- **Memory Leaks:** Clean up event listeners, intervals, and DOM references. Use browser dev tools to check for detached nodes.
- **Efficient Data Structures:** Use Maps/Sets for lookups, TypedArrays for numeric data.
- **Avoid Global Variables:** Globals can cause memory leaks and unpredictable performance.
- **Avoid Deep Object Cloning:** Use shallow copies or libraries like lodash's `cloneDeep` only when necessary.

### Accessibility and Performance

- **Accessible Components:** Ensure ARIA updates are not excessive. Use semantic HTML for both accessibility and performance.
- **Screen Reader Performance:** Avoid rapid DOM updates that can overwhelm assistive tech.

### Common Frontend Pitfalls

- Loading large JS bundles on initial page load.
- Not compressing images or using outdated formats.
- Failing to clean up event listeners, causing memory leaks.
- Overusing third-party libraries for simple tasks.
- Ignoring mobile performance (test on real devices!).

### Frontend Troubleshooting

- Use Chrome DevTools' Performance tab to record and analyze slow frames.
- Use Lighthouse to audit performance and get actionable suggestions.
- Use WebPageTest for real-world load testing.
- Monitor Core Web Vitals (LCP, FID, CLS) for user-centric metrics.

---

## Backend Performance

### Language/Framework-Specific Tips

#### Node.js

- Use asynchronous APIs; avoid blocking the event loop (e.g., never use `fs.readFileSync` in production).
- Use clustering or worker threads for CPU-bound tasks.
- Limit concurrent open connections to avoid resource exhaustion.
- Use streams for large file or network data processing.
- Profile with `clinic.js`, `node --inspect`, or Chrome DevTools.

### Common Backend Pitfalls

- Synchronous/blocking I/O in web servers.
- Not using connection pooling for databases.
- Over-caching or caching sensitive/volatile data.
- Ignoring error handling in async code.
- Not monitoring or alerting on performance regressions.

### Backend Troubleshooting

- Use flame graphs to visualize CPU usage.
- Use distributed tracing (OpenTelemetry, Jaeger, Zipkin) to track request latency across services.
- Use heap dumps and memory profilers to find leaks.
- Log slow queries and API calls for analysis.

---

## Code Review Checklist for Performance

- [ ] Are there any obvious algorithmic inefficiencies (O(n^2) or worse)?
- [ ] Are data structures appropriate for their use?
- [ ] Are there unnecessary computations or repeated work?
- [ ] Is caching used where appropriate, and is invalidation handled correctly?
- [ ] Are database queries optimized, indexed, and free of N+1 issues?
- [ ] Are large payloads paginated, streamed, or chunked?
- [ ] Are there any memory leaks or unbounded resource usage?
- [ ] Are network requests minimized, batched, and retried on failure?
- [ ] Are assets optimized, compressed, and served efficiently?
- [ ] Are there any blocking operations in hot paths?
- [ ] Is logging in hot paths minimized and structured?
- [ ] Are performance-critical code paths documented and tested?
- [ ] Are there automated tests or benchmarks for performance-sensitive code?
- [ ] Are there alerts for performance regressions?
- [ ] Are there any anti-patterns (e.g., SELECT \*, blocking I/O, global variables)?
- [ ] **React Compiler Workspace:** Avoid manual `React.memo`, `useMemo`, `useCallback` unless there's a specific compelling reason, as React Compiler handles these optimizations automatically

---

## Advanced Topics

### Profiling and Benchmarking

- **Profilers:** Use language-specific profilers (Chrome DevTools) to identify bottlenecks.
- **Microbenchmarks:** Write microbenchmarks for critical code paths. Use `benchmark.js`.
- **A/B Testing:** Measure real-world impact of optimizations with A/B or canary releases.
- **Continuous Performance Testing:** Integrate performance tests into CI/CD.

### Mobile Performance

- **Startup Time:** Lazy load features, defer heavy work, and minimize initial bundle size.
- **Image/Asset Optimization:** Use responsive images and compress assets for mobile bandwidth.

---

## Practical Examples

### Example 1: Debouncing User Input in JavaScript

```javascript
// BAD: Triggers API call on every keystroke
input.addEventListener('input', (e) => {
  fetch(`/search?q=${e.target.value}`);
});

// GOOD: Debounce API calls
let timeout;
input.addEventListener('input', (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch(`/search?q=${e.target.value}`);
  }, 300);
});
```

### Example 4: Lazy Loading Images in HTML

```html
<!-- BAD: Loads all images immediately -->
<img src="large-image.jpg" />

<!-- GOOD: Lazy loads images -->
<img src="large-image.jpg" loading="lazy" />
```

### Example 5: Asynchronous I/O in Node.js

```javascript
// BAD: Blocking file read
const data = fs.readFileSync('file.txt');

// GOOD: Non-blocking file read
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  // process data
});
```

---

## References and Further Reading

- [Google Web Fundamentals: Performance](https://web.dev/performance/)
- [MDN Web Docs: Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [OpenTelemetry](https://opentelemetry.io/)

---

## Conclusion

Performance optimization is an ongoing process. Always measure, profile, and iterate. Use these best practices, checklists, and troubleshooting tips to guide your development and code reviews for high-performance, scalable, and efficient software. If you have new tips or lessons learned, add them here—let's keep this guide growing!

---

<!-- End of Performance Optimization Instructions -->
