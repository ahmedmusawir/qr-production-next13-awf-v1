# Recovery State
Last action: Deployment documentation suite created — /docs/deployment/ (6 files)
Pending: NONE
Next step: Review docs, commit to main. See docs/deployment/ for all deployment docs. See doc/deploy.md for quick re-deploy steps.

Live URL: https://qrtickets.cyberizewebdevelopment.com
DO box: 157.230.43.210
App path: ~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1
Branch: main

THE ONE THING TO REMEMBER:
Every NEXT_PUBLIC_* var used client-side MUST be a build arg in Dockerfile + docker-build.sh.
Runtime env vars (.env.production via --env-file) only reach server-side code.
