因为是基于Java运行的微服务程序，所以，你需要安装Java环境（感觉这是句废话…），在Linux下安装Java其实是一件很简单的事，下面以在Centos 6.8/6.9系统下的安装为例。

### 1、检查系统是否有Java
```
[root@VM-0-12-centos ~]# java
-bash: java: command ~ found
[root@VM-0-12-centos ~]# java -v
-bash: java: command not found
[root@VM-0-12-centos ~]# java -version
-bash: java: command not found
```
很遗憾，无法执行java命令，更没法去运行jar包了。

### 2、yum查看可安装Java包
```
[root@VM-0-12-centos usdt]# yum list java*
```
可安装的软件包
```
java-1.5.0-gcj.x86_64                     1.5.0.0-29.1.el6                      os     
java-1.5.0-gcj-devel.x86_64            1.5.0.0-29.1.el6                      os     
java-1.5.0-gcj-javadoc.x86_64        1.5.0.0-29.1.el6                       os     
java-1.5.0-gcj-src.x86_64               1.5.0.0-29.1.el6                       os     
java-1.6.0-openjdk.x86_64             1:1.6.0.41-1.13.13.1.el6_8       os     
java-1.6.0-openjdk-demo.x86_64    1:1.6.0.41-1.13.13.1.el6_8       os
....................
```
控制台输出了很多可以用于安装的包，我们选择1.8的包，如下：
```
java-1.8.0-openjdk.x86_64       1:1.8.0.252.b09-2.el6_10       os
```
安装命令如下：
```
[root@VM-0-12-centos ~]# yum install java-1.8.0-openjdk.x86_64
```
静等安装完成后，输入以下命令：
```
[root@VM-0-8-centos ~]# java
用法: java [-options] class [args...]
           (执行类)
   或  java [-options] -jar jarfile [args...]
           (执行 jar 文件)
其中选项包括:
    -d32          使用 32 位数据模型 (如果可用)
    -d64          使用 64 位数据模型 (如果可用)
    -server       选择 "server" VM
                  默认 VM 是 server,
                  因为您是在服务器类计算机上运行。
    -cp <目录和 zip/jar 文件的类搜索路径>
    -classpath <目录和 zip/jar 文件的类搜索路径>
                  用 : 分隔的目录, JAR 档案
                  和 ZIP 档案列表, 用于搜索类文件。
....................
```
这个时候就可以使用java来运行一些jar包了:
```
[root@VM-0-8-centos exchange]# ll
总用量 558484
-rw-r--r-- 1 root root  40721465 8月   1 01:04 cloud.jar
-rw-r--r-- 1 root root 105173026 8月   1 01:05 exchange-api.jar
-rw-r--r-- 1 root root 105180109 8月   1 01:05 exchange.jar
-rw-r--r-- 1 root root 106993131 8月   1 01:05 market.jar
-rw-r--r-- 1 root root 109531189 8月   4 23:20 ucenter-api.jar
-rw-r--r-- 1 root root 103676574 8月   1 01:05 wallet.jar
[root@VM-0-8-centos exchange]# java -jar cloud.jar
```