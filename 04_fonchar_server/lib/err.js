var codes = {
	SUCCESS:                          '1049', // 部分接口成功后会返回这个错误码，大部分接口没有使用
	DB_CONN:                          '1051', // 获取数据库连接失败
	DB_OP:                            '1052', // 数据库操作失败
	DB_FK_DEL:                        '1053', // 删除时违反数据库外键约束
	DB_FK_ADD:                        '1054', // 创建时违反数据库外键约束
	UNKNOWN:                          '1099', // 未知错误
  PASSWORD_LEN:                     '1100', // 密码长度不合规范
  USER_INVALID:                     '1106', // 用户账号无效（登录时）
  PASSWORD_INVALID:                 '1107', // 密码无效（登录时）
  USER_NEED_LOGIN:                  '1108', // 用户需要登录
  USER_INACTIVE:                    '1109', // 用户状态为非激活
  USER_NAME_UNIQUE:                 '1110', // 用户名重复
  BCRYPT_MAKE:                      '1111', // 密码生成过程出现错误（一般不会发生）
  BCRYPT_USE:                       '1112', // 密码使用过程出现错误（一般不会发生）
	ARG_CHECK_FAILED:                 '1113', // 请求参数错误
	ILLEGAL_CHANGE_STATE:             '1114', // 非法更新报案状态
	EXCEL_FORMAT_ERROR:               '1115', // 导入excel 模板格式错误
	IMPORT_CASE_NUMBER:               '1116', // 导入excel case_info缺少必填字段 case_number
	IMPORT_REAL_NAME:                 '1117', // 导入excel driver_info缺少必填字段 real_name
	MAKE_DIR_ERROR:                   '1118', // 文件夹创建失败
	READ_FILE_ERROR:                  '1119', // 文件读取失败
	RENAME_FILE_ERROR:                '1120', // 文件重命名失败
	UPLOAD_FILE_ERROR:                '1121', // 文件上传失败
	ADD_WATER_ERROR:                	'1122', // 图片添加水印失败
	SHEET_NON_EMPTY:									'1123', // 没有可导入的数据表
	CHILD_PROCESS_ERROR:							'1124', // 子进程执行发生错误
	CHILD_PROCESS_EXIT:							  '1125', // 子进程退出发生错误
	EXPORT_QUERY_ERROR:							  '1126', // 导出sql查询失败
	IMPORT_FORMAT_ERROR:							'1127', // 导入格式不为 xlsx
	INSERT_LOG_FAIL:                  '1128', // 写入日志失败
	CREATE_CASE_ERROR:                '1129', // 报案信息写入失败
	TIME_REG_ERROR:                   '1130', // excel导入时间格式不对
	NUMBER_REG_ERROR:                 '1131', // excel导入数字格式不对
	LENGTH_REG_ERROR:                 '1132', // excel字段长度超过数据库最大值
	CASE_NUMBER_ERROR:                '1133', // 生成报案号时出错
	CHECK_DATA_ERROR:									'1134', // 传入数据校验失败
};

function SSErr(code, obj, stack){
	this.code = code;
	this.obj = obj;
	this.stack = stack;
	this.wrap = function(){
		return {error_code: code, error_obj: obj};
	};
}

function wrapSSErr(err, code){
	if(err instanceof SSErr){
		return err;
	}
	return new SSErr(code, null, err);
}

module.exports.codes = codes;
module.exports.SSErr = SSErr;
module.exports.wrapSSErr = wrapSSErr;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;