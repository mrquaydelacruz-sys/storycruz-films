'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'storycruz-films',
  title: 'Story Cruz Films',
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  schema,
  plugins: [structureTool({ structure })],
})
