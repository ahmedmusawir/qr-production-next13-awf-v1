# Claude Hooks

## block-off-mission.sh

Purpose:
Prevent Claude Code from drifting away from the emergency restore mission.

This hook currently blocks:

- Next.js production build commands
- Google Cloud commands
- Vercel/Netlify deployment drift
- sudo/root-ish shell behavior
- dangerous deletes
- git push / hard reset / aggressive clean
- production-specific Docker patterns

Mission:
Emergency Dockerized `next dev` restore on existing DigitalOcean fallback box.

If the mission changes later, update the blocked patterns accordingly.
