import * as core from '@actions/core'
import { GitHub } from './github.js'
import * as _ from 'lodash'
import * as asana from 'asana'

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

    const client = asana.Client.create().useAccessToken(
      '2/1206483982378697/1208824408454690:c4f53eae40f6660b5ee537081212094a'
      //core.getInput('ASANA_PAT')
    )
    client.users
      .me()
      .then(user => {
        console.log(`Hello, ${user.name}`)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
