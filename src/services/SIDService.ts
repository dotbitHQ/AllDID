import { EnsService } from './EnsService'

export class SIDService extends EnsService {
  serviceName = 'sid'

  isSupported (name: string): boolean {
    return /^.+\.bnb$/.test(name)
  }
}
