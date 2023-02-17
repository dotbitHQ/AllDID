import { AllDID, DotbitService, EnsService, NamingService, PluginTemplate, RecordItem } from 'alldid'

const nostrRecordsMethodsMap = {
  dotbit: async function (this: DotbitService, name: string): Promise<RecordItem[]> {
    return await this.records(name, 'profile.nostr')
  },
  ens: async function (this: EnsService, name: string): Promise<RecordItem[]> {
    return await this.records(name, 'nostr')
  }
}

const nostrRecordMethod = async function (this: NamingService, name: string) {
  const records = await this.nostrs(name)
  return records[0] || null
}

export class PluginNostr implements PluginTemplate {
  onInstall (alldid: AllDID) {
    // install on alldid instance
    alldid.nostrs = async function (this: AllDID, name: string) {
      const service = await this.getServiceOrThrow(name)

      return await service?.nostrs(name)
    }
    alldid.nostr = async function (this: AllDID, name: string) {
      const service = await this.getServiceOrThrow(name)

      return await service?.nostr(name)
    }

    // install on naming services
    alldid.services.forEach(service => {
      service.nostrs = nostrRecordsMethodsMap[service.serviceName]
      service.nostr = nostrRecordMethod
    })
  }
}
