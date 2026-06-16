<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-06-16 | Updated: 2026-06-16 -->

# workflows

## Purpose
GitHub Actions CI/CD workflow definitions for repository automation.

## Key Files

| File | Description |
|------|-------------|
| `stale.yaml` | Automated stale issue/PR management — closes inactive issues after 10 days |

## For AI Agents

### Working In This Directory
- Workflow files use YAML syntax
- Currently only the stale issue management workflow is configured
- The stale workflow runs daily via cron schedule and can also be manually triggered via `workflow_dispatch`

<!-- MANUAL: -->
