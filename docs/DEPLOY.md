# Deploying

The live site (themarketfiles.com) is served by the Vercel project `market-files-staging`,
connected to the GitHub repo `marketfiles/market-files1`. A merge to `main` builds and publishes
a production deployment. Pull requests get preview deployments.

Run `npm run experience:check` before merging; it confirms the generated files match
`experience/source/market-files.html`.
