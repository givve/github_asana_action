import * as core from '@actions/core'
import { checkOrWait } from './wait.js'
import { getLocks, setLock } from './semaphore.js'
import { GitHub } from './github.js'
import * as _ from 'lodash'

const https = require('https')

const octoAuth = require('@octokit/auth-action')
const Request = require('@octokit/request')

const component = core.getInput('component')
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const github = new GitHub()
    await github.performAuth()

    console.log(await github.getPR())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
