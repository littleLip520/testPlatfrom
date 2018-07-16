import { TestStore, TestStores, ProductLineStore, SystemStore, ServiceStore, CustomerStore,
  ExceptionStore, MilestoneStore, PipelineStore, StrategyStore,
  DefectStatusStore, DefectSeverityStore, DefectPriorityStore, TeamStore, ProductVersionStore
} from './stores';
import IterationStore from './stores/iterationStore';
import IterationAction from './actions/iterationAction';
import { TestAction, TestActions, ProductLineAction, SystemAction, ServiceAction, CustomerAction,
  ExceptionAction, PipelineAction, MilestoneAction,StrategyAction,DefectStatusAction,
  DefectSeverityAction,DefectPriorityAction,TeamAction,ProductVersionAction,
} from './actions';
import BasicAction from './actions/basicAction';
import BasicStore from './stores/basicStore';
import DefectStore from './stores/defectStore';
import DefectAction from './actions/defectAction';

const store = {
  test: new TestStore(),
  test2: new TestStores(),
  productLineStore: new ProductLineStore(),
  systemStore: new SystemStore(),
  serviceStore: new ServiceStore(),
  customerStore: new CustomerStore(),
  exceptionStore: new ExceptionStore(),
  piplineStore: new PipelineStore(),
  milestoneStore: new MilestoneStore(),
  strategyStore: new StrategyStore(),
  iterationStore: new IterationStore(),
  basicStore: new BasicStore(),
  defectStore: new DefectStore(),
  defectStatusStore: new DefectStatusStore(),
  defectSeverityStore: new DefectSeverityStore(),
  defectPriorityStore: new DefectPriorityStore(),
  teamStore: new TeamStore(),
  productVersionStore: new ProductVersionStore(),
};

const action = {
  test: new TestAction(store),
  test2: new TestActions(store),
  productLineAction: new ProductLineAction(store),
  systemAction: new SystemAction(store),
  serviceAction: new ServiceAction(store),
  customerAction: new CustomerAction(store),
  exceptionAction: new ExceptionAction(store),
  piplineAction: new PipelineAction(store),
  milestoneAction: new MilestoneAction(store),
  strategyAction: new StrategyAction(store),
  iterationAction: new IterationAction(store),
  basicAction: new BasicAction(store),
  defectAction: new DefectAction(store),
  defectStatusAction: new DefectStatusAction(store),
  defectSeverityAction: new DefectSeverityAction(store),
  defectPriorityAction: new DefectPriorityAction(store),
  teamAction: new TeamAction(store),
  productVersionAction: new ProductVersionAction(store),
};

const externalLink="http://120.27.241.17/zentaopms/www/";

export default {
  store,
  action,
  externalLink
};
