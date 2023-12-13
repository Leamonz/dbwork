### 开发环境
- 开发语言：Python 3.11.4
- 后端框架：Flask
- 数据库：Postgresql
- IDE：PyCharm2023
- 静态模板：Bootstrap "Crushit"  https://www.php.cn/xiazai/code/7366

___
_数据库实验期末项目，既然写了就稍微记录一下完成项目过程中学到的内容_
### Flask SQLAlchemy
Flask ORM依赖于第三方SQLAlchemy，需要安装依赖flask_sqlalchemy。
- 参考资料
  - [Flask官方文档](https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/)
  - [SQLAlchemy官方文档](https://docs.sqlalchemy.org/en/20/)

简单来说，ORM将数据库中的一个数据表抽象为Python中的一个对象，对数据库中一条记录的操作相当于对Python中实例化的一个对象的操作。一方面，我们不需要自己写SQL语句，而可以通过调用SQLAlchemy的接口实现增删查改的功能，方便很多；另一方面，因为封装的太好，我们也很难对数据库操作进行优化，程序员与数据库的接触被ORM这一层隔开了。

#### 使用过程中碰到的问题
1. 创建的类要继承 SQLAlchemy().Model
2. 创建的类中一定要有一个属性：**\_\_table\_\_** ，其值为映射到数据库中的数据表名字

