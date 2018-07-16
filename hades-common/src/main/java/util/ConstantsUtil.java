package util;

/**
 * 每户通用状态码
 *
 * @author
 *
 */
public class ConstantsUtil {

	// 通用的状态码
	public abstract class CommonCode {
		public static final String FAILED_CODE = "1"; // 获取数据失败状态码
		public static final String SUCCESS_CODE = "0"; // 获取数据成功状态码
		public static final String ERROR_CODE = "3"; // 获取数据出错状态码
		public static final String PARAM_ERROR_CODE = "2"; // 参数传递错误状态码
		public static final String EXCEPTION_CODE = "-99"; // 参数传递错误状态码

		public static final String ERROR_404 = "404";
		public static final String ERROR_500 = "500";

		public static final String NORMAL = "0";// 正常通用码
		public static final String DELETED = "1";// 异常通用码
	}

	// 通用的消息
	public abstract class CommonMessage {
		public static final String FAILED_MESSAGE = "获取数据失败!"; // 获取数据失败
		public static final String SUCCESS_MESSAGE = "请求数据成功!"; // 获取数据失败
		public static final String ERROR_MESSAGE = "请求数据出错!!"; // 获取数据出错!
		public static final String PARAM_ERROR_MESSAGE = "请求参数传递错误!!"; // 参数传递错误
		public static final String COMMON_FAIL_MSG = "网络异常, 请稍后再试";
	}

	/**
	 * 登录存放session中的key
	 *
	 */
	public static class SessionValue {
		public static final String USERNAME = "userName";// 用户登录名
		public static final String CROWD_USER_LIST = "crowdUserList";// 用户列表
		public static final String CHINESE_NAME = "chineseName";// 用户中文姓名
		public static final String EMAILE = "email";// 用户邮箱账号
		public static final String ACTION_LIST = "actionList";// 用户功能链接列表
		public static final String BTN_LIST = "btnList";// 用户按钮列表
	}

	// 角色查询码
	public static class DefaultUserCode {
		public static final String OPERATOR = "operator";// 运维管理组
		public static final String SUPER_MANAGER = "super_manager";// 超级管理员
		public static final String SYS_MANAGER = "sys_manager";// 系统管理员
		public static final String IT_MANAGER = "it_manager";// 系统运维
		public static final String IT_DEVER = "it_dever";// it开发
		public static final String GUEST = "guest";// 未登录
		public static final String ARCHITECT = "architect";// 架构师
		public static final String TEST_MANAGER = "test_manager";// 测试经理

	}

	// 菜单等级
	public static class MenuLevelCode {
		public static final String GRUNDFATHER = "0";// 一级菜单
		public static final String FATHER = "1";// 二级菜单
		public static final String SON = "2";// 三级菜单
	}

	/**
	 * 缓存常用字典表
	 *
	 * @author
	 *
	 */
	public static class Dictionary {
		public static final String DICTIONARY_LIST = "dictionary_list";
		public static final String OPRT_AREA = "oprtArea_list";
	}
	/**
	 * 字典表类型标识
	 *
	 * @author
	 *
	 */
	public static class DictTypeId {

		public static final Integer PROJECT_TYPE = 1;// 项目类型,资源申请类型
		public static final Integer CURRENT_STATUS = 2;// 当前状态
		public static final Integer PROJECT_PRIORITY = 3; //项目优先级
		public static final Integer PROJECT_STYLE = 4; //项目类型
		public static final Integer PRODUCT_LINE= 5; //项目类型
		public static final Integer ACTIVITY_STATUS= 6; //测试活动状态
		public static final Integer DIRECTURL = 7;// 任务跳转地址
		public static final Integer DETAIL_DERECTURL = 8;// 查询任务详情
		public static final Integer ACTIVITY_PROGRESS = 11;// 测试任务进度
		public static final Integer GROUP_TEAM = 23;// 测试团队
		public static final Integer PROJECT_STATUS = 25;// 测试团队
	}

	public static class ProjectStatus {
		public static final String PROJECT_STATUS_0 =  "0";// 已分配
		public static final String PROJECT_STATUS_1 =  "1";// 进行中
		public static final String PROJECT_STATUS_2 =  "2";// 已完成
		public static final String PROJECT_STATUS_3 =  "3";// 已关闭
	}

	public static class ProjectPriority {
		public static final String PROJECT_PRIORITY_P0 =  "P0";// 已分配
		public static final String PROJECT_PRIORITY_P1 =  "P1";// 已分配
		public static final String PROJECT_PRIORITY_P2 =  "P2";// 已分配
		public static final String PROJECT_PRIORITY_P3 =  "P3";// 已分配
	}

	/**
	 * 任务状态码
	 *
	 * @author chenghaiyang
	 *
	 */
	public static class TaskStatus {
		public static final String TASK_ID = "taskId";
	}

	/**
	 * 审批用例状态码
	 */
	public static class CaseStatus {
		public static final String UNSUBMIT_CASE = "1";
		public static final String SUBMIT_CASE = "2";
		public static final String PASS_CASE = "3";
		public static final String FAIL_CASE = "4";
	}
	/**
	 * 版本用例状态码
	 * 1.草稿2.已审批3.已废弃9.已删除
	 */
	public static class versionCaseStatus {
		public static final Integer DRAFT_CASE = 1;
		public static final Integer REVIEWED_CASE = 2;
		public static final Integer ABANDONED_CASE = 3;
		public static final Integer DELETE_CASE = 9;

	}
	/**
	 * 版本用例审核状态
	 * 1.未提交2.已提交3.审核已通过4.审核已拒绝
	 */
	public static class versionCaseApprovalStatus {
		public static final Integer UNSUBMITTED = 1;
		public static final Integer SUBMITTED = 2;
		public static final Integer APPROVAL_SUCCESSED = 3;
		public static final Integer APPROVAL_FAILED = 4;

	}
	/**
	 * 测试类型
	 * 1.用户界面测试2.功能测试3.接口测试4.性能测试5.安全测试6.兼容性测试7.用户场景测试
	 */
	public static class TestingType {
		public static final Integer UI_TESTING = 1;
		public static final Integer FUNCTION_TESTIKNG = 2;
		public static final Integer INTERFACE_TESTING = 3;
		public static final Integer PERFORMANCE_TESTING = 4;
		public static final Integer SECURITE_TESTING = 5;
		public static final Integer COMPATIBILITY_TESTING = 6;
		public static final Integer USER_SCENE_TESTING = 7;

	}
	/**
	 * 用例是否在计划中ww
	 * 1.是;2.否
	 */
	public static class versionCaseIsInPlan {
		public static final Integer INPLAN = 2;
		public static final Integer NOTINPLAN = 1;
	}
}
