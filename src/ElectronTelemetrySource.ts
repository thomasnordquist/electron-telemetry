import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'

import { arch, platform } from 'os'

import { TelemetrySource, Persistance } from './Model'

export class ElectronTelemetrySource implements TelemetrySource {
  public systemInfo() {
    return {
      arch: arch(),
      platform: platform(),
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

      electron.dialog.showMessageBox({
        type: 'error',
        buttons: [ 'Sorry, see you soon!' ],
        message: error.stack || error.message,
        title: error.name,
      }, () => {
        process.exit(1)
      })
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
