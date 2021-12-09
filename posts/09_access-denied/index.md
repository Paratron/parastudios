---
title: Access denied for 'root'@'localhost'
slug: access-denied-for-root-at-localhost
publishTime: "2021-12-09 18:00:00"
description: MySQL won't let me authenticate as root user through an SSH tunnel in dbeaver.
tags: ["knowledge", "mysql", "ssh", "dbeaver"]  
---

# Access denied for 'root'@'localhost'

I had the case where I tried to connect to a remote MySQL server through an SSH tunnel with [dbeaver](https://dbeaver.io/).

The tunnel itself worked fine - I was able to create a connection but the server refused connecting and identifying as root user to the database. This happened on an old DigitalOcean Droplet with MySQL 5 installed where I was running a bunch of legacy websites.

I pulled my hair and tried a couple of approaches around the `localhost` part - because MySQL can be restrictive here - `localhost != 127.0.0.1`. But it never worked out.

When I created an SSH connection to the server, running the command `mysql -uroot` worked just fine - I was connected as root user immediately. It didn't even ask for a password. I assumed the authentication happened through an SSH key but I was wrong. The following command shined some light on the issue:

```sql
SELECT user, authentication_string, plugin, host FROM mysql.user;
```

It spits out a list of existing users of your MySQL server, what plugin the user uses for authentication and what hosts are allowed to connect.

<pre>
+==================+===========================================+=======================+===========+
| user             | authentication_string                     | plugin                | host      |
+==================+===========================================+=======================+===========+
| root             |                                           | auth_socket           | localhost |
| mysql.session    | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| mysql.sys        | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| debian=sys=maint | *B5285813215392D85D7FA77AD05C24FF6AA515AB | mysql_native_password | localhost |
| [redacted]       | *[redacted]4D1ACBE6B5B9F393AA0648D54DB938 | mysql_native_password | localhost |
| [redacted]       | *[redacted]9CBDA80219F58DFDA56F563187B2EC | mysql_native_password | localhost |
| [redacted]       | *[redacted]7CACDAAE0227BABE71F28CAAC9BEF5 | mysql_native_password | localhost |
+==================+===========================================+=======================+===========+
</pre>

Appearantly, the `root` user does not have a password set (`authentication_string` is empty). Also, it does not even use the `mysql_native_password` plugin for authentication but the `auth_socket` plugin.

This means: as long as I connect from the `mysql` command on the same machine as the MySQL server, I can login as root user just fine. Through SSH, not.

The fix is rather easy. We switch the auth plugin and set a password:

```sql
ALTER USER 'root'@'localhost IDENTIFIED WITH mysql_native_password BY 'MySuperSecurePassword@123';
```

And thats it! After I updated the root user this way, I was able to connect to my MySQL server through an SSH tunnel in dbeaver just fine.

Hope this note helps anyone :)
