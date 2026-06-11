import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'TEAM Consulting Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'local-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})

