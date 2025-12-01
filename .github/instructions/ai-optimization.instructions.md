---
description: 'AI assistant optimization techniques for efficient context usage and faster responses'
applyTo: '**'
---

# AI Assistant Optimization Instructions

This file contains guidelines for optimizing AI assistant performance through prompt caching and batch processing techniques.

## Prompt Caching

**Objective**: Minimize token usage and improve response times by maximizing cache hits from the Anthropic prompt caching feature.

### Cache-Friendly Patterns

**✅ DO: Batch Read Operations**

When gathering context, batch all read operations together in a single parallel call. This creates a consistent context that can be cached efficiently.

**Example:**

```
Good: Read 3 files + search in parallel → 1 cache-friendly turn
Bad: Read file 1 → Read file 2 → Read file 3 → 3 separate turns with different contexts
```

**✅ DO: Read Large Sections**

Read larger file sections (e.g., 1000-2000 lines) instead of many small reads. This creates more stable context patterns.

**Example:**

```
Good: read_file(lines 1-2000) → 1 large read
Bad: read_file(1-50), read_file(51-100), read_file(101-150) → 3 small reads
```

**✅ DO: Combine Independent Context Gathering**

When starting multi-step tasks, gather all necessary context in the first turn:

```
Step 1 (parallel): Read component + test + related files + search for patterns
Step 2: Analyze and plan
Step 3: Implement changes
```

**❌ DON'T: Sequential Context Gathering**

Avoid gathering context one piece at a time when you know you'll need multiple pieces:

```
Bad Pattern:
Turn 1: Read component
Turn 2: Read test file
Turn 3: Read interface
Turn 4: Search for usage
```

### Deduplication Strategy

When batching read operations:

1. **Collect all file paths** you plan to read
2. **Deduplicate paths** before making calls
3. **Make one parallel batch** with unique paths
4. **Process results** together

## Batch Processing

**Objective**: Minimize round trips and improve efficiency by processing multiple independent operations together.

### When to Batch

**✅ Context Discovery Phase**

Batch all initial context gathering:

- File reads
- Code searches
- Semantic searches
- Directory listings
- Error checks

**✅ Independent File Modifications**

When modifying multiple files that don't depend on each other, batch the edits:

```
Good: Update 5 config files in parallel
Bad: Update config 1 → wait → Update config 2 → wait...
```

**✅ Test Execution**

Run multiple independent test suites in parallel when possible (though note: NX handles this automatically).

### When NOT to Batch

**❌ Dependent Operations**

Don't batch operations where one depends on the output of another:

```
Bad: Read file + Edit file (need to read first to know what to edit)
Good: Read file → Analyze → Edit file
```

**❌ Iterative Debugging**

When debugging, you need to see results before deciding next steps.

**❌ Complex Multi-Step Workflows**

Break complex workflows into logical phases rather than trying to batch everything.

## Practical Workflow Patterns

### Pattern 1: Context Gathering for New Feature

```
Turn 1 (Parallel):
- semantic_search for relevant code
- read_file for main component
- read_file for related interfaces
- grep_search for usage patterns
- list_dir for project structure

Turn 2: Analyze and plan (based on all context)

Turn 3 (Parallel if independent):
- Create/modify files as needed
```

### Pattern 2: Bug Investigation

```
Turn 1 (Parallel):
- get_errors for current issues
- read_file for failing component
- read_file for test file
- grep_search for error patterns

Turn 2: Analyze root cause

Turn 3: Implement fix

Turn 4: Verify with tests
```

### Pattern 3: Multi-File Refactoring

```
Turn 1 (Parallel):
- Read all files to be modified
- Search for usage patterns
- Check for dependencies

Turn 2: Plan refactoring strategy

Turn 3 (Parallel if independent):
- Modify file 1
- Modify file 2
- Modify file 3

Turn 4 (Parallel):
- Run tests
- Check for errors
- Lint modified files
```

## Progress Updates

When executing batched operations, provide a brief progress update after completion before proceeding to the next phase:

```
✅ Good:
"I've gathered all the context from 5 files and 2 searches. Now analyzing the component structure..."

❌ Bad:
[No update, immediately proceeds to next step]
```

This helps users understand progress without being verbose.

## Performance Metrics to Consider

- **Token Usage**: Batching reduces total tokens by minimizing repeated context
- **Response Time**: Fewer turns = faster completion
- **Cache Hit Rate**: Consistent context patterns improve caching
- **User Experience**: Clear progress updates maintain engagement

## Advanced Token Reduction Techniques

### Strategic Tool Selection

**✅ Use grep_search for File Overviews**

Before reading an entire file, use `grep_search` with `includePattern` to get an overview:

```
Good: grep_search with specific file → See structure → Read targeted sections
Bad: Read entire 2000-line file → Realize you only need 50 lines
```

**✅ Prefer semantic_search for Exploration**

When exploring unfamiliar code, use `semantic_search` instead of multiple grep searches:

