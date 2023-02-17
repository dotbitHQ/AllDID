import { AllDID } from './AllDID'

export abstract class PluginTemplate {
  abstract onInstall (alldid: AllDID): void
}
