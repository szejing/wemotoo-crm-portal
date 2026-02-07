# Serena MCP First

For wemotoo-crm-portal, the workspace rule **serena-mcp-first.mdc** requires:

- **Activate project first:** Use `mcp_serena_activate_project` with project `wemotoo-crm-portal` when starting work on the portal.
- **Prefer Serena tools** for codebase analysis and edits: get_symbols_overview, find_symbol, find_referencing_symbols, search_for_pattern, read_file; for edits: replace_symbol_body, replace_content, insert_after_symbol, insert_before_symbol.
- **Use memories** (read_memory, list_memories) for overview, commands, conventions, task completion, and business domains.

Other tools (grep, terminal, etc.) can be used in addition, but for locating and modifying portal code, run Serena MCP first and use its project context and symbol-aware tools.