```
Good: semantic_search("authentication flow") → Get relevant snippets from multiple files
Bad: grep_search "auth" → grep_search "login" → grep_search "session" → Multiple queries
```

**✅ Use includePattern to Limit Scope**

Always use `includePattern` in grep_search to reduce noise:

```
Good: grep_search("useState", includePattern="libs/ui-kit/**/*.tsx")
Bad: grep_search("useState") → Returns results from node_modules and all projects
```

**✅ Use file_search Before Reading**

Find files by pattern before reading:

```
Good: file_search("**/*button*.tsx") → Read specific files found
Bad: list_dir multiple times → Guess filenames → Read wrong files
```

### Avoid Redundant Operations

**❌ Don't Re-read Files Already in Context**

If you've already read a file in the same conversation turn, don't read it again:

```
Bad Pattern:
Turn 1: Read component.tsx (lines 1-100)
Turn 2: Read component.tsx (lines 1-100) again
```

**❌ Don't Check Errors Multiple Times**

Get errors once per phase, not after every single change:

```
Good: Make 3 related changes → Check errors once
Bad: Change 1 → Check errors → Change 2 → Check errors → Change 3 → Check errors
```

**❌ Don't Search for What You Already Know**

Use information already in context instead of searching again:

```
Bad: User mentions file path → Search for the file anyway
Good: User mentions file path → Directly read/edit it
```

### Targeted Reading Strategies

**✅ Read Targeted Line Ranges**

When you know approximately where code is, read specific sections:

```
Good: Read lines 1-100 for imports, 200-300 for the function
Bad: Read entire 1000-line file when you only need 2 sections
```

**✅ Use grep_search to Find Line Numbers**

Use grep to locate code, then read specific ranges:

```
Step 1: grep_search to find function location
Step 2: Read targeted 50-line range around the function
Bad: Read entire file searching for the function
```

### Response Optimization

**✅ Be Concise in Updates**

Provide brief, informative updates without excessive detail:

```
Good: "Reading component and test files in parallel..."
Bad: "Now I'm going to read the component file to understand its structure and implementation details, then I'll read the test file to see how it's tested, and then..."
```

**✅ Combine Multiple Edits in Planning**

When making multiple changes, describe them together:

```
Good: "I'll update 3 files: add type, fix import, update test"
Bad: "First I'll add the type... [change] ... Now I'll fix the import... [change] ... Now I'll update the test..."
```

**❌ Don't Repeat Large Code Blocks**

When showing changes, describe them instead of repeating entire files:

```
Good: "Updated the handleClick function to use async/await"
Bad: [Pastes entire 200-line file with one function changed]
```

### Planning Before Tool Calls

**✅ Think Strategically First**

Before making tool calls, plan what you need:

```
Good:
- Identify what context is needed
- Determine which files to read
- Batch all reads together
- Execute plan

Bad:
- Read file A
- Realize need file B
- Read file B
- Realize need file C
- Read file C
```

**✅ Use Regex in grep_search**

Combine multiple searches into one regex pattern:

```
Good: grep_search("function|method|procedure", isRegexp=true)
Bad: grep_search("function") → grep_search("method") → grep_search("procedure")
```

## Anti-Patterns to Avoid

1. **Micro-reads**: Reading tiny file sections repeatedly
2. **Sequential Searches**: Running searches one at a time
3. **Premature Actions**: Acting before gathering sufficient context
4. **Over-batching**: Batching dependent operations that need sequential execution
5. **Silent Processing**: Batching without progress updates
6. **Redundant Reads**: Re-reading files already in context
7. **Exploratory Tool Calls**: Making tool calls without a clear plan
8. **Verbose Responses**: Excessive explanations or code repetition
9. **Scope Creep in Searches**: Searching entire workspace instead of targeted directories
10. **Over-checking**: Validating after every tiny change instead of batching validation

## Summary

**Key Principles:**

1. **Batch independent read operations** in single parallel calls
2. **Read larger sections** instead of many small reads
3. **Gather context upfront** before analysis/implementation
4. **Deduplicate** file paths before batching
5. **Provide brief updates** after batched operations
6. **Don't batch dependent** operations
7. **Balance efficiency** with clarity
8. **Use strategic tool selection** (grep_search for overviews, semantic_search for exploration)
9. **Avoid redundant operations** (don't re-read files, don't over-check)
10. **Read targeted ranges** instead of entire files
11. **Plan before executing** to minimize exploratory tool calls
12. **Be concise** in responses without sacrificing clarity
13. **Use regex and patterns** to combine multiple searches

**Expected Impact:**

- **60-80% reduction** in redundant tool calls
- **40-60% reduction** in tokens from targeted reading
- **30-50% faster** response times from better caching
- **Improved UX** from more focused, actionable responses

By following these patterns, you'll maximize prompt caching benefits, reduce token usage, and provide faster, more efficient responses.

<!-- End of AI Optimization Instructions -->
