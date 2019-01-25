import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'
const os = require('os')

import { arch, platform } from 'os'

import { TelemetrySource, Persistance } from './Model'

export class ElectronTelemetrySource implements TelemetrySource {
  public systemInfo() {
    return {
      arch: arch(),
      platform: platform(),
      release: os.release(),
    }
  }

  public appVersion(): string {
    return electron.app.getVersion()
  }

  public onException(callback: (err: Error) => void) {
    process.on('unhandledRejection', (error) => {
      callback(error)
    })

    process.on('uncaughtException', (error) => {
      callback(error)
      console.error(error)
      try {
        electron.dialog.showMessageBox({
          type: 'error',
          buttons: [ 'Continue anyway' , 'Crash' ],
          message: `The app has unexpectedly received an error, normal app behavior is no longer guaranteed. ${error.stack || error.message}`,
          title: error.name,
        }, (buttonIdx: number) => {
          if (buttonIdx === 1) {
            process.exit(1)
          }
        })
      } catch(error) {
        console.error('Can\'t show error dialog', error)
        setTimeout(() => process.exit(1), 3000) 
      }
    })
  }
}

export class ElectronStorage implements Persistance {
  private database: string
  constructor(database: string) {
    this.database = database
  }

  public persist(data: string): void {
    try {
      fs.writeFile(this.path(), data, {}, () => {})
    } catch {
      // ignore
    }
  }

  public load(): string | undefined {
    try {
      return fs.readFileSync(this.path()).toString()
    } catch {
      return undefined
    }
  }

  private path(): string {
    return path.join(electron.app.getPath('appData'), electron.app.getName(), `electron-telemetry-${this.database}.json`)
  }
}
