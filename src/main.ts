import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const octokit = getOctokit(process.env.GITHUB_TOKEN || '')

    const ms: string = core.getInput('milliseconds')
    core.debug(JSON.stringify(context.payload))
    core.debug('###################################')
    const response = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'closed',
      base: 'main',
      sort: 'updated',
      direction: 'desc'
    })
    core.debug(JSON.stringify(response.data))
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
