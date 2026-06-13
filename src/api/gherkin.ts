import fs from 'node:fs/promises'
import path from 'node:path'
import { makeSourceEnvelope } from '@cucumber/gherkin'
import {
  GherkinStreams,
  IGherkinStreamOptions,
} from '@cucumber/gherkin-streams'
import { Envelope, IdGenerator, ParseError } from '@cucumber/messages'
import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import { IFilterablePickle } from '../filter'
import { ISourcesCoordinates } from './types'

export async function getPicklesAndErrors({
  newId,
  cwd,
  sourcePaths,
  coordinates,
  onEnvelope,
}: {
  newId: IdGenerator.NewId
  cwd: string
  sourcePaths: string[]
  coordinates: ISourcesCoordinates
  onEnvelope?: (envelope: Envelope) => void
}): Promise<{
  filterablePickles: readonly IFilterablePickle[]
  parseErrors: ParseError[]
}> {
  const gherkinQuery = new GherkinQuery()
  const parseErrors: ParseError[] = []
  await gherkinFromPaths(
    sourcePaths,
    {
      newId,
      relativeTo: cwd,
      defaultDialect: coordinates.defaultDialect,
    },
    (envelope) => {
      gherkinQuery.update(envelope)
      if (envelope.parseError) {
        parseErrors.push(envelope.parseError)
      }
      onEnvelope?.(envelope)
    }
  )
  const filterablePickles = gherkinQuery.getPickles().map((pickle) => {
    const gherkinDocument = gherkinQuery
      .getGherkinDocuments()
      .find((doc) => doc.uri === pickle.uri)
    const location = gherkinQuery.getLocation(
      pickle.astNodeIds[pickle.astNodeIds.length - 1]
    )
    return {
      gherkinDocument,
      location,
      pickle,
    }
  })
  return {
    filterablePickles,
    parseErrors,
  }
}

function getSourceUri(filePath: string, relativeTo?: string): string {
  if (!relativeTo) {
    return filePath
  }
  const relativePath = path.relative(relativeTo, filePath)
  /*
   * Keep the original path for sources that resolve outside `relativeTo`,
   * such as virtual file systems like Bun's embedded `/$bunfs`, where a
   * relative URI would be meaningless.
   */
  return relativePath.startsWith('..') ? filePath : relativePath
}

async function gherkinFromPaths(
  paths: string[],
  options: IGherkinStreamOptions,
  onEnvelope: (envelope: Envelope) => void
): Promise<void> {
  /*
   * Read the sources ourselves rather than letting `GherkinStreams.fromPaths`
   * stream them, so we support file systems that don't implement
   * `fs.createReadStream` (e.g. Bun's embedded `/$bunfs`).
   */
  const sources = await Promise.all(
    paths.map(async (filePath) =>
      makeSourceEnvelope(
        await fs.readFile(filePath, 'utf-8'),
        getSourceUri(filePath, options.relativeTo)
      )
    )
  )
  return new Promise((resolve, reject) => {
    const gherkinMessageStream = GherkinStreams.fromSources(sources, options)
    gherkinMessageStream.on('data', onEnvelope)
    gherkinMessageStream.on('end', resolve)
    gherkinMessageStream.on('error', reject)
  })
}
