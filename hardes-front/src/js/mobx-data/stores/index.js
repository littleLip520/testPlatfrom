import { observable } from 'mobx';

export class TestStore {
  @observable num = 1;
}

export class TestStores {
  @observable title = 'zombie';
}


export class ProductLineStore {
  @observable productLines = null;
}

export class SystemStore {
  @observable allSystems = null;
}

export class ServiceStore {
}

export class CustomerStore{
  @observable allCustomers = null;
}

export class ExceptionStore{}

export class MilestoneStore{}
export class StrategyStore{
  @observable allStrategy = null;
}
export class PipelineStore{}

export class DefectStatusStore {
  @observable allDefectStatus = null;
}

export class DefectSeverityStore {
  @observable allSeverities = null;
}

export class DefectPriorityStore {
  @observable allPriorites = null;
}

export class TeamStore {
  @observable allTeams = null;
}

export class ProductVersionStore {
  @observable allProductVersions = null;
}