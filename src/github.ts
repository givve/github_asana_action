const axios = require('axios')

const octoAuth = require('@octokit/auth-action')
const Request = require('@octokit/request')

import * as core from '@actions/core'

export class GitHub {
  private requestWithAuth: any

  constructor() {}

  async performAuth() {
    const auth = octoAuth.createActionAuth()
    const authentication = await auth()
    this.requestWithAuth = Request.request.defaults({
      request: {
        hook: auth.hook
      },
      mediaType: {
        previews: ['machine-man']
      }
    })
  }

  async getPR(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { data: issue, error: error } = await this.requestWithAuth(
        'GET /repos/{owner}/{repo}/issues/{pull_number}',
        {
          owner: 'givve',
          repo: 'givve',
          pull_number: core.getInput('pull_request') || '7516'
        }
      )

      resolve(issue)
    })
  }

  async updatePRDescription(pr: any, task: any) {
    return new Promise(async (resolve, reject) => {
      // Beschreibung aktualisieren
      await this.requestWithAuth(
        'PATCH /repos/{owner}/{repo}/pulls/{pull_number}',
        {
          owner: 'givve',
          repo: 'givve',
          pull_number: pr.number,
          body:
            pr.body ||
            '' + '\r\n --- \r\n Asana Task: ' + task.data.permalink_url
        }
      )

      resolve(true)
    })
  }
}
