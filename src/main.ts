import * as core from '@actions/core'
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

    const pr = await github.getPR()

    if (!_.includes(pr.user.login, 'dependabot')) {
      const Asana = require('asana')

      let client = Asana.ApiClient.instance
      let token = client.authentications['token']
      token.accessToken = core.getInput('ASANA_PAT')

      let tasksApiInstance = new Asana.TasksApi()
      let body = {
        data: {
          name: pr.title,
          completed: false,
          html_notes: '<body>Github PR: ' + pr.html_url + '</body>',
          is_rendered_as_separator: false,
          custom_fields: {
            '1200104134002768': '1200104134002769',
            '1200104134631161': '1200104134631162'
          },
          projects: ['1200104507062793']
        }
      }

      // POST - Create a task
      const task = await tasksApiInstance.createTask(body, {})

      github.updatePRDescription(pr, task)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
