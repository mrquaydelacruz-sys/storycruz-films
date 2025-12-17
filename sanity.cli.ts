/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

// Hardcode these values for deployment so the Studio doesn't crash
const projectId = 'a2hh2h81' 
const dataset = 'production'

export default defineCliConfig({ api: { projectId, dataset } })