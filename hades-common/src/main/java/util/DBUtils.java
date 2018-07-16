package util;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.MapHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 *  apache DbUtil 工具类封装
 */
public class DBUtils {
    private  MysqlDataSource ds_mysql=null;//MySQL
//    private  OracleDataSource ds_oracle=null;//Oracle
    private  QueryRunner runner=null;//查询对象

    public DBUtils(){
        super();
    }

    /**
     *  工具类对象创建时 同时创建QueryRunner
     * @param dbType 数据库类型
     * @param url jdbc连接
     * @param user 用户名
     * @param pass 密码
     * @throws Exception
     */
    public DBUtils(DbTypeEnum dbType, String url, String user, String pass) throws Exception{
        super();
        if(dbType.equals(DbTypeEnum.MYSQL)){
            ds_mysql = new MysqlDataSource();
            ds_mysql.setUrl(url);
            ds_mysql.setUser(user);
            ds_mysql.setPassword(pass);
            runner = new QueryRunner(ds_mysql);
        }else{
        }
    }

    public enum DbTypeEnum {
        MYSQL, ORACLE, SQLLITE
    }

    public static void main(String[] arg){
/*        try {
            DBUtils d =
                    new DBUtils(DbTypeEnum.MYSQL,"jdbc:mysql://10.1.1.135:3306/autotest?useUnicode=true&characterEncoding=utf-8","autotest","autotest");
            List<Map<String,Object>> list = d.findMapList("select * from t_bug");
            Map<String,Object> obj1 = list.get(0);
            for(Map.Entry<String,Object> entry : obj1.entrySet()){
                System.out.println("键： " + entry.getKey() + " 值： " + entry.getValue());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        try {
            DBUtils d =
                    new DBUtils(DbTypeEnum.MYSQL,"jdbc:mysql://10.1.1.135:3306/autotest?useUnicode=true&characterEncoding=utf-8","autotest","autotest");
            d.batch("select * from t_bug;select * from t_bug;", new String[][]{});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据参数获取DS对象（暂时不用）
     * @param dbType
     * @param url
     * @param user
     * @param pass
     * @return
     * @throws SQLException
     */
    public DataSource getDataSource(DbTypeEnum dbType,String url,String user,String pass) throws SQLException {
        DataSource dataSource = null;

        if(dbType.equals("MYSQL")){
            ds_mysql = new MysqlDataSource();
            ds_mysql.setUrl(url);
            ds_mysql.setUser(user);
            ds_mysql.setPassword(pass);
            return  ds_mysql;
        }else {
            return null;
        }
    }


    /**
     * 根据SQL返回MapList集合
     * @param sql
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> findMapList(String sql) throws SQLException {
        List<Map<String, Object>> list = runner.query(sql,
                new MapListHandler(new BasicRowProcessorEx()),
                (Object[]) null);
        return list;
    }

    /**
     * 根据SQL返回单个对象
     * @param sql
     * @param className
     * @return
     * @throws Exception
     */
    public Object findBeanObject(String sql,Class className) throws SQLException {
        Object list = runner.query(sql, new BeanListHandler<Class>(className));
        return list;
    }

    /**
     * 根据SQL返回单个Map对象
     * @param sql
     * @return
     * @throws Exception
     */
    public Object findMapObject(String sql) throws SQLException {
        Map<String, Object> map = runner.query(sql, new MapHandler());
        return  map;
    }

    /**
     * 根据SQL返回单个值
     * @param sql
     * @return
     * @throws Exception
     */
    public int findScalar(String sql) throws SQLException{
        Object obj = runner.query(sql, new ScalarHandler());
        int i = Integer.valueOf(obj.toString());
        return i;
    }


    /**
     * 执行SQL语句(单条SQL)
     * @param sql
     * @return
     */
    public int execute(String sql) throws SQLException{
        int result = 0;
        result = runner.execute(sql);
        return result;
    }

    /**
     * 批量执行SQL语句
     */
    public void batch(String sql,Object[][] params) throws SQLException{
         runner.batch(sql, params);
    }

    /**
     * 根据SQL执行更新操作
     * @param sql
     * @return
     */
    public int update(String sql) throws SQLException{
        int result = 0;
        result = runner.update(sql);
        return result;
    }

    /**
     * 根据SQL & 参数 执行更新操作
     * @param sql
     * @param param
     * @return
     */
    @SuppressWarnings("unchecked")
    public int update(String sql,String... param) throws SQLException{
        int result = 0;
        result = runner.update(sql,param);
        return result;
    }
}
